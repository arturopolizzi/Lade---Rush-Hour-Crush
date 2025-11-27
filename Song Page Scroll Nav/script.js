function getValues() {
    //store the minimum and maximum possible centerY values
    minCenterY = window.innerHeight / 2;
    maxCenterY = document.body.scrollHeight - (window.innerHeight / 2);
    // store the value of the center of the vertical viewport
    currentCenterY = window.innerHeight / 2 + window.scrollY;

    normalisedCenterY = (currentCenterY - minCenterY) / (maxCenterY - minCenterY);

    return [minCenterY, maxCenterY, currentCenterY, normalisedCenterY];
}


const song = new Audio('01 - Fiesta.mp3');

let songDuration = 0;
let autoRafId = null;

// get duration once metadata is available
song.addEventListener('loadedmetadata', () => {
    songDuration = song.duration || 0;
    console.log('song duration', songDuration);
});

// --- State Machine ---------------------------------------------------------

const states = {
    auto: {
        name: "auto",
        status() { console.log("scrolling automatically"); },
        execute() { startAutoScroll(); }
    },
    manual: {
        name: "manual",
        status() { console.log("scrolling manually"); },
        execute() {} // no loop
    },
    idle: {
        name: "idle",
        status() { console.log("not scrolling"); },
        execute() {}
    }
};

let currentState = states.auto;

// Helper to switch states cleanly
function setState(newStateName) {
    const newState = states[newStateName];
    if (currentState === newState) return;

    currentState = newState;
    currentState.status();
}

// --- Auto Scroll Loop ------------------------------------------------------

let autoScrollTimer = null;

function startAutoScroll() {
    stopAutoScroll(); // clear any previous RAF

    // ensure we have up-to-date bounds
    const [, , , ] = getValues(); // leave it in so min/max computed

    let last = performance.now();

    function rafLoop(now) {
        // only run if still in auto state
        if (currentState !== states.auto) return;

        // if duration not known or zero, do nothing
        if (!songDuration || songDuration <= 0) {
            autoRafId = requestAnimationFrame(rafLoop);
            return;
        }

        // compute normalized position from audio playback
        const t = Math.min(Math.max(song.currentTime, 0), songDuration);
        const proportion = songDuration ? (t / songDuration) : 0;

        // recompute bounds each frame in case layout changed
        const [minCenterY, maxCenterY] = (() => {
            const minC = window.innerHeight / 2;
            const maxC = document.body.scrollHeight - (window.innerHeight / 2);
            return [minC, maxC];
        })();

        const targetCenterY = minCenterY + proportion * (maxCenterY - minCenterY);
        const targetScrollTop = Math.max(0, targetCenterY - window.innerHeight / 2);

        // jump to the computed scroll position
        window.scrollTo({ top: targetScrollTop, behavior: 'auto' });

        last = now;
        autoRafId = requestAnimationFrame(rafLoop);
    }

    // make sure audio is playing when auto-scrolling
    // (play may be blocked until user interacts; handle failures silently)
    song.play().catch(() => { /* autoplay blocked */ });

    autoRafId = requestAnimationFrame(rafLoop);
}

function stopAutoScroll() {
    if (autoRafId) {
        cancelAnimationFrame(autoRafId);
        autoRafId = null;
    }
}

// --- User Interaction ------------------------------------------------------

function switchToManual() {
    stopAutoScroll();
    try { song.pause(); } catch (e) {}
    setState("manual");
}

window.addEventListener("wheel", switchToManual);
window.addEventListener("touchstart", switchToManual, { passive: true });

// --- Idle → Auto -----------------------------------------------------------

let scrollIdleTimer = null;
const SCROLL_IDLE_MS = 200;

window.addEventListener("scroll", () => {
    clearTimeout(scrollIdleTimer);

    scrollIdleTimer = setTimeout(() => {
        // compute normalized centerY using getValues()
        const [minCenterY, maxCenterY, currentCenterY] = getValues();
        const proportion = (currentCenterY - minCenterY) / (maxCenterY - minCenterY);
        const clamped = Math.min(1, Math.max(0, proportion || 0));

        // set audio position to match where the user left the page
        if (songDuration && songDuration > 0) {
            song.currentTime = clamped * songDuration;
        }

        // switch back to auto and start RAF-driven sync
        setState("auto");
        // ensure audio is playing when returning to auto
        song.play().catch(() => { /* ignore autoplay block */ });
        currentState.execute(); // startAutoScroll will kick in
    }, SCROLL_IDLE_MS);
}, { passive: true });

// --- Initial Start ---------------------------------------------------------

currentState.execute();

if (songDuration > 0) {
    currentState.execute();
} else {
    song.addEventListener('loadedmetadata', () => currentState.execute(), { once: true });
}