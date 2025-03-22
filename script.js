/*
// Add event listeners to each key
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('mousedown', () => playSound(key.dataset.note));
});

// Function to play sound
function playSound(note) {
  const audio = new Audio(`sounds/${note}.mp3`);
  audio.play();
}
*/

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser, source;

const noteFrequencies = {
  'C': 32.703,
  'С#': 34.648,
  'D': 36.708,
  'D#': 38.891,
  'E': 41.203,
  'F': 43.654,
  'F#': 46.249,
  'G': 48.999,
  'G#': 51.913,
  'A': 55,
  'A#': 58.27,
  'B': 61.735,
};


// Upload and process audio
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function (e) {
    audioContext.decodeAudioData(e.target.result, 
      buffer =>{processAudio(buffer)},
      error => console.error("Error decoding audio file:", error)
    );
  };
  reader.readAsArrayBuffer(file);
}

document.getElementById('fileInput').addEventListener('change', handleFileUpload);

// Process uploaded audio
function processAudio(buffer) {
  source = audioContext.createBufferSource();
  analyser = audioContext.createAnalyser();
  
  source.buffer = buffer;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  source.start();
  
  detectNotes();
}

// Detect and highlight notes
function detectNotes() {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  
  const detectedFreq = getDominantFrequency(dataArray);
  const closestNote = findClosestNote(detectedFreq);
  highlightKey(closestNote);
}

function getDominantFrequency(dataArray) {
  let maxIndex = 0;
  let maxValue = -Infinity;
  
  dataArray.forEach((value, index) => {
    if (value > maxValue) {
      maxValue = value;
      maxIndex = index;
    }
  });
  
  return audioContext.sampleRate * maxIndex / analyser.fftSize;
}

function findClosestNote(freq) {
  return Object.keys(noteFrequencies).reduce((closest, note) => {
    return Math.abs(noteFrequencies[note] - freq) < Math.abs(noteFrequencies[closest] - freq) ? note : closest;
  });
}

function highlightKey(note) {
  document.querySelectorAll('.key').forEach(key => key.classList.remove('active'));
  const key = document.querySelector(`.key[data-note="${note}"]`);
  if (key) key.classList.add('active');
}

document.body.addEventListener("click", () => {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
});
