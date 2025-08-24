if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore=require("connect-mongo")
const flash=require("connect-flash");
const ExpressError=require("./utils/ExpressError.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"salman@gamil.com",
//     username:"deltauser"
//   });
// let registerUser= await User.register(fakeUser,"helloworld");
// console.log(registerUser);
// })

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;

main().then(res=>console.log("connected")).catch(err=>console.log(err));

async function main(){
  await mongoose.connect(dbUrl);
}

let port=3000;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));




//to read data fromurl
app.use(express.urlencoded({extended : true}));
app.use(express.json()); // Parses application/json

//for convertingrequest
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public" )));
app.engine("ejs",ejsMate);



const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("error in mongo session store",err)
})

const sessionOptons={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};



app.use(session(sessionOptons));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all(/.*/,(req,res,next)=>{
next(new ExpressError(404,"page not found"));
});

  app.use((err,req,res,next)=>{
    let {statusCode=500,message="some error"}=err;
res.status(statusCode).render("./listings/error.ejs",{message});
  });




app.listen(port,()=>{
console.log(`listening at port: ${port}`)
});