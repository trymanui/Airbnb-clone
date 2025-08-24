const axios=require("axios");
const Listing=require("../models/listing.js");
const mapApi=process.env.MAP_API;



module.exports.index=async(req,res)=>{
let alllist=await Listing.find({});
res.render("./listings/index.ejs",{alllist});
};

module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new.ejs")
};

module.exports.createListing=async(req,res,next)=>{

    const locationName = req.body.listing.location;
    const geoResponse = await axios.get("https://api.maptiler.com/geocoding/" + encodeURIComponent(locationName) + ".json", {
      params: {
        key: mapApi,
      }
    });

let url=req.file.path;
let filename=req.file.filename;

 const newlisting= new Listing(req.body.listing);
 newlisting.owner=req.user._id;
 newlisting.image={url,filename};
 newlisting.geometry=geoResponse.data.features[0].geometry;
 let savedListing=await newlisting.save();
 
 req.flash("success","New Listing Created");
res.redirect("/listings"); 
  }

  module.exports.showListing=async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate({path:"reviews",
    populate:{
      path:"author",
    },
  }).populate("owner");
  if(!listing){
    req.flash("error","listing doesnot exist")
  return res.redirect("./");
  }
  res.render("./listings/show.ejs",{listing});
  
  };
  

module.exports.renderEditForm=async(req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
 if(!listing){
  req.flash("error","listing doesnot exist to edit")
return res.redirect("/listings");
}
let originalImageUrl=listing.image.url;
originalImageUrl.replace("/upload","/upload/h_300,w_250");
res.render("./listings/edit.ejs",{listing,originalImageUrl})
};

module.exports.updateList=async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  listing.set({...req.body.listing});

    if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
await listing.save();
  req.flash("success","updated successfully")
res.redirect(`/listings/${id}`);
  }

module.exports.destroyList=async(req,res)=>{
  let {id}=req.params;
  let deleted=await Listing.findByIdAndDelete(id);
  req.flash("success","Listing delete successfully")
  res.redirect("/listings");
    }