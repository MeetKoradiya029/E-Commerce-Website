const Products = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsync = require("../middleware/catchAsync");

//get all products
exports.getAllProducts = catchAsync(async (req, res) => {
  const resultperPage = 5;
  const productCount = await Products.countDocuments();

  const apiFeatures = new ApiFeatures(Products.find(), req.query)
    .search()
    .filter()
    .pagination(resultperPage);

  // console.log(apiFeatures)

  const products = await apiFeatures.query;

  console.log(products);

  res.status(200).json({ success: true, products, productCount });
});

//get product details

exports.getProductDetails = catchAsync(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({ success: true, product });
});

//Admin
exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Products.create(req.body);
  console.log(product);
  res.status(201).json({ success: true, product });
});

//Update Product-Admin
exports.updateProducts = catchAsync(async (req, res, next) => {
  let product = await Products.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, product });
});

// Delete products--Admin
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.remove();
  res.status(200).json({ success: true, message: "Product deleted" });
});

//Create review
exports.createProductReview = catchAsync(async (req, res, next) => {
  const { comment, rating, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Products.findById(productId);

  console.log(product);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    console.log(product.numOfReviews);
    console.log(req.reviews);
    const len = await product.reviews.length;
    console.log(len);
    product.numOfReviews = len;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  console.log(product.reviews.length);
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true });
});

//Get all reviews
exports.getAllReviews = catchAsync(async(req,res,next)=>{

  const product = await Products.findById(req.query.id);

  if(!product){
    return next(new ErrorHandler('product not found', 404))
  }


  res.status(200).json({
    success:true,
    reviews:product.reviews,
  })

})

//delete Product reviews
exports.deleteProductReviews = catchAsync(async(req,res,next)=>{
  const product = await Products.findById(req.query.productId);
  // console.log(product);

  if(!product){
      return next(new ErrorHandler('product not found',404))
  }

  const reviews = product.reviews.filter((rev)=>rev._id.toString()!==req.query.id.toString())

  console.log(reviews)

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  // console.log(product.reviews.length);
  const ratings = avg /reviews.length;
  const numOfReviews = reviews.length


  await Products.findByIdAndUpdate(req.query.productId,
    {reviews,ratings,numOfReviews},{
    new:true,
    runValidators:true,
    useFindAndModify:false
  });

  res.status(200).json({
    success: true,
  });





})