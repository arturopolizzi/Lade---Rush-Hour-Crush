function getValues() {
    //store the minimum and maximum possible centerY values
    minCenterY = window.innerHeight / 2;
    maxCenterY = document.body.scrollHeight - (window.innerHeight / 2);
    // store the value of the center of the vertical viewport
    currentCenterY = window.innerHeight / 2 + window.scrollY;

    normalisedCenterY = (currentCenterY - minCenterY) / (maxCenterY - minCenterY);

    return [minCenterY, maxCenterY, currentCenterY, normalisedCenterY];
}

song = new Audio('01 - Fiesta.mp3');
song.play();
//make the current scroll position of the page depend on a normalised time value of the song
song.addEventListener('timeupdate', () => {
    const normalizedTime = song.currentTime / song.duration;
    const targetCenterY = minCenterY + normalizedTime * (maxCenterY - minCenterY);
    const targetScrollY = targetCenterY - (window.innerHeight / 2);
    autoScroll(targetScrollY);
})

function autoScroll(Y) {
    scrollIsAutomatic = true;
    window.scrollTo(0, Y);
}

window.addEventListener('wheel', () => {
    scrollIsAutomatic = false;
})

window.addEventListener('scroll', () => {
    console.log(getValues());
    if (scrollIsAutomatic) {
        console.log("is scrolling automatically")
    }
});

window.addEventListener('resize', () => {
    console.log(getValues());
});