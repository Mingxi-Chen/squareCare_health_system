const router = require("express").Router();
const {
  createGroup,
  getAvailableChats,
  getGroups,
  updateConversation,
  downloadFile,
} = require("../controllers/messages");
const { checkAuth } = require("../middlewares/checkAuth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/available/:id", checkAuth, getAvailableChats);
router.get("/:id", checkAuth, getGroups);
router.post("/", checkAuth, createGroup);
router.post("/conversation/:id", upload.single("file"), updateConversation);
router.get("/file/:filename", downloadFile);

module.exports = router;
