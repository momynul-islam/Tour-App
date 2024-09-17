const fs = require("fs");
const path = require("path");
const catchAsync = require("./catchAsync");

exports.deleteCoverImage = catchAsync(async (filename, tag) => {
  console.log("cover", filename);
  if (!filename) return;
  const filepath = path.join(__dirname, "..", "public", "img", tag, filename);
  console.log(filepath);
  fs.unlink(filepath, (err) => {
    if (err) console.log(err);
    else console.log("deleted");
  });
});

exports.deleteImages = catchAsync(async (filenames, tag) => {
  console.log("images", filenames);
  if (!filenames) return;
  filenames.forEach((filename) => {
    const filepath = path.join(__dirname, "..", "public", "img", tag, filename);
    console.log(filepath);
    fs.unlink(filepath, (err) => {
      if (err) console.log(err);
      else console.log("deleted");
    });
  });
});
