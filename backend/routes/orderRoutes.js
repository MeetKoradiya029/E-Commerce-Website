const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticated } = require("../middleware/isAuthanticated");
const ErrorHandler = require("../utils/errorhandler");

const router = express.Router();

router.post("/order/new", isAuthenticated, newOrder);
router.get("/order/:id", isAuthenticated, getSingleOrder);
router.get("/order/me", isAuthenticated, myOrders);
router.get(
  "/admin/getallorders",
  isAuthenticated,
  (req, res, next) => {
    const roles = ["admin", "manager"];
    console.log(req.user);
    if (req.user.role === "admin") {
      next();
    } else {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource `,
          403
        )
      );
    }
  },
  getAllOrders
);

router
  .put(
    "/admin/order/:id",
    isAuthenticated,
    (req, res, next) => {
      const roles = ["admin", "manager"];
      console.log(req.user);
      if (req.user.role === "admin") {
        next();
      } else {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resource `,
            403
          )
        );
      }
    },
    updateOrder
  )
  .delete(
    isAuthenticated,
    (req, res, next) => {
      const roles = ["admin", "manager"];
      console.log(req.user);
      if (req.user.role === "admin") {
        next();
      } else {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resource `,
            403
          )
        );
      }
    },
    deleteOrder
  );

module.exports = router;
