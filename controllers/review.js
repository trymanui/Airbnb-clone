const Listing=require("../models/listing.js")
const Review=require("../models/review.js")

module.exports.createReview=async(req,res,next)=>{
let listing=await Listing.findById(req.params.id);
let newReview=new Review(req.body.review);
newReview.author=req.user._id;
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
req.flash("success","review created successfully");
res.redirect(`/listings/${listing._id}`)
}


module.exports.destroyReview=async(req,res)=>{
let {id, reviewid}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
await Review.findByIdAndDelete(reviewid);
req.flash("success","deleted review");
res.redirect(`/listings/${id}`);
}