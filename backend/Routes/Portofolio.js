const express = require("express");
const router = express.Router();
const {
  PDatabase,
  ReadCustomerToTrack,
  ReadByFilter,
  ClientStat,
  dataupload,
  deleteupload,
  editoneupload,
} = require("../Controllers/Portofolio/Database");

const { protect } = require("../MiddleWare/protect");
const { AddFeedback } = require("../Controllers/Portofolio/Feedback");

const {
  RapportPortofolio,
  AnalyseToDay,
} = require("../Controllers/Portofolio/Projet");
const {
  AcceptDataPayement,
  AddPayement,
  ReadDataPayement,
  ReadPayment,
  deletePayment,
} = require("../Controllers/Portofolio/PayementClient");
const {
  ActionAppel,
  SeachAmount,
} = require("../Controllers/Portofolio/Dashboard");

//Database config
router.post("/database", protect, PDatabase);
router.post("/readCustomerToTrack", protect, ReadCustomerToTrack);
router.post("/client", protect, ReadByFilter);
router.get("/clientStat", protect, ClientStat);
router.get("/dataupload", protect, dataupload);
router.delete("/deleteupload/:id", protect, deleteupload);
router.delete("/deletepayment/:id", protect, deletePayment);
router.post("/editoneupload", protect, editoneupload);

//Feedback
router.post("/addFeedback", protect, AddFeedback);

//Formulaire

//Clients

//Rapport PORTOFOLIO
router.post("/rapportportofolio", protect, RapportPortofolio);
router.get("/analysetoday", protect, AnalyseToDay);
router.post("/payement", protect, AddPayement);
router.post("/acceptDataPayement", protect, AcceptDataPayement);
router.get("/readData", protect, ReadDataPayement);
router.get("/uploadpayment", protect, ReadPayment);
//Dashboard
router.get("/actionAppel", protect, ActionAppel);
router.get("/seachAmount", protect, SeachAmount);

module.exports = router;
