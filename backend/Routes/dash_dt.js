const express = require("express");
const { protect } = require("../MiddleWare/protect");
const {
  ClientAttente,
  Inactif_thisMonth,
  // Analyse_Dash_All,
} = require("../Controllers/DefaultTracker/Dash");
const { GraphiqueAction } = require("../Controllers/DefaultTracker/Action");
const { GraphiqueDecision } = require("../Controllers/DefaultTracker/Decision");
const { protectTech } = require("../MiddleWare/protectTech");
const {
  ReadMessageAgent,
} = require("../Controllers/DefaultTracker/Performance");
const router = express.Router();

router.get("/attente_department", protect, ClientAttente);
router.get("/inactif/:search", Inactif_thisMonth);
router.get("/graphique_action/:filtre", GraphiqueAction);
router.get("/graphique_decision/:filtre", GraphiqueDecision);

//Affichage chez les agents sur terrain
router.get("/readmessage", protectTech, ReadMessageAgent);
// router.get("/analyse_all_agent", Analyse_Dash_All);
module.exports = router;
