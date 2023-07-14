const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGO_URL;

MongoClient.connect(uri)
    .then(client => {
        const db = client.db('LesBonsArtisans');
        console.log('Connecté à la base de données');
        
        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use(cors());
        app.use(express.json());
    
        const productsRoute = require('./routes/product');
        const authRoute = require('./routes/auth');

        app.use('/api/products', productsRoute);
        app.use('/api/auth/', authRoute);
    
        app.listen(5000, () => {
            console.log('Serveur démarré sur le port 5000');
        })
    })
    .catch(err => {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    });