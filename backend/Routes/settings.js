const express = require("express");
const { addposte, DeleteDepartement } = require("../Controllers/Departement");
const { protect } = require("../MiddleWare/protect");
const router = express.Router();

router.post("/poste", protect, addposte);
router.post("/deleteDepartement", protect, DeleteDepartement);

// router.get("/analyse_all_agent", Analyse_Dash_All);
module.exports = router;
