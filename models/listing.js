const mongoose = require('mongoose');
const IMGURL ="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const listingsShema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:IMGURL,
        set:(v) => v==="" ?IMGURL :v,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    }
}) ;

const Listing = mongoose.model("Listing",listingsShema);
module.exports = Listing;
