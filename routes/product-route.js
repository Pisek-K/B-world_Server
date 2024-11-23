const { express } = require("../model");
const router = express.Router();
const {createProduct,listProduct,listbyProduct,removeProduct,searchFilters,updateProduct,readProduct,uploadImages,removeImages} = require("../controllers")
const {auth,checkAdmin} = require("../middlewares")


router.post("/",createProduct)
router.get("/products/:count",listProduct)
router.get("/:itemId",readProduct)
router.delete("/:id",removeProduct)
router.put("/:id",updateProduct)
router.post("/productBy",listbyProduct)
router.post("/search/filters",searchFilters)

router.post("/images",auth,checkAdmin,uploadImages)
router.post("/removeimages",auth,checkAdmin,removeImages)

module.exports = router;
