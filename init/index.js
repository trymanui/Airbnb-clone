
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const mongoose = require('mongoose');


main().then(res=>console.log("connected")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlast');
}
const initDB=async()=>{
await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({
  ...obj,
  owner:"68a08ff59a520c997dd70271"
}))
await Listing.insertMany(initData.data);
console.log("sucess*2");
}

initDB();


