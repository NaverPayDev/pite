const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
export {
  sleep as default
};
