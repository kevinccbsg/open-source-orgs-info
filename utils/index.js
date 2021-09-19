const filterByState = (array, state) => (
  array.filter(item => item.state === state)
);

const sleep = ms => (
  new Promise(resolve => setTimeout(resolve, ms))
);

module.exports = {
  filterByState,
  sleep,
};
