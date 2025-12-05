self.onmessage = function (event) {
  // Start at 100 let it go to a minus value so we can display 0 for a sec.
  const { message, delay } = event.data;
  let progress = 100;
  const intervalId = setInterval(() => {
    progress -= 100 / delay;
    self.postMessage({ message, progress });
    if (progress < 0) clearInterval(intervalId);
  }, 1000);
};
