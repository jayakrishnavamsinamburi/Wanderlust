const { model } = require("mongoose");
const Listing = require("../modules/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.renderNew =(req, res) => {
    res.render("listings/new.ejs");
}

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.createListings = async (req, res) => {
    // Assuming you're using an async function
let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();
    let url = req.file.path;
    let filename = req.file.filename;
    if (!req.body.listing.image) {
        delete req.body.listing.image;
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let saveListing = await newListing.save();
    console.log(saveListing);
    req.flash("success","New listing Created!");
    res.redirect("/listings");
}

module.exports.editListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error","listing you  requested for does not exist!");
        return res.redirect("/listings"); 
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing  , originalImageUrl});
}

module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
      });      
    if (!listing) {
        req.flash("error","listing you  requested for does not exist!");
        return res.redirect("/listings"); 
    }
    
    res.render("listings/show.ejs", { listing });
}

module.exports.updateListings = async (req, res) => {
    const { id } = req.params;
    if (!req.body.listing) {
        throw new expressError(400, "Invalid data");
    }
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","listing Update!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}