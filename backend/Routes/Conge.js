const express = require("express");
const { protect } = require("../MiddleWare/protect");
const { Update_Agent_Admin } = require("../Controllers/Admin/Conge/Setting");
const { AddConge, ReadConge } = require("../Controllers/Admin/Conge/Conge");
const {
  AddDepartement,
  ReadDepartement,
  AddFonction,
  ReadFonction,
} = require("../Controllers/Admin/Conge/Departement");
const { AddTypeConge } = require("../Controllers/Admin/Conge/TypeConge");

const router = express.Router();

router.put("/set_agent_admin_conge", protect, Update_Agent_Admin);
router.post("/add_conge", protect, AddConge);
router.get("/read_conge", protect, ReadConge);
router.post("/add_departement", protect, AddDepartement);
router.post("/read_departement", protect, ReadDepartement);
router.post("/add_fonction", protect, AddFonction);
router.post("/read_fonction", protect, ReadFonction);
router.post("/typeconge", protect, AddTypeConge);

module.exports = router;
