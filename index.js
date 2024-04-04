const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');

app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,'views'));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,'/public')));



app.use(express.urlencoded({extended:true}));


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
    console.log("Working");
})

app.get('/',(req,res)=>{
    res.send("Home Page");
});


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



app.get('/listing/new',(req,res)=>{
    res.render('listings/form.ejs');
})

// CREATE ROUTE 

app.post('/listing',
    
        validatelisting,
        wrapAsync( async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);

    console.log(req.body.listing)
    await newListing.save();
    res.redirect('/listing');
}));

// Show Route

app.get('/listing/:id',wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const ShowData = await Listing.findById(id);
    res.render('listings/show.ejs',{ShowData});
}));


// Edit Route to Serve The Form

app.get('/listing/:id/edit',wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const ShowData = await Listing.findById(id);
    res.render('listings/Edit.ejs',{ShowData});
}));


// Edit Route For Updating Into database and resirecting to the show page  


app.put('/listing/:id', validatelisting, wrapAsync(async (req,res,next)=>{
    let {id} =req.params;
     await Listing.findByIdAndUpdate(id,{...req.body})
    
    res.redirect(`/listing/${id}`);

    
}));

// Delete Route


app.delete('/listing/:id/delete',wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listing');
}));


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