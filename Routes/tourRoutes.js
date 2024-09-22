const express = require("express");

const tourController = require("../Controllers/tourController");
const authController = require("./../Controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide", "user"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.createTour
  );

router
  .route("/:tourId")
  .get(authController.protect, tourController.getTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.deleteTour
  );

module.exports = router;
