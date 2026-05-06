// track specific UI

///////////////////////// Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
// listeners for all track parameters
// update changes if any parameter is changed

const trackParams = [
    {key: "volume", display: volumeDisplay, set: setTrackVolume},
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
]

function initTrackParams() {
    trackParams.forEach(param => {
        let currentParam = document.getElementById(param.key);
        currentParam.addEventListener("input", function() {
            const val = parseFloat(this.value);
            currentData.tracks[currentTrack][param.key] = val;

            updateTrackParamUI(val, param.key, param.display(val));
            param.set(val);

            markAsChanged();
        })
    })
}

function updateTrackParamUI(val, key, display) {
    const param = document.getElementById(key);
    const paramDisplay = document.getElementById(key + "Display");

    param.value = val;
    paramDisplay.innerHTML = display;
}

function intDisplay(val, multiplier) {
    return parseInt(val * multiplier);
}

function volumeDisplay(val) {
    return val + "dB";
}

function pitchDisplay(val) {
    const num = parseFloat(val);
    const formattedVal = num.toFixed(1);
    var sign = "";
    if (num > 0) {
        sign = "+";
    }
    return sign + formattedVal;
}

function filterWidthDisplay(val) {
    if (val >= 1000) {
        return (val / 1000).toFixed(1) + "kHz";
    } else {
        return Math.round(val) + "Hz";
    }
}
