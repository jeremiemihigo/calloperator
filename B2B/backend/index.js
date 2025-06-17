// Importation des modules
const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const path = require("path");

// Initialisation d'Express
const app = express();

// Middlewares
app.use(cors());
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// Connexion à la base de données
const connectDB = require("./Config/Connection");
connectDB();
// Création du serveur HTTP
const server = http.createServer(app);

app.use("/bboxx/b2b", require("./Routes/Router"));
app.use(
  "/bboxx/b2b/file",
  express.static(path.resolve(__dirname, "Documents"))
);
//bboxx/b2b/file
app.get("/", (req, res) => {
  return res.status(200).json(process.env.MONGODB_URL);
});
// Démarrage du serveur
const port = process.env.PORT || 40006;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
