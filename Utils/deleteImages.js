const fs = require("fs");
const path = require("path");
const catchAsync = require("./catchAsync");

exports.deleteCoverImage = catchAsync(async (filename, tag) => {
  if (!filename) return;

  const folderPath =
    process.env.NODE_ENV === "production" ? "" : path.join(__dirname, "..");
  const filepath = path.join(folderPath, "Public", "img", tag, filename);

  fs.unlink(filepath, (err) => {
    if (err) console.log(err);
  });
});

exports.deleteImages = catchAsync(async (filenames, tag) => {
  if (!filenames) return;

  filenames.forEach((filename) => {
    const folderPath =
      process.env.NODE_ENV === "production" ? "" : path.join(__dirname, "..");
    const filepath = path.join(folderPath, "Public", "img", tag, filename);

    fs.unlink(filepath, (err) => {
      if (err) console.log(err);
    });
  });
});
