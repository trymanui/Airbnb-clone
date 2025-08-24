const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});



router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image][url]'),validateListing,
    wrapAsync(listingController.createListing)
);


//render new form
router.get("/new",
  isLoggedIn,listingController.renderNewForm); 

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
  isOwner,
  upload.single('listing[image][url]'),
  validateListing,wrapAsync(listingController.updateList))
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyList));

//edit route page
router.get("/:id/edit",isLoggedIn,
  isOwner,
wrapAsync(listingController.renderEditForm));



  module.exports=router;