const Booking = require("../Models/Booking");
const Tour = require("../Models/Tour");
const catchAsync = require("../Utils/catchAsync");

exports.getTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("home", {
    title: "Home",
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.tourId;
  const tour = await Tour.findById(tourId);

  res.status(200).render("tourDetails", {
    title: tour.name,
    tour: tour,
  });
});

exports.getCrateTour = catchAsync(async (req, res, next) => {
  res.status(200).render("tourForm", {
    title: "Create Tour",
  });
});

exports.getBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: res.locals.user._id });
  console.log(bookings);
  res.status(200).render("bookings", {
    title: "My bookings",
    bookings,
  });
});

exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
});

exports.getSignup = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Signup",
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  res.status(200).render("profile", {
    title: "Profile",
  });
});

exports.getForgetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render("forgetPassword", {
    title: "Forget Password",
  });
});
