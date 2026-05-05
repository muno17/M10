// track specific UI

///////////////////////// Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
// listeners for all track parameters
// update changes if any parameter is changed

const trackParams = [
    {key: "volume", id: "volume", display: "Volume", update: updateVolumeUI, set: setTrackVolume},
    {key: "pan", id: "pan", display: "Pan", update: updatePanUI, set: setTrackPan},
    {key: "pitch", id: "pitch", display: "Pitch", update: updatePitchUI, set: setTrackPitch},
    {key: "start", id: "start", display: "Start", update: updateStartUI, set: setTrackStart},
    {key: "attack", id: "attack", display: "Attack", update: updateAttackUI, set: setTrackAttack},
    {key: "decay", id: "decay", display: "Decay", update: updateDecayUI, set: setTrackDecay},
    {key: "sustain", id: "sustain", display: "Sustain", update: updateSustainUI, set: setTrackSustain},
    {key: "release", id: "release", display: "Release", update: updateReleaseUI, set: setTrackRelease},
    {key: "lpWidth", id: "lpWidth", display: "LP Width", update: updateLpWidthUI, set: setTrackLpWidth},
    {key: "lpq", id: "lpq", display: "LP Q", update: updateLpQUI, set: setTrackLpQ},
    {key: "hpWidth", id: "hpWidth", display: "HP Width", update: updateHpWidthUI, set: setTrackHpWidth},
    {key: "hpq", id: "hpq", display: "HP Q", update: updateHpQUI, set: setTrackHpQ},
    {key: "distortion", id: "distortion", display: "Distortion", update: updateDistortionUI, set: setTrackDistortion},
    {key: "bitcrusher", id: "bitcrusher", display: "Bitcrusher", update: updateBitcrusherUI, set: setTrackBitcrusher},
    {key: "chorusRate", id: "chorusRate", display: "Chorus Rate", update: updateChorusRateUI, set: setTrackChorusRate},
    {key: "chorusDepth", id: "chorusDepth", display: "Chorus Depth", update: updateChorusDepthUI, set: setTrackChorusDepth},
    {key: "chorusMix", id: "chorusMix", display: "Chorus Mix", update: updateChorusMixUI, set: setTrackChorusMix},
    {key: "tremRate", id: "tremRate", display: "Tremolo Rate", update: updateTremoloRateUI, set: setTrackTremoloRate},
    {key: "tremDepth", id: "tremDepth", display: "Tremolo Depth", update: updateTremoloDepthUI, set: setTrackTremoloDepth},
    {key: "tremMix", id: "tremMix", display: "Tremolo Mix", update: updateTremoloMixUI, set: setTrackTremoloMix},
    {key: "delTime", id: "delTime", display: "Delay Time", update: updateDelayTimeUI, set: setTrackDelayTime},
    {key: "delFback", id: "delFback", display: "Delay Feedback", update: updateDelayFeedbackUI, set: setTrackDelayFeedback},
    {key: "delMix", id: "delMix", display: "Delay Mix", update: updateDelayMixUI, set: setTrackDelayMix},
    {key: "reverb", id: "reverb", display: "Reverb", update: updateReverbSendUI, set: setTrackReverbSend},
]

function initTrackParams() {
    trackParams.forEach(param => {
        console.log(param);
        let currentParam = document.getElementById(param.id);
        currentParam.addEventListener("input", function() {
            const val = parseFloat(this.value);
            currentData.tracks[currentTrack][param.key] = val;

            currentParam.update(val);
            currentParam.set(val);

            markAsChanged();
        })
    })
}

function updateVolumeUI(val) {
    const volume = document.getElementById("volume");
    const volumeDisplay = document.getElementById("volumeDisplay");

    volume.value = val;
    volumeDisplay.innerHTML = val + "dB";
}


function updatePanUI(val) {
    const pan = document.getElementById("pan");
    const panDisplay = document.getElementById("panDisplay");

    // format the value so it displays 0-100
    pan.value = val;
    panDisplay.innerHTML = parseInt(val * 50);
}


function updatePitchUI(val) {
    const pitch = document.getElementById("pitch");
    const pitchDisplay = document.getElementById("pitchDisplay");

    // format the value so it displays from -12 to +12 in .1 increments
    const num = parseFloat(val);
    const formattedVal = num.toFixed(1);
    var sign = "";
    if (num > 0) {
        sign = "+";
    }

    pitch.value = val;
    pitchDisplay.innerHTML = sign + formattedVal;
}

function updateStartUI(val) {
    const start = document.getElementById("start");
    const startDisplay = document.getElementById("startDisplay");

    // format the value so it displays 0-100
    start.value = val;
    startDisplay.innerHTML = parseInt(val * 100);
}

function updateAttackUI(val) {
    const attack = document.getElementById("attack");
    const attackDisplay = document.getElementById("attackDisplay");

    // format the value so it displays 0-100
    attack.value = val;
    attackDisplay.innerHTML = parseInt(val * 50);
}

function updateDecayUI(val) {
    const decay = document.getElementById("decay");
    const decayDisplay = document.getElementById("decayDisplay");

    // format the value so it displays 0-100
    decay.value = val;
    decayDisplay.innerHTML = parseInt(val * 50);
}


