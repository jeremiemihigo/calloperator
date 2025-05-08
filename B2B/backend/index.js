// Importation des modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

// Initialisation d'Express
const app = express();

// Middlewares
app.use(cors());
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// Connexion à la base de données
const connectDB = require("./config/Connection");
connectDB();

// Création du serveur HTTP
const server = http.createServer(app);

// Initialisation de Socket.io avec CORS activé

// Routes
app.use("/bboxx/b2b", require("./Routes/Router"));

// Démarrage du serveur
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
