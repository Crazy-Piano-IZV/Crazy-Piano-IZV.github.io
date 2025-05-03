// Create an Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
let audioBuffer; // Variable to store the uploaded audio buffer
let analyserNode; // Variable to analyze the audio frequencies

// Note frequencies for a standard piano
const noteFrequencies = {
    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81,
    'F3': 174.61, 'F#3': 185, 'G3': 196, 'G#3': 207.65, 'A3': 220 ,
    'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
    'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
    'A#4': 466.16, 'B4': 493.88,  
    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25,
    'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880,
    'A#5': 932.33, 'B5': 987.77, 
    'C6': 1046.50, 
};

// Set up event listeners for file input
document.getElementById('fileInput').addEventListener('change', handleFileUpload);

// Add keyboard event listener
document.addEventListener('keydown', (event) => {
    const keyMap = {
        'q': 'C3',
        'w': 'C#3',
        's': 'D3',
        'r': 'D#3',
        't': 'E3',
        'y': 'F3',
        'u': 'F#3',
        'i': 'G3',
        'o': 'G#3',
        'p': 'A3',
        'a': 'A#3',
        's': 'B3',

        'd': 'C4',
        'f': 'C#4',
        'g': 'D4',
        'h': 'D#4',
        'j': 'E4',
        'k': 'F4',
        'l': 'F#4',
        'z': 'G4',
        'x': 'G#4',
        'c': 'A4',
        'v': 'A#4',
        'b': 'B4',

        'n': 'C5',
        'm': 'C#5',
    };
});

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
