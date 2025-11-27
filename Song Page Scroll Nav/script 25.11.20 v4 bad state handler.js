const scrollStates={
    auto:{
        status:function(){
            console.log("scrolling automatically")
        },
        execute:function(){
            stateChange("auto")
            window.scrollBy(0,1);
            scrolldelay = setTimeout(() => currentState.execute(), 10);

        }

    },
    manual:{
        status:function(){
            console.log("scrolling manually")
        },
        execute:function(){
        }

    },
    idle:{
        status:function(){
            console.log("not scrolling")
        },
        execute:function(){
        }
    }
}

let stateChangeTracker = [null,null]
function stateChange(state) {
    if(state !== stateChangeTracker[1]) {
        stateChangeTracker.push(state)
        stateChangeTracker.shift()
        console.log(stateChangeTracker)
    }
}

let currentState = scrollStates.auto;
currentState.execute();

let scrollIdleTimer = null;
const SCROLL_IDLE_MS = 200;

function switchToManual(event) {
    currentState = scrollStates.manual;
    stateChange("manual")
};

window.addEventListener("wheel", switchToManual);
window.addEventListener("touchstart", switchToManual, { passive: true });

window.addEventListener('scroll', (e) => {
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(() => {
        currentState = scrollStates.auto;
        currentState.execute();
    }, SCROLL_IDLE_MS);
}, { passive: true });