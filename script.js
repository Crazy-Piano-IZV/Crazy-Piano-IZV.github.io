// Create an Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser, source;

// Define frequencies for each note
const noteFrequencies = {
  'C': 261.63, 
  'C#': 277.18, 
  'D': 293.66, 
  'D#': 311.13, 
  'E': 329.63,
  'F': 349.23, 
  'F#': 369.99, 
  'G': 392.00, 
  'G#': 415.30, 
  'A': 440.00,
  'A#': 466.16, 
  'B': 493.88, 
  'C2': 523.25
};

//Handle Piano Key Clicks
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('mousedown', () => {
    const note = key.dataset.note;
    playGeneratedSound(note); // Play sound using oscillator
    highlightKey(note);       // Highlight the key
  });
});

// Play a generated sound using an oscillator
function playGeneratedSound(note) {
  const frequency = noteFrequencies[note];
  if (!frequency) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain(); // Volume control

  oscillator.frequency.value = frequency;
  oscillator.type = "sine"; // Can be "sine", "square", "sawtooth", "triangle"
  gainNode.gain.value = 0.2; // Set volume

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5); // Play for 0.5 sec
}

// Highlight the pressed key
function highlightKey(note) {
  document.querySelectorAll('.key').forEach(key => key.classList.remove('active'));
  const key = document.querySelector(`.key[data-note="${note}"]`);
  if (key) key.classList.add('active');

  // Remove highlight after a short delay
  setTimeout(() => {
    key.classList.remove('active');
  }, 500);
}

// Handle File Upload and Process Audio
document.getElementById('fileInput').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    audioContext.decodeAudioData(
      e.target.result,
      buffer => processAudio(buffer),
      error => console.error("Error decoding audio file:", error)
    );
  };
  reader.readAsArrayBuffer(file);
});

// Process uploaded audio and analyze frequencies
function processAudio(buffer) {
  source = audioContext.createBufferSource();
  analyser = audioContext.createAnalyser();

  source.buffer = buffer;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  source.start();

  detectNotes();
}

// Detect and highlight notes in the uploaded audio file
function detectNotes() {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  const detectedFreq = getDominantFrequency(dataArray);
  const closestNote = findClosestNote(detectedFreq);

  document.getElementById("detectedNote").textContent = `Detected Note: ${closestNote}`;
  highlightKey(closestNote);
}

// Find the dominant frequency in the uploaded audio
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

//Find the closest note to the detected frequency
function findClosestNote(freq) {
  return Object.keys(noteFrequencies).reduce((closest, note) => {
    return Math.abs(noteFrequencies[note] - freq) < Math.abs(noteFrequencies[closest] - freq) ? note : closest;
  });
}

// Ensure audio context is resumed when clicking anywhere
document.body.addEventListener("click", () => {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
});
