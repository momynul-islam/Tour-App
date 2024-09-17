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
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide", "user"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide", "user"),
    tourController.deleteTour
  );

module.exports = router;
