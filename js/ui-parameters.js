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
    {key: "dirt", display: (v) => intDisplay(v, 1), set: setMasterDirt},
    {key: "dirtMix", display: (v) => intDisplay(v, 100), set: setMasterDirtMix},
    {key: "space", display: (v) => intDisplay(v, 10), set: setMasterSpace},
    {key: "predelay", display: (v) => intDisplay(v, 100), set: setMasterPredelay},
    {key: "revWidth", display: (v) => intDisplay(v, 100), set: setMasterReverbWidth},
    {key: "eqLow", display: dbDisplay, set: setMasterEqLow},
    {key: "eqMid", display: dbDisplay, set: setMasterEqMid},
    {key: "eqHigh", display: dbDisplay, set: setMasterEqHigh},
    {key: "compThresh", display: dbDisplay, set: setMasterCompThresh},
    {key: "compRatio", display: (v) => intDisplay(v, 1), set: setMasterCompRatio},
    {key: "compAttack", display: (v) => intDisplay(v, 100), set: setMasterCompAttack},
    {key: "compRelease", display: (v) => intDisplay(v, 100), set: setMasterCompRelease},
    {key: "compKnee", display: (v) => intDisplay(v, 1), set: setMasterCompKnee},
    {key: "satDrive", display: (v) => intDisplay(v, 200), set: setMasterSatDrive},
    {key: "satTone", display: (v) => intDisplay(v, 0.005), set: setMasterSatTone},
    {key: "satMix", display: (v) => intDisplay(v, 100), set: setMasterSatMix},
];

///////////////////////// Global Master Controls \\\\\\\\\\\\\\\\\\\\\\\\\\
const globalMasterControls = [
    {key: "tempo", display: (v) => intDisplay(v, 1), set: setTempo},
    {key: "masterVolume", display: dbDisplay, set: setMasterVol},
    {key: "swing", display: (v) => intDisplay(v, 100), set: setSwing},
];

function initTrackParams() {
    trackParams.forEach(param => {
        let currentParam = document.getElementById(param.key);
        currentParam.addEventListener("input", function() {
            const val = parseFloat(this.value);
            currentData.tracks[currentTrack][param.key] = val;

            updateParamUI(val, param.key, param.display(val));
            param.set(val);

            markAsChanged();
        });
    });
}

function initMasterParams() {
    masterParams.forEach(param => {
        let currentParam = document.getElementById(param.key);
        currentParam.addEventListener("input", function() {
            const val = parseFloat(this.value);
            currentData.master[param.key] = val;

            updateParamUI(val, param.key, param.display(val));
            param.set(val);

            markAsChanged();
        });
    });
}

function initGlobalMasterControls() {
    Tone.Transport.swingSubdivision = "16n";

    globalMasterControls.forEach((param) => {
        const currentParam = document.getElementById(param.key);
        currentParam.addEventListener("input", function () {
            const val = parseFloat(this.value);
            currentData[param.key] = val;

            updateParamUI(val, param.key, param.display(val));
            param.set(val);

            markAsChanged();
        });
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
