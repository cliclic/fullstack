let timeRefDelta = 0;

function updateTimeRef (timestamp) {
    timeRefDelta = timestamp - Date.now();
}

function now() {
    return Date.now() + timeRefDelta;
}

export const timeRefService = {
    updateTimeRef,
    now
};
