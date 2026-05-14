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
    length: "1m",
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

function createDefaultTrack(id) {
    return {
        id: id,
        samplePath: "",
        sampleName: "New Sequence",
        volume: -12,
        muted: false,
        pitch: 0,
        pan: 0,
        start: 0,
        attack: 0,
        decay: 0.01,
        sustain: 1,
        release: 0,
        lpWidth: 5000,
        lpq: 0,
        hpWidth: 1,
        hpq: 0,
        distortion: 0,
        bitcrusher: 0,
        reverb: 0,
        chorusRate: 0,
        chorusDepth: 0,
        chorusMix: 0,
        tremRate: 0,
        tremDepth: 0,
        tremMix: 0,
        delTime: 0,
        delFback: 0,
        delMix: 0,
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
    tracks: [
        ...Array.from({length: 10}, (_, i) => createDefaultTrack(i)),
        { id: 99, steps: createEmptySteps(), },
    ],
    master: createDefaultMaster(),
};

let projectData = JSON.parse(JSON.stringify(initData));
let currentData = JSON.parse(JSON.stringify(initData));
