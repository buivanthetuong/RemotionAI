const mp3Duration = require("mp3-duration");
const fs = require("fs");
const path = require("path");

async function test() {
  for (let i = 1; i <= 8; i++) {
    let file = path.join(
      __dirname,
      "src",
      "assets",
      "conan",
      "nnca_" + i + ".mp3",
    );
    mp3Duration(file, function (err, duration) {
      if (err) return console.log(err.message);
      console.log("nnca_" + i + ".mp3:", duration);
    });
  }
}
test();
