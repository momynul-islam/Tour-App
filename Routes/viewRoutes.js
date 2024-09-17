const express = require("express");

const viewController = require("./../Controllers/viewController");
const authController = require("./../Controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get(["/", "/tours"], viewController.getTours);
router.get("/tours/:tourId", viewController.getTour);
router.get("/createTour", viewController.getCrateTour);

router.get("/bookings", viewController.getBookings);

router.get("/profile", viewController.getProfile);

router.get("/login", viewController.getLogin);

router.get("/signup", viewController.getSignup);

router.get("/forgetPassword", viewController.getForgetPassword);

module.exports = router;
