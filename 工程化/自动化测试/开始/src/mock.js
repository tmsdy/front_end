export const runCallback = (callback) => {
  // callback(); //这样写是不行的
  return callback();
}