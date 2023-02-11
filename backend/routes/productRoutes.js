const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProducts,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getAllReviews,
  deleteProductReviews,
} = require("../controllers/productController.js");
const { isAuthenticated} = require("../middleware/isAuthanticated.js");
const ErrorHandler = require("../utils/errorhandler.js");


//--------->><<---------->><<---------->><<-----------


const router = express.Router();

router.get("/products",isAuthenticated,getAllProducts);

router.post("/admin/products/new", isAuthenticated,(req,res,next)=>{
  const roles=["admin","manager"];
  console.log(req.user)
  if (req.user.role === 'admin') {
    next();
  }else{
    return next(
      new ErrorHandler(
        `Role: ${req.user.role} is not allowed to access this resource `,
        403
      )
    );
  }
},createProduct);
router.put("/admin/products/:id", isAuthenticated,(req,res,next)=>{
  const roles=["admin","manager"];
  console.log(req.user)
  if (req.user.role === 'admin') {
    next();
  }else{
    return next(
      new ErrorHandler(
        `Role: ${req.user.role} is not allowed to access this resource `,
        403
      )
    );
  }
},updateProducts);
router.delete("/admin/products/:id", isAuthenticated,(req,res,next)=>{
  const roles=["admin","manager"];
  console.log(req.user)
  if (req.user.role === 'admin') {
    next();
  }else{
    return next(
      new ErrorHandler(
        `Role: ${req.user.role} is not allowed to access this resource `,
        403
      )
    );
  }
},deleteProduct);
router.get("/products/:id", isAuthenticated,(req,res,next)=>{
  const roles=["admin","manager"];
  console.log(req.user)
  if (req.user.role === 'admin') {
    next();
  }else{
    return next(
      new ErrorHandler(
        `Role: ${req.user.role} is not allowed to access this resource `,
        403
      )
    );
  }
},getProductDetails);

router.route("/review").put(isAuthenticated, createProductReview);
router
  .route("/reviews")
  .get(getAllReviews)
  .delete(isAuthenticated, deleteProductReviews);

module.exports = router;
