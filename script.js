// Create an Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Create a new audio context
let audioBuffer; // Variable to store the uploaded audio buffer
let analyserNode; // Variable to analyze the audio frequencies

// Set up event listeners for file input and play button
document.getElementById('fileInput').addEventListener('change', handleFileUpload); // Handle file upload
document.getElementById('playButton').addEventListener('click', playAudio); // Handle play button click

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0]; // Get the uploaded file
    const reader = new FileReader(); // Create a FileReader to read the file
    
    // When the file is loaded
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

// Play the uploaded audio
function playAudio() {
    if (!audioBuffer) return; // Ensure audioBuffer is loaded

    const source = audioContext.createBufferSource(); // Create a new buffer source
    source.buffer = audioBuffer; // Set the buffer to the uploaded audio

    // Connect the source to the analyser and then to the destination
    source.connect(analyserNode); // Connect to the analyser node
    analyserNode.connect(audioContext.destination); // Connect to the audio context destination (speakers)

    // Detect frequency and adjust playback rate
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount); // Create an array to hold frequency data
    analyserNode.getByteFrequencyData(frequencyData); // Get the frequency data from the analyser
    const averageFrequency = frequencyData.reduce((a, b) => a + b) / frequencyData.length; // Calculate the average frequency

    // Change playback rate based on detected frequency
    const playbackRate = averageFrequency / 128; // Adjust playback rate (this may need tuning)
    source.playbackRate.value = playbackRate; // Set the playback rate

    source.start(0); // Start playback
    visualize(); // Start visualizing the audio
}

// Visualize the audio frequencies
function visualize() {
   
