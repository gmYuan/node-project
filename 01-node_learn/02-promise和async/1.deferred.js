const fs = require("fs");
const Promise = require("./promise");
const path = require("path");

function readFile(url) {
  let dfd = Promise.deferred();
  // return new Promise((resolve, reject) => {
  fs.readFile(url, "utf-8", function (err, data) {
    if (err) return dfd.reject(err);
    dfd.resolve(data);
  });
  // })
  return dfd.promise;
}

readFile(path.resolve(__dirname, "name.txt")).then((data) => {
  console.log(data);
});
