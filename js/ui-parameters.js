// track and master parameter UI
// tracks[currentTrack].setParam(val)
///////////////////////// Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
const trackParams = [
    {key: "volume", display: dbDisplay, set: (val) => tracks[globalState.currentTrack].setVolume(val)},
    {key: "pan", display: (v) => intDisplay(v, 50), set: (val) => tracks[globalState.currentTrack].setPan(val)},
    {key: "pitch", display: pitchDisplay, set: (val) => tracks[globalState.currentTrack].setPitch(val)},
    {key: "start", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setStart(val)},
    {key: "attack", display: (v) => intDisplay(v, 50), set: (val) => tracks[globalState.currentTrack].setAttack(val)},
    {key: "decay", display: (v) => intDisplay(v, 50), set: (val) => tracks[globalState.currentTrack].setDecay(val)},
    {key: "sustain", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setSustain(val)},
    {key: "release", display: (v) => intDisplay(v, 20), set: (val) => tracks[globalState.currentTrack].setRelease(val)},
    {key: "lpWidth", display: filterWidthDisplay, set: (val) => tracks[globalState.currentTrack].setLpWidth(val)},
    {key: "lpq", display: (v) => intDisplay(v, 5), set: (val) => tracks[globalState.currentTrack].setLpQ(val)},
    {key: "hpWidth", display: filterWidthDisplay, set: (val) => tracks[globalState.currentTrack].setHpWidth(val)},
    {key: "hpq", display: (v) => intDisplay(v, 5), set: (val) => tracks[globalState.currentTrack].setHpQ(val)},
    {key: "distortion", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setDistortion(val)},
    {key: "bitcrusher", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setBitcrusher(val)},
    {key: "chorusRate", display: (v) => intDisplay(v, 20), set: (val) => tracks[globalState.currentTrack].setChorusRate(val)},
    {key: "chorusDepth", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setChorusDepth(val)},
    {key: "chorusMix", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setChorusMix(val)},
    {key: "tremRate", display: (v) => intDisplay(v, 5), set: (val) => tracks[globalState.currentTrack].setTremoloRate(val)},
    {key: "tremDepth", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setTremoloDepth(val)},
    {key: "tremMix", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setTremoloMix(val)},
    {key: "delTime", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setDelayTime(val)},
    {key: "delFback", display: (v) => intDisplay(v, 111.11), set: (val) => tracks[globalState.currentTrack].setDelayFeedback(val)},
    {key: "delMix", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setDelayMix(val)},
    {key: "reverb", display: (v) => intDisplay(v, 100), set: (val) => tracks[globalState.currentTrack].setReverbSend(val)},
];

///////////////////////// Master Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
const masterParams = [
    {key: "dirt", display: (v) => intDisplay(v, 1), set: (val) => master.setDirt(val)},
    {key: "dirtMix", display: (v) => intDisplay(v, 100), set: (val) => master.setDirtMix(val)},
    {key: "space", display: (v) => intDisplay(v, 10), set: (val) => master.setSpace(val)},
    {key: "predelay", display: (v) => intDisplay(v, 100), set: (val) => master.setPredelay(val)},
    {key: "revWidth", display: (v) => intDisplay(v, 100), set: (val) => master.setReverbWidth(val)},
    {key: "eqLow", display: dbDisplay, set: (val) => master.setEqLow(val)},
    {key: "eqMid", display: dbDisplay, set: (val) => master.setEqMid(val)},
    {key: "eqHigh", display: dbDisplay, set: (val) => master.setEqHigh(val)},
    {key: "compThresh", display: dbDisplay, set: (val) => master.setCompThresh(val)},
    {key: "compRatio", display: (v) => intDisplay(v, 1), set: (val) => master.setCompRatio(val)},
    {key: "compAttack", display: (v) => intDisplay(v, 100), set: (val) => master.setCompAttack(val)},
    {key: "compRelease", display: (v) => intDisplay(v, 100), set: (val) => master.setCompRelease(val)},
    {key: "compKnee", display: (v) => intDisplay(v, 1), set: (val) => master.setCompKnee(val)},
    {key: "satDrive", display: (v) => intDisplay(v, 200), set: (val) => master.setSatDrive(val)},
    {key: "satTone", display: (v) => intDisplay(v, 0.005), set: (val) => master.setSatTone(val)},
    {key: "satMix", display: (v) => intDisplay(v, 100), set: (val) => master.setSatMix(val)},
];

///////////////////////// Global Master Controls \\\\\\\\\\\\\\\\\\\\\\\\\\
const globalMasterControls = [
    {key: "masterVolume", display: dbDisplay, set: (val) => master.setVolume(val)},
    {key: "tempo", display: (v) => intDisplay(v, 1), set: (val) => Tone.Transport.bpm.value = val},
    {key: "swing", display: (v) => intDisplay(v, 100), set: (val) => Tone.Transport.swing = val},
];

///////////////////////// Parameter Initialization Functions \\\\\\\\\\\\\\\\\\\\\\\\\\

function initParams(params, setState) {
    params.forEach((param) => {
        const currentParam = document.getElementById(param.key);
        currentParam.addEventListener("input", function () {
            const val = parseFloat(this.value);
            setState(val, param);

            updateParamUI(val, param.key, param.display(val));
            param.set(val);

            markAsChanged();
        });
    });
}

function initTrackParams() {
    initParams(trackParams, (val, param) => {
        currentData.tracks[globalState.currentTrack][param.key] = val;
    });
}

function initMasterParams() {
    initParams(masterParams, (val, param) => {
        currentData.master[param.key] = val;
    });
}

function initGlobalMasterParams() {
    initParams(globalMasterControls, (val, param) => {
        currentData[param.key] = val;
    });
}

///////////////////////// UI Rendering Functions \\\\\\\\\\\\\\\\\\\\\\\\\\

function updateGlobalMasterControlUI(param, val) {
    const input = document.getElementById(param.key);
    const display = document.getElementById(param.key + "Display");

    input.value = val;
    display.innerHTML = param.display(val);
}

function updateParamUI(val, key, display) {
    const param = document.getElementById(key);
    const paramDisplay = document.getElementById(key + "Display");

    param.value = val;
    paramDisplay.innerHTML = display;
}

function intDisplay(val, multiplier) {
    return parseInt(val * multiplier);
}

function dbDisplay(val) {
    return parseInt(val) + "db";
}

function pitchDisplay(val) {
    const num = parseFloat(val);
    const formattedVal = num.toFixed(1);
    let sign = "";
    if (num > 0) {
        sign = "+";
    }
    return sign + formattedVal;
}

function filterWidthDisplay(val) {
    if (val >= 1000) {
        return (val / 1000).toFixed(1) + "kHz";
    }
    return Math.round(val) + "Hz";
}
