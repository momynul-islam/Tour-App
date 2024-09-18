const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  description: {
    type: String,
    required: [true, "A tour must have description"],
  },
  duration: {
    type: Number,
    required: [true, "A tour must have duration"],
  },
  coverImage: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  locations: [
    {
      type: String,
    },
  ],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
