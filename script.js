// Create an Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
let audioBuffer; // Variable to store the uploaded audio buffer
let analyserNode; // Variable to analyze the audio frequencies

// Note frequencies for a standard piano
const noteFrequencies = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
    'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
    'A#': 466.16, 'B': 493.88, 'C2': 523.25
};

// Set up event listeners for file input
document.getElementById('fileInput').addEventListener('change', handleFileUpload);

// Add event listeners to piano keys
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.dataset.note; // Get the note from the data attribute
        playAudio(note); // Play the uploaded audio with modified pitch
        highlightKey(key); // Highlight the key
    });
});

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0]; // Get the uploaded file
    if (!file) return;

    const reader = new FileReader(); // Create a FileReader to read the file
    
    reader.onload = function(e) {
        // Decode the audio data
        audioContext.decodeAudioData(e.target.result, function(buffer) {
            audioBuffer = buffer; // Store the decoded audio buffer
            setupAnalyser(); // Set up the analyser node
        });
    };

    reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
}

// Set up the analyser node
function setupAnalyser() {
    analyserNode = audioContext.createAnalyser(); // Create an analyser node
    analyserNode.fftSize = 2048; // Set the FFT size for frequency analysis
}

// Play the uploaded audio and adjust frequency
function playAudio(note) {
    if (!audioBuffer) {
        alert("Please upload an audio file first.");
        return;
    }

    const source = audioContext.createBufferSource(); // Create a new buffer source
    source.buffer = audioBuffer; // Use the uploaded audio as the source

    // Connect the source to the analyser and then to the destination
    source.connect(analyserNode); // Connect to the analyser node
    analyserNode.connect(audioContext.destination); // Connect to the speakers

    // Adjust playback speed based on selected note
    if (noteFrequencies[note]) {
        source.playbackRate.value = noteFrequencies[note] / 440; // Adjust pitch relative to A (440Hz)
    }

    source.start(0); // Start playing the sound
}

// Highlight the pressed key
function highlightKey(key) {
    document.querySelectorAll('.key').forEach(k => k.classList.remove('active'));
    key.classList.add('active');

    setTimeout(() => {
        key.classList.remove('active'); // Remove highlight after 200ms
    }, 200);
}

// Ensure the audio context resumes when interacting with the page
document.body.addEventListener("click", () => {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
});
