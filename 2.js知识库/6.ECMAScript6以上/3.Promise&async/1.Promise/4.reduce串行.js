
function runPromiseByQueue(myPromises) {
  myPromises.reduce(
    (previousPromise, nextPromise) => previousPromise.then(() => nextPromise()),
    Promise.resolve()
  );
}

const createPromise = (time, id) => () =>
  new Promise(resolve =>
    setTimeout(() => {
      console.log("promise", id)
      resolve()
    }, time)
  );

runPromiseByQueue([
  createPromise(1000, 1),
  createPromise(2000, 2),
  createPromise(3000, 3)
]);