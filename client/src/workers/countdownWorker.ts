self.onmessage = function (event) {
  const { progress, step } = event.data;
  let total = progress;
  const intervalId = setInterval(() => {
    total -= step;
    if (total <= 0) {
      clearInterval(intervalId);
      self.postMessage({ total: 0 });
    } else {
      self.postMessage({ total });
    }
  }, 1000);
};
