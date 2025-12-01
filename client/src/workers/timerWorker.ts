self.onmessage = function (event) {
  console.log("Timer worker started with data:", event.data);
  const { message, delay } = event.data;
  let progress = 100;
  const intervalId = setInterval(() => {
    console.log("Timer worker tick:", progress);
    progress -= 100 / delay;
    if (progress <= 0) {
      clearInterval(intervalId);
      self.postMessage({ message, progress: 0 });
    } else {
      self.postMessage({ message, progress });
    }
  }, 1000);
};
