const express = require("express");

const {
  createPayment,
  getAllPayments,
  parentConfirmPayment,
  adminConfirmPayment,
  getParentPayments,
} = require("../controllers/paymentControllers");

const { protectRoute } = require("../middlewares/middleWare");
const { checkPermission } = require("../middlewares/middleware");


const router = express.Router();


router.post("/create", protectRoute, checkPermission("create_payment"), createPayment);
router.get("/parent", protectRoute, checkPermission("view_payment"), getParentPayments);
router.get("/all-payment", protectRoute, checkPermission("view_payment"),  getAllPayments);
router.post("/parent-confirm/:paymentId", protectRoute, parentConfirmPayment);
router.post("/admin-confirm/:paymentId", protectRoute, adminConfirmPayment);



module.exports = router;