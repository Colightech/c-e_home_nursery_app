const express = require("express");
const {
  createDaycare,
  getAllDaycares,
  getSingleDaycare,
  updateDaycare,
  deleteDaycare,
} = require("../controllers/daycareController");
const { protectRoute } = require("../middlewares/middleWare");
const { checkPermission } = require("../middlewares/middleware");


const router = express.Router();

router.get("/fetch-daycare", protectRoute, checkPermission("view_daycare"), getAllDaycares);
router.post("/create", protectRoute, checkPermission("create_daycare"), createDaycare);
router.get("/:id", protectRoute, checkPermission("view_daycare"), getSingleDaycare);
router.put("/:id", protectRoute, checkPermission("update_daycare"), updateDaycare);
router.delete("/:id", protectRoute, checkPermission("delete_daycare"), deleteDaycare);

module.exports = router;

