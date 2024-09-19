const multer = require("multer");
const sharp = require("sharp");
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

exports.uploadTourImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.coverImage || !req.files.images) return next();

  // 1) Cover image
  req.body.coverImage = `tour-${slugify(
    req.body.name
  )}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.coverImage[0].buffer)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`Public/img/tours/${req.body.coverImage}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${slugify(req.body.name)}-${Date.now()}-${
        i + 1
      }.jpeg`;

      await sharp(file.buffer)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`Public/img/tours/${filename}`);

      req.body.images.push(filename);
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
