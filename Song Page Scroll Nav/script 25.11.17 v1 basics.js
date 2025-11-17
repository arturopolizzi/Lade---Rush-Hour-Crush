// store the value of the center of the vertical viewport
let currentCenterY = window.innerHeight / 2;

//store the minimum and maximum possible centerY values
const minCenterY = window.innerHeight / 2;
const maxCenterY = document.body.scrollHeight - (window.innerHeight / 2);

// Function to get normalized centerY value between 0 and 1
function getNormalizedCenterY() {
    return (currentCenterY - minCenterY) / (maxCenterY - minCenterY);
}

// log normalized centerY on scroll
window.addEventListener('scroll', () => {
    currentCenterY = window.innerHeight / 2 + window.scrollY;
    console.log('Center Y:', currentCenterY);
    const normalizedCenterY = getNormalizedCenterY();
    console.log('Normalized Center Y:', normalizedCenterY);
});

song = new Audio('01 - Fiesta.mp3');
// make the current play position of the song depend on the normalized centerY value
song.addEventListener('timeupdate', () => {
    const normalizedCenterY = getNormalizedCenterY();
    song.currentTime = normalizedCenterY * song.duration;
});

// play the song
song.loop = true;
song.play(); 
