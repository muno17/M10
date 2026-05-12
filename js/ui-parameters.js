// track and master parameter UI

///////////////////////// Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
const trackParams = [
    {key: "volume", display: dbDisplay, set: setTrackVolume},
    {key: "pan", display: (v) => intDisplay(v, 50), set: setTrackPan},
    {key: "pitch", display: pitchDisplay, set: setTrackPitch},
    {key: "start", display: (v) => intDisplay(v, 100), set: setTrackStart},
    {key: "attack", display: (v) => intDisplay(v, 50), set: setTrackAttack},
    {key: "decay", display: (v) => intDisplay(v, 50), set: setTrackDecay},
    {key: "sustain", display: (v) => intDisplay(v, 100), set: setTrackSustain},
    {key: "release", display: (v) => intDisplay(v, 20), set: setTrackRelease},
    {key: "lpWidth", display: filterWidthDisplay, set: setTrackLpWidth},
    {key: "lpq", display: (v) => intDisplay(v, 5), set: setTrackLpQ},
    {key: "hpWidth", display: filterWidthDisplay, set: setTrackHpWidth},
    {key: "hpq", display: (v) => intDisplay(v, 5), set: setTrackHpQ},
    {key: "distortion", display: (v) => intDisplay(v, 100), set: setTrackDistortion},
    {key: "bitcrusher", display: (v) => intDisplay(v, 100), set: setTrackBitcrusher},
    {key: "chorusRate", display: (v) => intDisplay(v, 20), set: setTrackChorusRate},
    {key: "chorusDepth", display: (v) => intDisplay(v, 100), set: setTrackChorusDepth},
    {key: "chorusMix", display: (v) => intDisplay(v, 100), set: setTrackChorusMix},
    {key: "tremRate", display: (v) => intDisplay(v, 5), set: setTrackTremoloRate},
    {key: "tremDepth", display: (v) => intDisplay(v, 100), set: setTrackTremoloDepth},
    {key: "tremMix", display: (v) => intDisplay(v, 100), set: setTrackTremoloMix},
    {key: "delTime", display: (v) => intDisplay(v, 100), set: setTrackDelayTime},
    {key: "delFback", display: (v) => intDisplay(v, 111.11), set: setTrackDelayFeedback},
    {key: "delMix", display: (v) => intDisplay(v, 100), set: setTrackDelayMix},
    {key: "reverb", display: (v) => intDisplay(v, 100), set: setTrackReverbSend},
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
    {key: "tempo", display: (v) => intDisplay(v, 1), set: setTempo},
    {key: "swing", display: (v) => intDisplay(v, 100), set: setSwing},
];

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
        currentData.tracks[currentTrack][param.key] = val;
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
