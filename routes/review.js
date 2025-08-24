const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const reviewController = require("../controllers/review.js");



    //post review route
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewid",
isLoggedIn,
isReviewAuthor,
wrapAsync(reviewController.destroyReview));

module.exports=router;