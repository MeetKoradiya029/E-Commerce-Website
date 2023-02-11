const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getOneUser,
  updateRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/isAuthanticated");
const ErrorHandler = require("../utils/errorhandler");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/me/update").put(isAuthenticated, updateProfile);

router.route("/admin/getusers").get(
  isAuthenticated,
  (req, res, next) => {
    const roles = ["admin", "manager"];
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
  getAllUser
);

router
  .route("/admin/getsingleuser/:id")
  .get(
    isAuthenticated,
    (req, res, next) => {
      const roles = ["admin", "manager"];
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
    getOneUser
  )
  .put(
    isAuthenticated,
    (req, res, next) => {
      const roles = ["admin", "manager"];
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
    updateRole
  )
  .delete(
    isAuthenticated,
    (req, res, next) => {
      const roles = ["admin", "manager"];
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
    deleteUser
  );

module.exports = router;
