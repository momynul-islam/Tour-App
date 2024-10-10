const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const slugify = require("slugify");

const Tour = require("../Models/Tour");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const { deleteCoverImage, deleteImages } = require("../Utils/deleteImages");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

exports.uploadTourImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.coverImage || !req.files.images) return next();

  // 1) Upload cover image to Cloudinary with resizing
  const coverImageResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "tours",
          transformation: [{ width: 800, height: 600, crop: "fill" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(req.files.coverImage[0].buffer);
  });

  req.body.coverImage = coverImageResult.secure_url;

  // 2) Upload other images to Cloudinary with resizing
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const imageResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "tours",
              transformation: [{ width: 300, height: 300, crop: "fill" }],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
          .end(file.buffer);
      });

      req.body.images.push(imageResult.secure_url);
    })
  );

  next();
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).json({
    status: "success",
    data: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) throw new AppError("No tour found with this id", 404);

  res.status(200).json({
    status: "success",
    data: tour,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const { name, price, description, duration, coverImage, images, locations } =
    req.body;

  const newTour = await Tour.create({
    name,
    price,
    description,
    duration,
    coverImage,
    images,
    locations: locations.split(","),
  });

  if (!newTour) throw new AppError("Error in creating tour", 500);

  res.status(200).json({
    status: "success",
    data: newTour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  deleteCoverImage(tour.coverImage, "tours");
  deleteImages(tour.images, "tours");

  await Tour.findByIdAndDelete(req.params.tourId);

  res.status(204).json({
    status: "success",
    message: "Tour deleted successfully",
  });
});
