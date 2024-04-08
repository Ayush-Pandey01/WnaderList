const express = require('express');
const mongoose = require('mongoose');
const app = express();
const wrapAsync = require('./utils/wrapAsync.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const Listing = require('./models/listing.js');
const Review = require('./models/reviews.js')
const {reviewSchema} = require('./schema.js');
const {listingSchema} = require('./schema.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const localStratergy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./Routes/userRoutes.js")



app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,'views'));



app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,'/public')));



// Session Option
const sessionOptions = {
    secret:"MYSupervisor",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
}


app.use(session(sessionOptions));
app.use(flash())                                                                    // Flash for flashing the alert MSG
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
})


// const listingRoute = require('./Routes/listingRoutes.js')
// const reviewRoute = require('./Routes/listingRoutes.js');



app.use(express.urlencoded({extended:true}));


// app.use("/",userRouter)





//    Database Connection 

main()
.then((res)=>{
    console.log("Successfully connected");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderList');
}

app.listen(8080,()=>{
    console.log("Working at 8080 port");
})

app.get('/',(req,res)=>{
    res.send("Home Page");
});





// generating a validate listing Function
const validatelisting = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError (400,errorMsg);
    } else{
        next();
    }
};


app.get('/listing',wrapAsync(async(req,res)=>{
    const ALLList = await Listing.find({});
    res.render('listings/index.ejs',{ALLList})
}));


app.post('/listing',
    
        validatelisting,
        wrapAsync( async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);

    console.log(req.body.listing)
    await newListing.save();
    req.flash("success","Item Added to the database")
    res.redirect('/listing');
})); 



app.get('/listing/new',(req,res)=>{
    res.render('./listings/form.ejs');
})

// Show Route

app.get('/listing/:id',wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const ShowData = await Listing.findById(id).populate("reviews");
    if(!ShowData){
        req.flash("error", "Item Doesnot Exits");
        res.redirect('/listing');
    }else{
        res.render('listings/show.ejs',{ShowData});
    }
   
}));


// Edit Route to Serve The Form

app.get('/listing/:id/edit',wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const ShowData = await Listing.findById(id)
    res.render('listings/Edit.ejs',{ShowData});
}));


// Edit Route For Updating Into database and redirecting to the show page  


app.put('/listing/:id', validatelisting, wrapAsync(async (req,res,next)=>{
    let {id} =req.params;
    console.log(req.body.listing)
    let Data = req.body.listing
     await Listing.findByIdAndUpdate(id,Data)
     req.flash("success","Item Updated Successfully")
    console.log("SuccessS")
    res.redirect(`/listing/${id}`);

    
}));

// Delete Route

app.delete('/listing/:id/delete',wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Item Deleted Successfully")
    res.redirect('/listing');
}));







// generating a validate review Function
const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError (400,errorMsg);
    } else{
        next();
    }
};



app.post("/listing/:id/review" , validateReview , wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save()
    req.flash("success","Review Added")
    res.redirect(`/listing/${listing._id}`);
}))


app.delete("/listing/:id/review/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params; 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted")
    res.redirect(`/listing/${id}`);
}))



// UserRoutes Functionality


app.get("/signup",(req,res)=>{
    res.render("User/Signup.ejs");
})
app.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username , email, password} = req.body
     const newUser = new User({email,username});
     const regestereduser = await User.register(newUser,password);
     console.log(regestereduser);
     req.flash("success" , "User Regestered !!")
     res.redirect("/listing")
    }catch(e){
        req.flash("error", "User Already Exist Login To WanderLust!");
        res.redirect("/login");
    }
 }));


 app.get("/login", (req,res)=>{
    res.render("User/Login.ejs")
 })


 app.post("/login", passport.authenticate('local' ,{failureRedirect:"/login", failureFlash : true}) ,async(req,res)=>{
    req.flash("success" , "WelcomeBack To the WanderLust !!")
    res.redirect("/listing")
 })




app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !! "));   
})

app.use("*",(err,req,res,next)=>{
    let{statusCode = 500, message = "Something Went Wrong !!"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
})




// app.get('/testlisting',async(req,res)=>{
//     let newListing = new Listing({
//         title:"New home",
//         description:"Near Beach",
//         price:1200,
//         location:"Calangute Goa",
//         country:"India"
//     });
//     await newListing.save();
//     console.log("Saved Successfully into database");
//     res.send("Success");
    
// });