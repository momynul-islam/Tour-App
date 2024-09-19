const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../Models/Tour");
const User = require("../Models/User");
const Booking = require("../Models/Booking");
const catchAsync = require("../Utils/catchAsync");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.description,
            images: [
              `${req.protocol}://${req.get("host")}/img/tours/${
                tour.coverImage
              }`,
            ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    client_reference_id: req.params.tourId,
    customer_email: req.user.email,
    payment_method_types: ["card"],
    mode: "payment",
    // success_url: `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/bookings/booking-checkout?tour=${req.params.tourId}&user=${
    //   req.user._id
    // }&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get("host")}/bookings`,
    cancel_url: `${req.protocol}://${req.get("host")}/tours/${
      req.params.tourId
    }`,
  });

  res.status(200).json({
    status: "success",
    url: session.url,
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   const { tour, user, price } = req.query;

//   const newBooking = await Booking.create({ tour, user, price });

//   res.redirect(`${req.protocol}://${req.get("host")}/bookings`);
// });

const createBookingCheckout = async (session) => {
  console.log(session);
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))._id;
  const price = session.amount_total / 100;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createBookingCheckout(event.object);

  res.status(200).json({ received: true });
};

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();

  res.status(200).json({
    status: "success",
    data: bookings,
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const newBooking = await Booking.create(req.body);

  if (!newBooking) throw new Error("Booking creation failed");

  res.status(201).json({
    status: "success",
    data: newBooking,
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;

  const booking = await Booking.findById(bookingId);

  if (!booking) throw new Error("No booking found with this id");

  res.status(200).json({
    status: "success",
    data: booking,
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;

  const updatedBooking = await Booking.findByIdAndUpdate(bookingId, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedBooking,
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;

  await Booking.findByIdAndDelete(bookingId);

  res.status(204).json({
    status: "success",
    message: "Booking deleted successfully",
  });
});
