const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review  =  require("./review.js");

let listingSchema = new Schema({
    title:{
        type:String,
    },
    description:String,
    image: {
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
})

listingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

const Listing =  mongoose.model("Listing",listingSchema);

module.exports = Listing;
