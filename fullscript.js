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
    'C6': 1046.50, 
};

// Set up event listeners for file input
document.getElementById('fileInput').addEventListener('change', handleFileUpload);

// Add keyboard event listener
document.addEventListener('keydown', (event) => {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    const keyMap = {
        'q': 'C3',
        'w': 'C#3',
        'e': 'D3',
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
    const note = keyMap[event.key];
    if (note) {
        playAudio(note); // Play the note

        // Find the key element with this note and highlight it
        const keyElement = document.querySelector(`.key[data-note="${note}"]`);
        if (keyElement) {
            highlightKey(keyElement);
        }
    }
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
    var langButton = document.getElementById("languageButton");
    var currentLang = langButton.textContent === "LV" ? "lv" : "en";
    var newLang = currentLang === "lv" ? "en" : "lv";
    var translations = {
                lv: {
            title: "Virtuālās Klavieres",
            library: "Melodiju bibliotēka",
            download: "Ielādēt melodiju",
            training: "Apmācības režīms",
            tones: "Mainīt toņus",
            libraryTitle: "Skaņu bibliotēka",
            home: "Galvenā",
            soundSel: "Izvēlēties audio",
            Downl: "Lejupielādēt kodu",
            Upl:"Augšpielādēt kodu",
            Load: "Konstruēt melodiju (wip)"
        },
        en: {
            title: "Virtual Piano",
            library: "Melody Library",
            download: "Browse melody",
            training: "Training mode",
            tones: "Change tones",
            libraryTitle: "Sound Library",
            home: "Home",
            soundSel: "Select an audio",
            Downl: "Download this",
            Upl:"Upload sound",
            Load: "Load Selected array (wip)"
        }
    };
    document.querySelectorAll("[data-lang]").forEach(el => {
        var key = el.getAttribute("data-lang");
        el.textContent = translations[newLang][key];
    });
    document.getElementById("libraryTitle").textContent = translations[newLang].libraryTitle;
    langButton.textContent = newLang.toUpperCase();
}
function toggleLibrary() {
    var library = document.getElementById("musicLibrary");
    library.style.display = (library.style.display === "none" || library.style.display === "") ? "block" : "none";
}
function downloadMelody() {
    document.getElementById("fileInput").click();
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

document.getElementById("toggleButton").addEventListener("click", toggleMenu);

toggleLanguage();

// Load and preview a track (and set it as current audioBuffer)

document.querySelectorAll('.track').forEach(track => {
    track.addEventListener('click', () => {
        const audioPath = track.getAttribute('data-audio');

        fetch(audioPath)
            .then(res => res.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(decodedBuffer => {
                audioBuffer = decodedBuffer; // Now piano uses this audio

                setupAnalyser();

                // Play a 2-second preview
                const previewSource = audioContext.createBufferSource();
                previewSource.buffer = decodedBuffer;

                const previewGain = audioContext.createGain(); // so we can stop it cleanly
                previewSource.connect(previewGain);
                previewGain.connect(audioContext.destination);

                previewSource.start(0)
                previewSource.stop(audioContext.currentTime + 2); // Stop after 2 seconds

            })
            .catch(err => console.error("Failed to load audio:", err));
    });
});

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

var noteLength = 4;

const melodyDecoded = ["A#2", "B2", "C3", "B2", "C3", "C#3", "C#3", "D3", "D#3", "D#3",
    "E3", "F3", "E3", "F3", "F#3", "F#3", "G3", "G#3", "G#3", "A3", "A#3", "A#3", "B3", "C4",
    "B3", "C4", "C#4", "C#4", "D4", "D#4", "D#4", "E4", "F4", "E4", "F4", "F#4", "F#4", "G4",
    "G#4", "G#4", "A4", "A#4", "A#4", "B4", "C5", "B4", "C5", "C#5"];
var BPM = 60;

// Creating starting array
for (var i = 0; i < cells; i++) {
    melodyEncoded = melodyEncoded.concat(40);
    for (var j = 0; j < 5; j++) {
        melodyEncoded = melodyEncoded.concat(10);
    }
}

//Activating the note
function noteBasket(setNL) {
    noteLength = setNL;         //what this
}

function reactToClick(event, baseInQuestion, n) {
    /*n - numeral of the cell
    baseInQuestion - cell ID
    event - event obvi
    */

    // locating stuff
    const height = baseInQuestion.clientHeight;
    const clickY = event.clientY - baseInQuestion.getBoundingClientRect().top;
    const noteChanger = parseInt(16 * (1 - (clickY / height)));
    const Coef = (n - 1) * 6;
    var switcher;

    const resultCode = 10 + ((noteChanger + 1) * 3); // setting note height

    switcher = noteLength > 5 ? 2 : noteLength > 0 ? 1 : 3;
    //changing length coef
    switch (switcher) {
        case 1:
            melodyEncoded[Coef] = noteLength * 10 + (melodyEncoded[Coef] % 10);


            //changing stick style
            const stboba = document.getElementById("s" + `${n}`); // stboba is a stick for abobas
            if (!stboba.classList.contains("stick" + `${2 ** (noteLength - 1)}`)) {
                stboba.classList.remove(stboba.classList.item(0));
                stboba.classList.add("stick" + `${2 ** (noteLength - 1)}`);
            }





            //changing preexisting notes class

            if (melodyEncoded[Coef + 1] == 88) { //in case it used to be a pause
                const removePause = document.getElementById("p" + `${n}`);
                removePause.remove();
                melodyEncoded[Coef + 1] = 10; //prepare to add notes
                melodyEncoded[Coef]--;
            } 
                for (i = 1; i <= melodyEncoded[Coef] % 10; i++) { //according to the note amount
                    const aboba = document.getElementById("note" + `${n}${melodyEncoded[Coef + i ]}`);
                    const newClass = "n" + `${2 ** (noteLength - 1)}`;

                        if (aboba.className.slice(-1) == 'b' || aboba.className.slice(-1) == 'd') {
                            var lastChar = aboba.className.slice(-1);
                            aboba.classList.remove(aboba.classList.item(0));
                            aboba.classList.add(newClass + lastChar);
                        } else {
                            aboba.classList.remove(aboba.classList.item(0));
                            aboba.classList.add(newClass);
                        }
                        console.log (aboba.className)
                }
                melodyEncoded[Coef] = noteLength * 10 + (melodyEncoded[Coef] % 10);
            console.log(((melodyEncoded[Coef]-melodyEncoded[Coef + 1]%10)/10), noteLength);


            for (let c = 1; c <= 5; c++) {
                if (melodyEncoded[Coef + c] == 10) { //check if the cell has free space
                    melodyEncoded[Coef + c] = resultCode;
                    melodyEncoded[Coef]++;

                    arrayNotesAdd(baseInQuestion, event, resultCode, n);

                    break;
                } else if (melodyEncoded[Coef + c] == resultCode || // check if it's already there //
                    melodyEncoded[Coef + c] == (resultCode + 1) ||
                    melodyEncoded[Coef + c] == (resultCode - 1)
                ) {
                    const curF = melodyEncoded[Coef + c]; //shortening the name
                    const rcd =
                        resultCode == curF ? resultCode : curF == (resultCode + 1) ? (resultCode + 1) : (resultCode - 1); //finding the specific coef

                    const element = document.getElementById('note' + n + rcd);
                    element.remove();
                    for (let u = 5; u >= 1; u--) {
                        if (melodyEncoded[Coef + u] != 10) {
                            melodyEncoded[Coef + c] = melodyEncoded[Coef + u];
                            melodyEncoded[Coef + u] = 10;
                            melodyEncoded[Coef]--;
                            break;
                        }
                    }
                    break;
                } else { if (c == 5) { alert("maximum 5 notes at once!"); } }
            }

            break;

        case 2: //adding a pause
            if (melodyEncoded[Coef] == noteLength * 10 + 1) { //remove the pause
                melodyEncoded[Coef] = 40;
                melodyEncoded[Coef + 1] = 10;
                const removePause2 = document.getElementById("p" + `${n}`);
                removePause2.remove();

            }
            melodyEncoded[Coef] = noteLength * 10 + 1;

            const stboba2 = document.getElementById("s" + `${n}`); // stboba is stick for abobas
            if (!stboba2.classList.contains("stick" + `${2 ** (noteLength - 1)}`)) {
                stboba2.classList.remove(stboba2.classList.item(0));
                stboba2.classList.add("stick" + `${2 ** (noteLength - 1)}`);
            }

            if (melodyEncoded[Coef + 1] == (88)) {
                const changePause = document.getElementById("p" + `${n}`);
                changePause.classList.remove(changePause.classList.item(0));
                changePause.classList.add("pause" + (2 ** (noteLength - 5)));
            } else {

                for (let c = 1; c <= 5; c++) {
                    if (melodyEncoded[Coef + c] != 10) {
                        const removeNote = document.getElementById("note" + `${n}${melodyEncoded[Coef + c]}`);
                        removeNote.remove();
                        melodyEncoded[Coef + c] = 10;  //removing notes

                    } else { break; }
                }
                arrayPausesAdd(n, baseInQuestion);
                melodyEncoded[Coef + 1] = 88;
            }

            melodyEncoded[Coef] = noteLength * 10 + 1;
            melodyEncoded[Coef + 1] = 88;

            break;

        case 3:

            const addOn = noteLength == "d" ? 1 : (-1);
            const cf = (melodyEncoded[Coef] - melodyEncoded[Coef] % 10) / 10;

            for (let c = 1; c <= 5; c++) {
                if (melodyEncoded[Coef + c] == resultCode || // check if it's already there //
                    melodyEncoded[Coef + c] == (resultCode + 1) ||
                    melodyEncoded[Coef + c] == (resultCode - 1)
                ) {
                    var cc = melodyEncoded[Coef + c];

                    if ((cc - resultCode) == addOn) {
                        const element = document.getElementById('note' + `${n}${cc}`);
                        element.classList.remove(element.classList.item(0));
                        element.classList.add("n" + `${2 ** (cf - 1)}`);

                        melodyEncoded[Coef + c] = resultCode - addOn; //changing the array
                        cc = melodyEncoded[Coef + c];
                        element.id = 'note' + `${n}${cc}`;

                    } else {
                        const element = document.getElementById('note' + `${n}${cc}`);

                        melodyEncoded[Coef + c] = resultCode + addOn; //changing the array
                        cc = melodyEncoded[Coef + c];

                        element.classList.remove(element.classList.item(0));
                        element.classList.add("n" + `${2 ** (cf - 1)}` + noteLength);

                        element.id = 'note' + `${n}${cc}`;
                    }

                    break;
                } else { }
            }

            break;


        default:

    }

    if (melodyEncoded[(cells - 1) * 6] % 10 > 0) { arrayCellsAdd(n); }

    let min = 60;
    let max = 10;
    const stboba = document.getElementById("s" + n);
    for (i = 1; i <= melodyEncoded[Coef] % 10; i++) {
        if (melodyEncoded[Coef + i] < min) { min = melodyEncoded[Coef + i]; }
        if (melodyEncoded[Coef + i] > max) { max = melodyEncoded[Coef + i]; }
    }
    const stbobaHeight = ((max - min) - ((max - min) % 3)) / 3 * 0.011 * window.innerHeight + 43;//changing stick length
    stboba.style.height = `${stbobaHeight}px`;
    stboba.style.top = `${(58 - max) / 3 * 0.011 * window.innerHeight - 40}px`;

    if (melodyEncoded[Coef] % 10 == 0) {
        stboba.classList.remove(stboba.classList.item(0));
        stboba.classList.add("stick1");
    }
        
}
// adding a note cell
function arrayCellsAdd(idd) {
    const container = document.getElementById('reaction-base-container');
    const end = document.getElementById('vertical-lines');
    const b = document.createElement('div');
    const c = document.createElement('div');
    const newStick = document.createElement('div');
    cells++;
    const n = cells;

    b.className = 'reaction-base-type1';
    b.id = 'base' + cells;
    b.onclick = function (event) {
        reactToClick(event, this, n);
    };

    c.className = 'reaction-base-type2';
    c.id = 'b' + cells;
    c.onclick = function (event) {
        arrayCellsAdd(n);
    };

    newStick.className = 'stick1';
    newStick.id = 's' + cells;

    if (cells % 10 == 1) {
        const a = document.createElement('div');
        const aa = document.createElement('div');
        const aatp = document.createElement('div');
        a.className = 'line-container';
        aa.className = 'line';
        aatp.className = 'line-tp';

        const vcontainer = document.getElementById('theCoolAwesomeDiv');


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
    b.appendChild(newStick);
    follower('.reaction-base-type1');// updating follower
    melodyEncoded = melodyEncoded.concat(40, 10, 10, 10, 10, 10);
}


// ADDING A VISUAL NOTE
function arrayNotesAdd(idd, e, rc, n) {
    const rect = idd.getBoundingClientRect();
    const a = document.createElement('div');
    a.className = 'n' + `${2 ** (noteLength - 1)}`;
    a.id = 'note' + n + rc;

    // Calculate the center X position


    // Calculate the top position using rect.top
    a.style.top = `${e.clientY - rect.top - ((e.clientY - rect.top) % (0.011 * window.innerHeight)) - 2}px`;


    // Append the note to the container
    idd.appendChild(a); // Append the note
}

function arrayPausesAdd(n, idd) {
    const pause = document.createElement('div');
    pause.className = 'pause' + `${2 ** (noteLength - 5)}`;
    pause.id = 'p' + n;
    idd.appendChild(pause);
}


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

