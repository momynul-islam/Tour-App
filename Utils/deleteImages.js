const fs = require("fs");
const path = require("path");
const catchAsync = require("./catchAsync");

exports.deleteCoverImage = catchAsync(async (filename, tag) => {
  if (!filename) return;

  const filepath = path.join(__dirname, "..", "public", "img", tag, filename);

  fs.unlink(filepath, (err) => {
    if (err) console.log(err);
  });
});

exports.deleteImages = catchAsync(async (filenames, tag) => {
  if (!filenames) return;

  filenames.forEach((filename) => {
    const filepath = path.join(__dirname, "..", "public", "img", tag, filename);

    fs.unlink(filepath, (err) => {
      if (err) console.log(err);
    });
  });
});
