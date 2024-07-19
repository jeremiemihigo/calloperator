const express = require("express");
const router = express.Router();
const { protect } = require("../MiddleWare/protect");
const {
  AddPlainte,
  ReadPlainte,
  AddTitlePlainte,
} = require("../Controllers/Issue/Plainte");
const { OpenCall, Appel, AppelToday } = require("../Controllers/Issue/Appel");
const { updatedAdresse } = require("../Controllers/Issue/AdresseClient");
const { IssueRapport } = require("../Controllers/Rapport");

router.post("/plainte", protect, AddPlainte, ReadPlainte);
router.post("/itemPlainte", protect, AddTitlePlainte, ReadPlainte);
router.post("/opencall", protect, OpenCall);
router.post("/appel", protect, Appel);

router.get("/plainte", ReadPlainte);
router.get("/today", protect, AppelToday);

router.post("/changeadresse", protect, updatedAdresse);
router.post("/issuerapport", protect, IssueRapport);

module.exports = router;
