new Promise((resolve, reject) => {
  reject(100);
})
  .then(null, (reason) => { throw reason })
  .then((data) => { console.log(data, "s")},
    (err) => { console.log(err, "f") }
  );
