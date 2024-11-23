const { express } = require("../model");
const router = express.Router();
const { createCategory, listCategory, removeCategory } = require("../controllers");
const { auth, checkAdmin } = require("../middlewares");

router.post("/",auth,checkAdmin, createCategory);
router.get("/",listCategory);
router.delete("/:categoryId",auth,checkAdmin ,removeCategory);

module.exports = router;
