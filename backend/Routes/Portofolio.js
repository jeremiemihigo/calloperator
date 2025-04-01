const express = require("express");
const {
  PDatabase,
  ReadCustomerToTrack,
  ReadByFilter,
  ClientStat,
} = require("../Controllers/Portofolio/Database");
const router = express.Router();
const { protect } = require("../MiddleWare/protect");
const { AddFeedback } = require("../Controllers/Portofolio/Feedback");

const {
  ReadProjet,
  RapportPortofolio,
  AnalyseToDay,
} = require("../Controllers/Portofolio/Projet");
const {
  AddPayement,
  AcceptDataPayement,
  ReadDataPayement,
} = require("../Controllers/Portofolio/Payement");
const {
  ActionAppel,
  SeachAmount,
} = require("../Controllers/Portofolio/Dashboard");

//Projet
router.get("/readProjet", protect, ReadProjet);
//Database config
router.post("/database", protect, PDatabase);
router.post("/readCustomerToTrack", protect, ReadCustomerToTrack);

//Feedback
router.post("/addFeedback", protect, AddFeedback);

//Formulaire

//Clients
router.post("/client", protect, ReadByFilter);
router.get("/clientStat", ClientStat);

//Rapport PORTOFOLIO
router.post("/rapportportofolio", protect, RapportPortofolio);
router.get("/analysetoday", protect, AnalyseToDay);
router.post("/payement", protect, AddPayement);
router.post("/acceptDataPayement", protect, AcceptDataPayement);
router.get("/readData", protect, ReadDataPayement);
//Dashboard
router.get("/actionAppel", protect, ActionAppel);
router.get("/seachAmount", protect, SeachAmount);

module.exports = router;
