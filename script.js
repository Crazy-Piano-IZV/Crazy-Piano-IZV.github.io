// 🔊 Create an Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser, source, playbackRate = 1;

// 🎵 Define frequencies for each note
const noteFrequencies = {
  'C': 32.703, 'C#': 34.648, 'D': 36.708, 'D#': 38.891, 'E': 41.203,
  'F': 43.654, 'F#': 46.249, 'G': 48.999, 'G#': 51.913, 'A': 55.000,
  'A#': 58.270, 'B': 61.735, 'C2': 65.406
};

// 🎶 Handle File Upload
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

// 🎼 Process and Play Uploaded Audio with Pitch Shift
function processAudio(buffer) {
  if (source) source.stop(); // Stop previous playback if needed

  source = audioContext.createBufferSource();
  analyser = audioContext.createAnalyser();
  source.buffer = buffer;
  source.playbackRate.value = playbackRate; // Adjust pitch
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  source.start();

  detectNotes();
}

// 🔍 Detect and Change Frequencies
function detectNotes() {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  const detectedFreq = getDominantFrequency(dataArray);
  const closestNote = findClosestNote(detectedFreq);

  if (closestNote) {
    playbackRate = detectedFreq / noteFrequencies[closestNote]; // Adjust pitch
    if (source) source.playbackRate.value = playbackRate;
    highlightKey(closestNote);
    document.getElementById("detectedNote").textContent = `Detected Note: ${closestNote}`;
  }
}

// 🎹 Find the most dominant frequency
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

// 🎶 Find the closest note for pitch shifting
function findClosestNote(freq) {
  return Object.keys(noteFrequencies).reduce((closest, note) => {
    return Math.abs(noteFrequencies[note] - freq) < Math.abs(noteFrequencies[closest] - freq) ? note : closest;
  });
}

// 🔥 Highlight the detected key
function highlightKey(note) {
  document.querySelectorAll('.key').forEach(key => key.classList.remove('active'));
  const key = document.querySelector(`.key[data-note="${note}"]`);
  if (key) key.classList.add('active');

  setTimeout(() => key.classList.remove('active'), 500);
}

// 🔊 Ensure audio context is resumed when clicking anywhere
document.body.addEventListener("click", () => {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
});
