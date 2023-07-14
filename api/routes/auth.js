const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const getLastUserId = async (users) => {
    const lastUser = await users.findOne({}, { sort: { _id: -1 }, projection: { _id: 1 } });
    return lastUser ? lastUser._id : 0;
};

router.post('/register', async (req, res) => {
    const users = req.db.collection('users');

    try {
        const existingUser = await users.findOne({ email: req.body.email });

        if(existingUser) {
            res.status(400).json('Cette addresse mail est déjà utilisée');
            console.log('Cette addresse mail est déjà utilisée');
            return;
        }

        const lastUserId = await getLastUserId(users);
        const newUserId = lastUserId + 1;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await users.insertOne({
            _id: newUserId,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: req.body.isAdmin
        });

        console.log('Le compte a bien été créé');
        console.log(user);
        res.status(200).json(user);
    }
    catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    const users = req.db.collection('users');

    try {
        const user = await users.findOne({ email: req.body.email });

        if(!user) {
            res.status(400).json('Mauvais identifiants');
            console.log('Mauvais identifiants');
            return;
        } 
    
        if(user) {
            const validatePassword = await bcrypt.compare(req.body.password, user.password);

            if(!validatePassword) {
                res.status(400).json('Mauvais identifiants');
                console.log('Mauvais identifiants');
                return;
            }
            
            const accessToken = jwt.sign(
                {
                    id: user._id, 
                    isAdmin: user.isAdmin,
                }, 
                process.env.JWT_SECRET_KEY,
                { expiresIn: "3d" }
            );
    
            const { password, ...others } = user;
    
            res.status(200).json({ ...others, accessToken });
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;