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

  ReadCertainClient,
  ReadFilterClient,
  ChangeStatusOnly,
  ReadAllClient,
  ReadCustomerStatus,
  InformationClient,
  ShowAction,
  ValidationAction,
  customerToRefresh,
  verification_field,
  cas_valider,
  AllVisitsStaff,
  DashboardTracker,
  DashboardAgent,
  sidebarDefaultTracker,
} = require("../Controllers/DefaultTracker/Client");
const {
  Rapport,
  ClientVisited,
  // GraphiqueClient,
  // TauxValidation,
  // StatusDashboard,
  MesCriteredeRecherche,
  ReadValidation,
} = require("../Controllers/DefaultTracker/Dashboard");
const { EditFeedbackVM } = require("../Controllers/Rapport");
const {
  ReadArbitrage,
  Arbitrage,
  PostArbitrage_Automatique,
  PostArbitrage_,
} = require("../Controllers/DefaultTracker/Arbitrage");
const {
  ReadDecision,
  VerificationDecision,
  ChangeDecision,
  ReadDecisionArbitrage,
  ValidateDecision,
} = require("../Controllers/DefaultTracker/Decision");
const {
  categorisationAutomatique,
} = require("../Controllers/DefaultTracker/ChangementAutomatique");
const {
  AddPayement,
  ReadPayment,
  AjustagePayement,
} = require("../Controllers/DefaultTracker/Payement");
const router = express.Router();

router.post("/role", protect, AddRoleDT);
router.get("/role", protect, ReadRole);
router.put("/editrole", protect, EditRole);
//Clients

router.get("/clientstatus/:status", protect, ReadCustomerStatus);

router.post("/readCertainClient", protect, ReadCertainClient);

//Objectif
router.put("/edit_feeback_vm", protect, EditFeedbackVM);

//Dashboard
router.get("/rapport", Rapport);
router.get("/justvisited", ClientVisited);

// router.post(
//   "/statusDashboard",
//   protect,
//   MesCriteredeRecherche,
//   StatusDashboard
// );
// router.post(
//   "/graphique_taux",
//   protect,
//   MesCriteredeRecherche,
//   GraphiqueClient,
//   TauxValidation
// );

//Arbitrage
router.post("/arbitrage", protect, Arbitrage);

router.post("/changeStatusOnly", protect, ChangeStatusOnly);
//Decision
router.get("/decision", protect, ReadDecision);
router.post("/verification_decision", protect, VerificationDecision);

router.get("/showAction", ShowAction);
router.post("/validationAction", protect, ValidationAction);

//Historique
router.post("/historique", protect, InformationClient);
router.get("/customerToRefresh", protect, customerToRefresh);

//Affectation automatique
router.get(
  "/categorisationAutomatique",
  protect,
  MesCriteredeRecherche,
  categorisationAutomatique
);

//My tracker Visite menage

//NOUVEAU SYSTEME
router.get(
  "/lienclient",
  protect,
  PostArbitrage_Automatique,
  ReadValidation,
  ReadFilterClient
);
router.get("awaiting_field", protect);
router.get(
  "/lienclient",
  protect,
  PostArbitrage_Automatique,
  ReadValidation,
  ReadFilterClient
);
router.get(
  "/verification/:filterfonction/:departement",
  protect,
  verification_field
);
router.get("/cas_valider/:departement", protect, cas_valider);
router.get("/allclient", protect, ReadAllClient);
router.get("/allstaffvisits", protect, AllVisitsStaff);
router.get("/arbitrage", protect, PostArbitrage_, ReadArbitrage);
router.post("/change_decision", protect, ChangeDecision);
router.post("/changefeedback", protect, ChangeStatus);

//Arbitrage decision
router.get(
  "/readDecisionArbitrage/:departement",
  protect,
  ReadDecisionArbitrage
);
router.post("/validateDecision", protect, ValidateDecision);

//Payement dt
router.post("/addpayements", protect, AddPayement, AjustagePayement);
router.get("/readPayment", protect, ReadPayment);

//Upload customer to track
router.post("/upload_customer", protect, AddClientDT);

//Dashboard default tracker
router.get("/dashboardTracker", DashboardTracker);
router.post(
  "/dashboardAgent/:filterfonction",
  DashboardAgent,
  verification_field
);
router.get("/sidebarDefaultTracker", sidebarDefaultTracker);

module.exports = router;
