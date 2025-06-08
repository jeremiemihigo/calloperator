const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/protect");
const {
  LoginUser,
  ResetPassword,
  ReadAllUser,
  readUserConnect,
  AddUser,
  DeleteUser,
} = require("../Controllers/Utilisateurs");
const {
  AddAction,
  EditAction,
  CloseAction,
  AddProjet,
  ReadProjet,
  ReadDepense,
  ReadOpenAction,
  DeleteProjet,
  EditProjet,
} = require("../Controllers/Action");
const {
  AddProspect,
  ReadProspect,
  ReadProspectBy,
  DeleteProspect,
  EditProspect,
} = require("../Controllers/Prospects");
const {
  ChangeStatus,
  EditCommentaire,
  ChangeStatusProspect,
} = require("../Controllers/Statut");
const {
  AddCategorisation,
  ReadCategorisation,
  EditCategorisation,
  DeleteCategorisation,
} = require("../Controllers/Categorisation");

const multer = require("multer");
const path = require("path");
const { AddVue, ReadCommentaire } = require("../Controllers/Commentaire");
const { sendMessage } = require("../Controllers/TestPusher");

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Documents/");
  },
  filename: (req, file, cb) => {
    cb(null, `file_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedExt = [".pdf", ".docx", ".xlsx", ".jpg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExt.includes(ext)) {
    return cb(new Error("Type de fichier non autorisé"), false);
  }
  cb(null, true);
};
// Configuration de multer
const upload = multer({ storage, fileFilter });

// Route qui accepte plusieurs fichiers (champ = "files")
router.post(
  "/addaction",
  upload.array("files", 10),
  protect,
  AddAction,
  ReadProjet
);
router.post("/addaction_sans_fichier", protect, AddAction, ReadProjet);

router.post("/login", LoginUser);
router.post("/resetPassword", protect, ResetPassword);
router.get("/readAllUser", protect, ReadAllUser);
router.get("/readUserConnect", readUserConnect);
router.post("/addUser", AddUser);
router.post("/deleteUser", DeleteUser);

// AddAction, EditAction, AddProjet, ReadProjet
//router.post("/addaction", protect, AddAction, ReadProjet);
router.put("/editaction", protect, EditAction);
router.post("/addprojet", protect, AddProjet);
router.post("/readProjet", protect, ReadProjet);
router.post("/closeaction", protect, CloseAction, ReadProjet);
router.get("/readOpenAction", protect, ReadOpenAction);
router.post("/deleteProjet", protect, DeleteProjet);
router.post("/deleteprospect", protect, DeleteProspect);
router.post("/editprojet", protect, EditProjet);

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

//Categorisation
router.post("/addCategorisation", protect, AddCategorisation);
router.get("/readCategorisation", protect, ReadCategorisation);
router.put("/editCategorisation", protect, EditCategorisation);
router.post("/deleteCategorisation", protect, DeleteCategorisation);

//Depense
router.get("/readDepense/:concerne", protect, ReadDepense);

//Vue
router.get("/addvue/:concerne", protect, AddVue);
router.get("/readCommentaire", protect, ReadCommentaire);

module.exports = router;
