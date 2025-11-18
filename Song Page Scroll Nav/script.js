getValues();

window.addEventListener('scroll', () => {
    console.log(getValues());
});
window.addEventListener('resize', () => {
    console.log(getValues());
});

function getValues() {
    //store the minimum and maximum possible centerY values
    minCenterY = window.innerHeight / 2;
    maxCenterY = document.body.scrollHeight - (window.innerHeight / 2);
    // store the value of the center of the vertical viewport
    currentCenterY = window.innerHeight / 2 + window.scrollY;

    normalisedCenterY = (currentCenterY - minCenterY) / (maxCenterY - minCenterY);

    return [minCenterY, maxCenterY, currentCenterY, normalisedCenterY];
}