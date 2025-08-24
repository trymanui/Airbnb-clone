const Listing=require("./models/listing.js");
const Review=require("./models/review.js")
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be loged in to createlisting");
   return res.redirect("/login");
  }
  next()
};


module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
let listing= await Listing.findById(id);
if(!listing.owner._id.equals(res.locals.currUser._id)){
  req.flash("error","you dont have access to edit others listings");
   return res.redirect(`/listings/${id}`);
}
next();
}

module.exports.validateListing=async(req,res,next)=>{
  if(req.body.listing && req.body.listing.image){
    if (Array.isArray(req.body.listing.image.url)) {
      req.body.listing.image.url = req.body.listing.image.url[0] || '';
    }
    if (Array.isArray(req.body.listing.image.filename)) {
      req.body.listing.image.filename = req.body.listing.image.filename[0] || '';
    }
  }
  
  let {error}=listingSchema.validate(req.body);
  if(error){
    console.log(error);
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}


module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
if(error){
   let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }

}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
let review= await Review.findById(reviewid);
if(!review.author.equals(res.locals.currUser._id)){
  req.flash("error","you dont have access to delete others review");
   return res.redirect(`/listings/${id}`);
}
next();
}