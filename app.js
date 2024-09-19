const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const viewRouter = require("./Routes/viewRoutes");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const bookingRouter = require("./Routes/bookingRoutes");
const bookingController = require("./Controllers/bookingController");
const errorController = require("./Controllers/errorController");
const AppError = require("./Utils/appError");

const app = express();

// app.enable("trust proxy");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "Public")));

// Global Middlewares
app.use(cors());
app.options("*", cors());

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// stripe webhook
app.use(
  "/webhook-checkout",
  bodyParser.raw({ type: "application/json" }),
  bookingController.webhookCheckout
);

// Body parser, reading data from body into req.body
app.use(bodyParser.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["duration", "name", "locations", "price"],
  })
);

app.use(compression());

// Routes
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorController);

module.exports = app;
