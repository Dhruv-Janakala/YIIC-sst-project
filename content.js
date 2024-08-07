let startTime;
let domain;
let timerElement;

function createTimerElement() {
  timerElement = document.createElement('div');
  timerElement.id = 'embedded-timer';
  timerElement.style.position = 'fixed';
  timerElement.style.top = '10px';
  timerElement.style.right = '10px';
  timerElement.style.zIndex = '9999';
  document.body.appendChild(timerElement);
}

function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  
  timerElement.textContent = `Time on site: ${formatTime(elapsedTime)}`;
  
  chrome.storage.local.get('timers', (data) => {
    const timers = data.timers || {};
    timers[domain] = (timers[domain] || 0) + 1;
    chrome.storage.local.set({ timers });
  });

  setTimeout(updateTimer, 1000);
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

function initializeTimer() {
  startTime = Date.now();
  domain = window.location.hostname;
  createTimerElement();
  updateTimer();
}

// Start the timer when the content script loads
initializeTimer();