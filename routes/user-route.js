const {express} = require("../model")
const router = express.Router()
const {listUser,saveAddress,saveOrder,userCart,getOrder,getUserCart,emptyCart,changeRole,changeStatus,updateAddress} = require("../controllers")
const {auth,checkAdmin} = require("../middlewares")


router.get("/users",auth,checkAdmin,listUser)
router.post("/change-status",auth,checkAdmin,changeStatus)
router.post("/change-role",auth,checkAdmin,changeRole)

router.post("/cart",auth,userCart)
router.get("/cart",auth,getUserCart)
router.delete("/cart",auth,emptyCart)

router.put("/address",auth,updateAddress)

router.post("/order",auth,saveOrder)
router.get("/order",auth,getOrder)

module.exports = router