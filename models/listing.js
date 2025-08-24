const mongoose=require("mongoose");
const Review = require("./review");
const Schema=mongoose.Schema;

const listingSchema=new mongoose.Schema({
  title:{
    type:String,
  },
  description:{
    type:String,
  },
  // image: {
  //   filename: {
  //     type: String,
  //     default: "default-image",
  //   },
  //   url: {
  //     type: String,
  //     default:
  //       "https://images.unsplash.com/photo-1682687982502-1529b3b33f85?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
        
  //   },
  // },
  image:{
url:{
  type:String,
},
  filename:{
   type:String,
  }
  },
  price:{
    type:Number,
  }, location:{
    type:String,
  },
  country:{
    type:String,
  },
  reviews:[{
    type: Schema.Types.ObjectId,
    ref:"Review",
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  }
});

const listing=mongoose.model("Listing",listingSchema);

listingSchema.post("findOneAndDelete",async(Listing)=>{
  if(Listing){
    await Review.deleteMany({_id:{$in:Listing.reviews}})
  }
})


module.exports=listing;