const { express } = require("../model");
const router = express.Router();
const {auth, checkAdmin} = require("../middlewares")
const {changeOrderStatus,getOrderAdmin} = require("../controllers")


router.put("/order-status",auth,checkAdmin,changeOrderStatus)
router.get("/orders",auth,checkAdmin,getOrderAdmin)


module.exports = router