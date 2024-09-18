const express = require("express");

const viewController = require("./../Controllers/viewController");
const authController = require("./../Controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get(["/", "/tours"], viewController.getTours);

router.get("/login", viewController.getLogin);
router.get("/signup", viewController.getSignup);
router.get("/forgetPassword", viewController.getForgetPassword);

router.get("/tours/:tourId", authController.protect, viewController.getTour);
router.get("/createTour", authController.protect, viewController.getCrateTour);
router.get("/bookings", authController.protect, viewController.getBookings);
router.get("/profile", authController.protect, viewController.getProfile);

module.exports = router;
