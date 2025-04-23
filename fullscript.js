//Piano part




// Create an Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer; // Variable to store the uploaded audio buffer
let analyserNode; // Variable to analyze the audio frequencies

// Note frequencies for a standard piano
const noteFrequencies = {
    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81,
    'F3': 174.61, 'F#3': 185, 'G3': 196, 'G#3': 207.65, 'A3': 220,
    'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
    'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
    'A#4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25,
    'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880,
    'A#5': 932.33, 'B5': 987.77,
    'C6': 1046.50, 'C#6' : 1108.73,
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

    reader.onload = function (e) {
        // Decode the audio data
        audioContext.decodeAudioData(e.target.result, function (buffer) {
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





//Library part






function toggleLanguage() {
    var langToggle = document.getElementById("languageToggle");
    var lang = langToggle.textContent === "LV" ? "en" : "lv";
    var translations = {
        lv: { title: "Virtuālās Klavieres", library: "Skaņu bibliotēka", download: "Lejupielādēt melodiju", training: "Apmācības režīms", tones: "Mainīt toņus", libraryTitle: "Skaņu bibliotēka", home: "Galvenā" },
        en: { title: "Virtual Piano", library: "Sound Library", download: "Download melody", training: "Training mode", tones: "Change tones", libraryTitle: "Sound Library", home: "Home" }
    };
    document.querySelectorAll("[data-lang]").forEach(el => {
        var key = el.getAttribute("data-lang");
        el.textContent = translations[lang][key];
    });
    document.getElementById("libraryTitle").textContent = translations[lang].libraryTitle;
    langToggle.textContent = lang.toUpperCase();
}
function toggleLibrary() {
    var library = document.getElementById("musicLibrary");
    library.style.display = (library.style.display === "none" || library.style.display === "") ? "block" : "none";
}
function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.style.left = menu.style.left === "-25%" ? "0px" : "-25%";
    menu.style.opacity = menu.style.opacity === "0" ? "1" : "0";
}
function goHome() {
    location.reload();
}
document.getElementById("toggleButton").addEventListener("click", toggleMenu);
toggleLanguage();






// Note line part






//onload stuff
function welcomeFunction() {
    console.log("Reset");
    follower('.reaction-base-type1');
}


var fileReader = new FileReader();

var melodyEncoded = [];
var cells = 1;
const maxCells = 500;

var noteLength;
var leftMouseClicked = false;

const melodyDecoded = ["A#4", "B3", "C4", "B3", "C4", "C#4", "C#4", "D4", "D#4", "D#4",
    "E4", "F4", "E4", "F4", "F#4", "F#4", "G4", "G#4", "G#4", "A4", "A#4", "A#4", "B4", "C5",
    "B4", "C5", "C#5", "C#5", "D5", "D#5", "D#5", "E5", "F5", "E5", "F5", "F#5", "F#5", "G5",
    "G#5", "G#5", "A5", "A#5", "A#5", "B5", "C6", "B5", "C6", "C#6"];
var BPM = 120;

// Creating starting array
for (var i = 0; i < cells; i++) {
    melodyEncoded = melodyEncoded.concat(40);
    for (var j = 0; j < 5; j++) {
        melodyEncoded = melodyEncoded.concat(10);
    }
}

//Activating the note
function noteBascket(setNL) {
    noteLength = setNL;         //what this
}
function reactToClick(event, baseInQuestion, n) {

    // locating stuff
    const height = baseInQuestion.clientHeight;
    const clickY = event.clientY - baseInQuestion.getBoundingClientRect().top;
    const noteChanger = parseInt(16 * (1 - (clickY / height)));
    const Coef = (n - 1) * 6;
    console.log(height, clickY, noteChanger);

    const resultCode = 10 + ((noteChanger + 1) * 3);

    // handling all outcomes
    switch (event.button) {

        // adding a note
        case 0:
            console.log("Left mouse button clicked.");
            if (melodyEncoded[Coef] % 10 < 5) { //check note count
                for (let c = 1; c <= 5; c++) {
                    if (melodyEncoded[Coef + c] == 10) { //check if the cell has free space
                        melodyEncoded[Coef + c] = resultCode;
                        melodyEncoded[Coef]++;

                        arrayNotesAdd(baseInQuestion, event, resultCode, n);

                        break;
                    } else if (melodyEncoded[Coef + c] == resultCode) {
                        const element = document.getElementById('note' + n + resultCode);
                        element.remove();
                        for (let u = 5; u >= 1; u--) {
                            console.log('numbers' + melodyEncoded[Coef + u] + 'and' + melodyEncoded[Coef + c]);
                            if (melodyEncoded[Coef + u] != 10) {
                                melodyEncoded[Coef + c] = melodyEncoded[Coef + u];
                                melodyEncoded[Coef + u] = 10;
                                console.log('numbers' + melodyEncoded[Coef + u] + 'and' + melodyEncoded[Coef + c]);
                                melodyEncoded[Coef] --;
                                break;
                            }
                        }
                        break;
                    } else { console.log("skippin"); }
                }
                if (melodyEncoded[(cells - 1) * 6] % 10 == 1) { arrayCellsAdd(n); }
            } else { alert("note maximum reached!") }
            break;
    }
    document.getElementById('melodyEncoded').innerHTML = melodyEncoded;// temporary output
}

// adding a note cell
function arrayCellsAdd(idd) {
    const container = document.getElementById('reaction-base-container');
    const end = document.getElementById('vertical-lines');
    const b = document.createElement('div');
    const c = document.createElement('div');
    cells++;
    const n = cells;

    b.className = 'reaction-base-type1';
    b.id = 'base' + cells;
    b.onclick = function (event) {
        reactToClick(event, this, n);
        console.log(event, this, n);
    };

    c.className = 'reaction-base-type2';
    c.id = 'b' + cells;
    c.onclick = function (event) {
        arrayCellsAdd(n);
    };

    console.log(cells);
    if (cells % 10 == 1) {
        const a = document.createElement('div');
        const aa = document.createElement('div');
        const aatp = document.createElement('div');
        a.className = 'line-container';
        aa.className = 'line';
        aatp.className = 'line-tp';

        const vcontainer = document.getElementById('theCoolAwesomeDiv');
        console.log('func opened');


        a.id = 'lines' + (cells)
        for (let i = 0; i < 2; i++) {
            const newAatp = document.createElement('div');
            newAatp.className = 'line-tp'; // Set class for the new element
            a.appendChild(newAatp);
        }

        // Append the aa element five times
        for (let i = 0; i < 5; i++) {
            const newAa = document.createElement('div');
            newAa.className = 'line'; // Set class for the new element
            a.appendChild(newAa);
        }

        const newAatp = document.createElement('div');
        newAatp.className = 'line-tp'; // Set class for the new element
        a.appendChild(newAatp);

        vcontainer.appendChild(a); // Append the actual element
    }

    container.insertBefore((c), end);
    container.insertBefore((b), end);
    follower('.reaction-base-type1');// updating follower
    melodyEncoded = melodyEncoded.concat(40, 10, 10, 10, 10, 10);
    document.getElementById('melodyEncoded').innerHTML = melodyEncoded;
}


// ADDING A VISUAL NOTE
function arrayNotesAdd(idd, e, rc, n) {
    console.log(e);
    const rect = idd.getBoundingClientRect();
    const a = document.createElement('div');
    a.className = 'one-4';
    a.id = 'note' + n + rc;

    // Calculate the center X position
    const centerX = rect.width / 2 - 10;
    a.style.left = `${centerX}px`;

    // Calculate the top position using rect.top
    a.style.top = `${e.clientY - rect.top - ((e.clientY - rect.top) % (0.011 * window.innerHeight)) + (0.006 * window.innerHeight) - 10}px`;


    // Append the note to the container
    idd.appendChild(a); // Append the note
}

// Temporary output
document.getElementById('melodyEncoded').innerHTML = melodyEncoded;

// !!!!Following the mouse
function follower(selector) {
    const follower = document.querySelector('.cursor-follower');
    const targetContainers = document.querySelectorAll(selector);
    document.addEventListener('mousemove', (e) => {



        // Check if mouse is inside any target container
        let isInsideTarget = false;
        targetContainers.forEach(container => {
            const rect = container.getBoundingClientRect();
            const scrollTop = rect.scrollTop;
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                isInsideTarget = true;

                // Update follower position
                const centerX = rect.left + rect.width / 2;
                follower.style.left = `${centerX}px`;
                follower.style.top = `${e.clientY - ((e.clientY - rect.y) % (0.011 * (window.innerHeight))) + 0.006 * window.innerHeight}px`;
            }
        });

        follower.style.display = isInsideTarget ? 'block' : 'none'; // Toggle visibility based on container check
    });
}

// Downloading the array
function downloadArray() {
    const blob = new Blob([melodyEncoded.join('')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'myMasterpiece.txt';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(link.href); }, 100);
}

// Uploading the array
function uploadArray() {
    var fileToLoad = document.getElementById("fileInput").files[0];

    if (!fileToLoad) {
        alert("Please select a file first.");
        return;
    }

    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        //updating 
        melodyEncoded = [];
        for (let i = 0; i < textFromFileLoaded.length; i += 2) {
            melodyEncoded.push(textFromFileLoaded.substring(i, i + 2));
        }
        document.getElementById("melodyEncoded").innerHTML = melodyEncoded;
    };

    fileReader.readAsText(fileToLoad);

}

function play() {
    let waitTime = 0;
    var coef = 4;

    for (let c = 0; c < melodyEncoded.length; c += 6) {
        coef = (melodyEncoded[c] - melodyEncoded[c] % 10) / 10;

        const noteTimeOut = setTimeout(() => {
            for (let n = 1; n < 6; n++) {
                if (melodyEncoded[c + n] == 10) {
                    break;
                } else {
                    playAudio(melodyDecoded[melodyEncoded[c + n] - 12]); // Play the uploaded audio with modified pitch
                }
            }
        }, waitTime);

        // Update currentTime for the next group of notes
        waitTime += 240000 / (BPM * coef);
    }
}
