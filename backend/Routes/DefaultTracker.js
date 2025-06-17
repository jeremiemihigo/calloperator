const express = require("express");
const {
  AddRoleDT,
  ReadRole,
  EditRole,
} = require("../Controllers/DefaultTracker/Role");
const { protect } = require("../MiddleWare/protect");
const {
  AddClientDT,
  ChangeStatus,
  ChangeByFile,
  Appel,
  ReadClientAfterChange,
  ReadCertainClient,
  ReadFilterClient,
  ChangeStatusOnly,
} = require("../Controllers/DefaultTracker/Client");
const {
  Rapport,
  ClientVisited,
  InformationCustomer,
  Graphique,
  GraphiqueClient,
  TauxValidation,
  StatusDashboard,
} = require("../Controllers/DefaultTracker/Dashboard");
const {
  AddAction,
  AddOneAction,
  ValiderAction,
  Validation,
  ChangeActionByFile,
  SubmitedByExcel,
} = require("../Controllers/DefaultTracker/Action");
const { protectTech } = require("../MiddleWare/protectTech");
const {
  AddObjectif,
  EditObjectif,
} = require("../Controllers/DefaultTracker/Objectif");
const { EditFeedbackVM } = require("../Controllers/Rapport");
const {
  ReadArbitrage,
  Arbitrage,
  Arbitrage_File,
  PostArbitrage_Automatique,
} = require("../Controllers/DefaultTracker/Arbitrage");
const {
  AddDecision,
  ReadDecision,
  VerificationDecision,
  ChangeDecisionByFile,
  SubmitDecisionByFile,
} = require("../Controllers/DefaultTracker/Decision");
const router = express.Router();

router.post("/role", protect, AddRoleDT);
router.get("/role", protect, ReadRole);
router.put("/editrole", protect, EditRole);
//Clients
router.post("/upload_customer", protect, AddClientDT);
router.post(
  "/lienclient",
  protect,
  PostArbitrage_Automatique,
  ReadFilterClient
);
router.post("/validation", protect, Validation);
router.post("/readCertainClient", protect, ReadCertainClient);
router.post("/changefeedback", protect, ChangeStatus, ReadClientAfterChange);
router.post("/change_by_file", protect, ChangeByFile);
router.get("/information/:codeclient", protect, InformationCustomer);
router.post("/appel", protect, Appel);

//Objectif
router.post("/objectif", protect, AddObjectif);
router.put("/objectif", protect, EditObjectif);
router.put("/edit_feeback_vm", protect, EditFeedbackVM);

//Dashboard
router.get("/rapport", Rapport);
router.get("/justvisited", ClientVisited);

//ACTION
router.post("/action", protect, AddAction);
router.post("/oneaction", protect, AddOneAction);
router.post("/change_action_excel", protect, SubmitedByExcel);
router.post("/valideraction", protect, ValiderAction);

//Performance

router.post("/changeactionbyfile", protect, ChangeActionByFile);
router.post("/statusDashboard", StatusDashboard);
router.post("/graphique", protect, GraphiqueClient, Graphique);
router.post("/graphique_taux", protect, GraphiqueClient, TauxValidation);

//Arbitrage
router.post("/arbitrage", protect, Arbitrage);
router.get("/arbitrage", protect, ReadArbitrage);
router.post("/arbitrage_file", protect, Arbitrage_File);
router.post("/changeStatusOnly", protect, ChangeStatusOnly);
//Decision
router.post("/adddecision", protect, AddDecision);
router.get("/decision", protect, ReadDecision);
router.post("/changebyfile", protect, ChangeDecisionByFile);
router.post("/change_decision_file", protect, SubmitDecisionByFile);
router.post("/verification_decision", protect, VerificationDecision);

module.exports = router;
