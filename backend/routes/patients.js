const router = require("express").Router();
const {
  getAll,
  createPatient,
  editPatient,
  deletePatient,
  getPatient,
} = require("../controllers/patients");

router.get("/", getAll);
router.get("/:id", getPatient);
router.post("/", createPatient);
router.delete("/:id", deletePatient);
router.put("/:id", editPatient);

module.exports = router;
