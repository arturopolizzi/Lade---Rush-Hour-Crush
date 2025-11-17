// store the value of the center of the vertical viewport
let currentCenterY = window.innerHeight / 2;

//store the minimum and maximum possible centerY values
const minCenterY = window.innerHeight / 2;
const maxCenterY = document.body.scrollHeight - (window.innerHeight / 2);

// Function to get normalized centerY value between 0 and 1
function getNormalizedCenterY() {
    return (currentCenterY - minCenterY) / (maxCenterY - minCenterY);
}

song = new Audio('01 - Fiesta.mp3');
song.play();
//make the current scroll position of the page depend on a normalised time value of the song
song.addEventListener('timeupdate', () => {
    const normalizedTime = song.currentTime / song.duration;
    const targetCenterY = minCenterY + normalizedTime * (maxCenterY - minCenterY);
    const targetScrollY = targetCenterY - (window.innerHeight / 2);
    window.scrollTo(0, targetScrollY);
})