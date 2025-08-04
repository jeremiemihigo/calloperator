const express = require("express");
const { protect } = require("../MiddleWare/protect");
const {
  Inactif_thisMonth,
  // Analyse_Dash_All,
} = require("../Controllers/DefaultTracker/Dash");
const { GraphiqueDecision } = require("../Controllers/DefaultTracker/Decision");
const router = express.Router();

router.get("/inactif", Inactif_thisMonth);
router.get("/graphique_decision/:filtre", GraphiqueDecision);

//Affichage chez les agents sur terrain
// router.get("/analyse_all_agent", Analyse_Dash_All);
// router.get("/readByStatus/:status", protect, FilterFeedback, ReadByStatus);
module.exports = router;
