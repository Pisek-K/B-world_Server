const { express } = require("../model");
const router = express.Router();
const { getConfig, createPayment } = require("../controllers");
const { auth } = require("../middlewares");

router.get("/config", auth, getConfig);
router.post("/create-payment-intent", auth, createPayment);

module.exports = router;
