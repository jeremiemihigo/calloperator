const express = require("express");
const { AddEtape, ReadAllEtape } = require("../Controllers/Etapes");
const { protect } = require("../Middleware/protect");
const {
  LoginUser,
  ResetPassword,
  ReadAllUser,
  readUserConnect,
  AddUser,
} = require("../Controllers/Utilisateurs");
const {
  AddAction,
  EditAction,
  AddProjet,
  ReadProjet,
} = require("../Controllers/Action");
const {
  AddProspect,
  ReadProspect,
  ReadProspectBy,
  EditProspect,
} = require("../Controllers/Prospects");
const {
  ChangeStatus,
  EditCommentaire,
  ChangeStatusProspect,
} = require("../Controllers/Statut");
const router = express.Router();

router.post("/etape", protect, AddEtape);
router.get("/alletape", protect, ReadAllEtape);
router.post("/login", LoginUser);
router.post;
router.post("/resetPassword", protect, ResetPassword);
router.get("/readAllUser", protect, ReadAllUser);
router.get("/readUserConnect", readUserConnect);
router.post("/addUser", protect, AddUser);

// AddAction, EditAction, AddProjet, ReadProjet
router.post("/addaction", protect, AddAction, ReadProjet);
router.put("/editaction", protect, EditAction);
router.post("/addprojet", protect, AddProjet);
router.get("/readProjet/:id", protect, ReadProjet);

//Prospect
router.post("/addprospect", protect, AddProspect);
router.get("/readprospect/:id", protect, ReadProspect);
router.post("/deadProspectBy", protect, ReadProspectBy);
router.post("/editprospect", protect, EditProspect);

//Statut
router.post("/changestatus", protect, ChangeStatus, ReadProjet);
router.post(
  "/changeStatusProspect",
  protect,
  ChangeStatusProspect,
  ReadProspect
);
router.put("/editstatus", protect, EditCommentaire);
module.exports = router;
