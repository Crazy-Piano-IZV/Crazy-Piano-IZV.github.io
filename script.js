// Add event listeners to each key
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('mousedown', () => playSound(key.dataset.note));
});

// Function to play sound
function playSound(note) {
  const audio = new Audio(`sounds/${note}.mp3`);
  audio.play();
}