function updateSustainUI(val) {
    const sustain = document.getElementById("sustain");
    const sustainDisplay = document.getElementById("sustainDisplay");

    // format the value so it displays 0-100
    sustain.value = val;
    sustainDisplay.innerHTML = parseInt(val * 100);
}

function updateReleaseUI(val) {
    const release = document.getElementById("release");
    const releaseDisplay = document.getElementById("releaseDisplay");

    // format the value so it displays 0-100
    release.value = val;
    releaseDisplay.innerHTML = parseInt(val * 20);
}

function updateLpWidthUI(val) {
    const lp = document.getElementById("lpWidth");
    const lpWidthDisplay = document.getElementById("lpWidthDisplay");

    lp.value = val;

    if (val >= 1000) {
        lpWidthDisplay.innerHTML = (val / 1000).toFixed(1) + "kHz";
    } else {
        lpWidthDisplay.innerHTML = Math.round(val) + "Hz";
    }
}

function updateLpQUI(val) {
    const q = document.getElementById("lpq");
    const qWidthDisplay = document.getElementById("lpqDisplay");

    // format the value so it displays 0-100
    q.value = val;
    qWidthDisplay.innerHTML = parseInt(val * 5);
}

function updateHpWidthUI(val) {
    const hp = document.getElementById("hpWidth");
    const hpWidthDisplay = document.getElementById("hpWidthDisplay");

    hp.value = val;

    if (val >= 1000) {
        hpWidthDisplay.innerHTML = (val / 1000).toFixed(1) + "kHz";
    } else {
        hpWidthDisplay.innerHTML = Math.round(val) + "Hz";
    }
}

function updateHpQUI(val) {
    const q = document.getElementById("hpq");
    const qWidthDisplay = document.getElementById("hpqDisplay");

    // format the value so it displays 0-100
    q.value = val;
    qWidthDisplay.innerHTML = parseInt(val * 5);
}

///////////////////////// Track Effects \\\\\\\\\\\\\\\\\\\\\\\\\\
function updateDistortionUI(val) {
    const distortion = document.getElementById("distortion");
    const distortionDisplay = document.getElementById("distortionDisplay");

    // format the value so it displays 0-100
    distortion.value = val;
    distortionDisplay.innerHTML = parseInt(val * 100);
}

function updateBitcrusherUI(val) {
    const bitcrusher = document.getElementById("bitcrusher");
    const bitcrusherDisplay = document.getElementById("bitcrusherDisplay");

    // format the value so it displays 0-100
    bitcrusher.value = val;
    bitcrusherDisplay.innerHTML = parseInt(val * 100);
}

function updateChorusRateUI(val) {
    const rate = document.getElementById("chorusRate");
    const rateDisplay = document.getElementById("chorusRateDisplay");

    // format the value so it displays 0-100
    rate.value = val;
    rateDisplay.innerHTML = parseInt(val * 20);
}

function updateChorusDepthUI(val) {
    const depth = document.getElementById("chorusDepth");
    const depthDisplay = document.getElementById("chorusDepthDisplay");

    // format the value so it displays 0-100
    depth.value = val;
    depthDisplay.innerHTML = parseInt(val * 100);
}

function updateChorusMixUI(val) {
    const mix = document.getElementById("chorusMix");
    const mixDisplay = document.getElementById("chorusMixDisplay");

    // format the value so it displays 0-100
    mix.value = val;
    mixDisplay.innerHTML = parseInt(val * 100);
}

function updateTremoloRateUI(val) {
    const rate = document.getElementById("tremRate");
    const rateDisplay = document.getElementById("tremRateDisplay");

    // format the value so it displays 0-100
    rate.value = val;
    rateDisplay.innerHTML = parseInt(val * 5);
}

function updateTremoloDepthUI(val) {
    const depth = document.getElementById("tremDepth");
    const depthDisplay = document.getElementById("tremDepthDisplay");

    // format the value so it displays 0-100
    depth.value = val;
    depthDisplay.innerHTML = parseInt(val * 100);
}

function updateTremoloMixUI(val) {
    const mix = document.getElementById("tremMix");
    const mixDisplay = document.getElementById("tremMixDisplay");

    // format the value so it displays 0-100
    mix.value = val;
    mixDisplay.innerHTML = parseInt(val * 100);
}

function updateDelayTimeUI(val) {
    const time = document.getElementById("delTime");
    const timeDisplay = document.getElementById("delTimeDisplay");

    // format the value so it displays 0-100
    time.value = val;
    timeDisplay.innerHTML = parseInt(val * 100);
}

function updateDelayFeedbackUI(val) {
    const feedback = document.getElementById("delFback");
    const feedbackDisplay = document.getElementById("delFbackDisplay");

    // format the value so it displays 0-100
    feedback.value = val;
    feedbackDisplay.innerHTML = parseInt(val * 111.11);
}

function updateDelayMixUI(val) {
    const mix = document.getElementById("delMix");
    const mixDisplay = document.getElementById("delMixDisplay");

    // format the value so it displays 0-100
    mix.value = val;
    mixDisplay.innerHTML = parseInt(val * 100);
}

function updateReverbSendUI(val) {
    const send = document.getElementById("reverb");
    const sendDisplay = document.getElementById("reverbDisplay");

    // format the value so it displays 0-100
    send.value = val;
    sendDisplay.innerHTML = parseInt(val * 100);
}