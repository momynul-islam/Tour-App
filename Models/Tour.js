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

// tourSchema.pre("save", function (next) {
//   this.coverImage = this.coverImage.replace("undefined", this._id);
//   this.images = this.images.map((image) =>
//     image.replace("undefined", this._id)
//   );
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
