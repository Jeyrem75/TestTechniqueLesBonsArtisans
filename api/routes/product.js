const router = require("express").Router();
const bodyParser = require("body-parser");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const getLastProductId = async (products) => {
    const lastProduct = await products.findOne({}, { sort: { _id: -1 }, projection: { _id: 1 } });
    return lastProduct ? lastProduct._id : 0;
};

router.get('/', async (req, res) => {
    const products = req.db.collection('products');

    try {
        const results = await products.find().toArray();

        console.log(results);
        res.status(200).json(results);
    }
    catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    const products = req.db.collection('products');

    try {
        const product = await products.findOne({ _id: parseInt(req.params.id) });

        console.log(product);
        res.status(200).json(product);
    }
    catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const products = req.db.collection('products');

    const lastProductId = await getLastProductId(products);
    const newProductId = lastProductId + 1;

    try {
        const newProduct = await products.insertOne({
            _id: newProductId,
            name: req.body.name,
            type: req.body.type,
            price: req.body.price,
            rating: req.body.rating,
            warranty_years: req.body.warranty_years,
            available: req.body.available
        });

        console.log('Le produit a bien été créé');
        res.status(200).json(newProduct);
    }
    catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    const products = req.db.collection('products');

    try {
        const updatedProduct = await products.updateOne(
            { _id: parseInt(req.params.id) },
            {
                $set: {
                    _id: req.body._id,
                    name: req.body.name,
                    type: req.body.type,
                    price: req.body.price,
                    rating: req.body.rating,
                    warranty_years: req.body.warranty_years,
                    available: req.body.available
                }
            }
        );

        console.log('Le produit a bien été modifié');
        res.status(200).json(updatedProduct);
    }
    catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    const products = req.db.collection('products');

    try {
        const deletedProduct = await products.deleteOne({ _id: parseInt(req.params.id) });

        if(deletedProduct.deletedCount === 0) {
            return res.status(500).json('Plus de produit à supprimer');
        }

        console.log('Le produit a bien été supprimé');
        res.status(200).json('Le produit a bien été supprimé');
    }
    catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;