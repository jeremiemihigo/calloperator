// Importation des modules
const express = require("express");
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
const connectDB = require("./Config/Connection");
connectDB();
// Création du serveur HTTP
const server = http.createServer(app);

// Initialisation de Socket.io avec CORS activé
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world",
});
// Routes
app.post("/api/register-socket", async (req, res) => {
  const { userId, socketId } = req.body;
  console.log(userId, socketId);

  // Associe le socketId à l’utilisateur en base ou en mémoire
  // await saveUserSocket(userId, socketId);

  res.sendStatus(200);
});
app.use("/bboxx/b2b", require("./Routes/Router"));
app.get("/", (req, res) => {
  return res.status(200).json(process.env.MONGODB_URL);
});
// Démarrage du serveur
const port = process.env.PORT || 40006;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
