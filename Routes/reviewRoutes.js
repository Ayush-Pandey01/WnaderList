const express = require('express');
const router = express.Router();
const app = express();

const Listing = require('../models/listing.js');
const ExpressError = require('./utils/ExpressError.js');


app.use(methodOverride('_method'));








// Review POST Route



module.exports = router