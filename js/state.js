////////////////////////// Data States \\\\\\\\\\\\\\\\\\\\\\\\\\
// helper: build a fresh array of zeroed steps (default 64 = 4 pages of 16)
function createEmptySteps(length = 64) {
    return Array(length).fill(0);
}

// global params
let globalState = {
    currentTrack: 0,
    currentStep: 0,
    currentPage: 0,
    loopLength: "1m",
    running: false,
    changes: false,
    loggedIn: false,
    openModal: null,
};

// massive JSON objects to contain all information
// currentData is the live object
// projectData is the master object that interacts with the api, contains the last saved state
// initData is an init object with default parameters
// initiate all to copies of initData, api calls update projectData and currentData on page load

function createDefaultTrack() {
    return {
        sample: { path: "", name: "New Sequence" },
        mix: { volume: -12, muted: false, pitch: 0, pan: 0, start: 0 },
        envelope: { attack: 0, decay: 0.01, sustain: 1, release: 0 },
        lowpass: { frequency: 5000, q: 0 },
        highpass: { frequency: 1, q: 0 },
        distortion: { amount: 0 },
        bitcrusher: { mix: 0 },
        chorus: { rate: 0, depth: 0, mix: 0 },
        tremolo: { rate: 0, depth: 0, mix: 0 },
        delay: { time: 0, feedback: 0, mix: 0 },
        reverb: { send: 0 },
        steps: createEmptySteps(),
    }
}

function createDefaultMaster() {
    return {
        dirt: 5,
        dirtMix: 0.1,
        space: 2.0,
        predelay: 0.01,
        revWidth: 0.3,
        eqLow: 0,
        eqMid: 0,
        eqHigh: 0,
        compThresh: -24,
        compRatio: 1,
        compAttack: 0.05,
        compRelease: 0.25,
        compKnee: 30,
        satDrive: 0,
        satTone: 20000,
        satMix: 0,
        limitThresh: -3,
    }
}

let initData = {
    id: null,
    name: "",
    tempo: 120,
    swing: 0,
    masterVolume: -6,
    length: "1m",
    tracks: Array.from({length: 10}, () => createDefaultTrack()),
    master: createDefaultMaster(),
};

let projectData = structuredClone(initData);
let currentData = structuredClone(initData);
