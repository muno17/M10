// track specific UI

///////////////////////// Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
// listeners for all track parameters
// update changes if any parameter is changed

function initTrackParams() {
    initVol();
    initPan();
    initPitch();
    initStart();
    initAttack();
    initDecay();
    initSustain();
    initRelease();
    initLpWidth();
    initLpQ();
    initHpWidth();
    initHpQ();

    // effects
    initDistortion();
    initBitcrusher();
    initChorusRate();
    initChorusDepth();
    initChorusMix();
    initTremoloRate();
    initTremoloDepth();
    initTremoloMix();
    initDelayTime();
    initDelayFeedback();
    initDelayMix();
    initReverbSend();
}

function initVol() {
    const volume = document.getElementById("volume");

    volume.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].volume = val;

        updateVolumeUI(val);
        setTrackVolume(val);

        markAsChanged();
    });
}

function updateVolumeUI(val) {
    const volume = document.getElementById("volume");
    const volumeDisplay = document.getElementById("volumeDisplay");

    volume.value = val;
    volumeDisplay.innerHTML = val + "dB";
}

function initPan() {
    const pan = document.getElementById("pan");

    pan.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].pan = val;

        updatePanUI(val);
        setTrackPan(val);

        markAsChanged();
    });
}

function updatePanUI(val) {
    const pan = document.getElementById("pan");
    const panDisplay = document.getElementById("panDisplay");

    // format the value so it displays 0-100
    pan.value = val;
    panDisplay.innerHTML = parseInt(val * 50);
}

function initPitch() {
    const pitch = document.getElementById("pitch");

    pitch.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].pitch = val;

        updatePitchUI(val);
        setTrackPitch(val);

        markAsChanged();
    });
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

function initStart() {
    const start = document.getElementById("start");

    start.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].start = val;

        updateStartUI(val);
        setTrackStart(val);

        markAsChanged();
    });
}

function updateStartUI(val) {
    const start = document.getElementById("start");
    const startDisplay = document.getElementById("startDisplay");

    // format the value so it displays 0-100
    start.value = val;
    startDisplay.innerHTML = parseInt(val * 100);
}

function initAttack() {
    const attack = document.getElementById("attack");

    attack.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].attack = val;

        updateAttackUI(val);
        setTrackAttack(val);

        markAsChanged();
    });
}

function updateAttackUI(val) {
    const attack = document.getElementById("attack");
    const attackDisplay = document.getElementById("attackDisplay");

    // format the value so it displays 0-100
    attack.value = val;
    attackDisplay.innerHTML = parseInt(val * 50);
}

function initDecay() {
    const decay = document.getElementById("decay");

    decay.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].decay = val;

        updateDecayUI(val);
        setTrackDecay(val);

        markAsChanged();
    });
}

function updateDecayUI(val) {
    const decay = document.getElementById("decay");
    const decayDisplay = document.getElementById("decayDisplay");

    // format the value so it displays 0-100
    decay.value = val;
    decayDisplay.innerHTML = parseInt(val * 50);
}

function initSustain() {
    const sustain = document.getElementById("sustain");

    sustain.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].sustain = val;

        updateSustainUI(val);
        setTrackSustain(val);

        markAsChanged();
    });
}

function updateSustainUI(val) {
    const sustain = document.getElementById("sustain");
    const sustainDisplay = document.getElementById("sustainDisplay");

    // format the value so it displays 0-100
    sustain.value = val;
    sustainDisplay.innerHTML = parseInt(val * 100);
}

function initRelease() {
    const release = document.getElementById("release");

    release.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].release = val;

        updateReleaseUI(val);
        setTrackRelease(val);

        markAsChanged();
    });
}

function updateReleaseUI(val) {
    const release = document.getElementById("release");
    const releaseDisplay = document.getElementById("releaseDisplay");

    // format the value so it displays 0-100
    release.value = val;
    releaseDisplay.innerHTML = parseInt(val * 20);
}

function initLpWidth() {
    const lp = document.getElementById("lpWidth");

    lp.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].lpWidth = val;

        updateLpWidthUI(val);
        setTrackLpWidth(val);

        markAsChanged();
    });
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

function initLpQ() {
    const q = document.getElementById("lpq");

    q.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].lpq = val;

        updateLpQUI(val);
        setTrackLpQ(val);

        markAsChanged();
    });
}

function updateLpQUI(val) {
    const q = document.getElementById("lpq");
    const qWidthDisplay = document.getElementById("lpqDisplay");

    // format the value so it displays 0-100
    q.value = val;
    qWidthDisplay.innerHTML = parseInt(val * 5);
}

function initHpWidth() {
    const hp = document.getElementById("hpWidth");

    hp.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].hpWidth = val;

        updateHpWidthUI(val);
        setTrackHpWidth(val);

        markAsChanged();
    });
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

function initHpQ() {
    const q = document.getElementById("hpq");

    q.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].hpq = val;

        updateHpQUI(val);
        setTrackHpQ(val);

        markAsChanged();
    });
}

function updateHpQUI(val) {
    const q = document.getElementById("hpq");
    const qWidthDisplay = document.getElementById("hpqDisplay");

    // format the value so it displays 0-100
    q.value = val;
    qWidthDisplay.innerHTML = parseInt(val * 5);
}

///////////////////////// Track Effects \\\\\\\\\\\\\\\\\\\\\\\\\\
function initDistortion() {
    const distortion = document.getElementById("distortion");

    distortion.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].distortion = val;

        updateDistortionUI(val);
        setTrackDistortion(val);

        markAsChanged();
    });
}

function updateDistortionUI(val) {
    const distortion = document.getElementById("distortion");
    const distortionDisplay = document.getElementById("distortionDisplay");

    // format the value so it displays 0-100
    distortion.value = val;
    distortionDisplay.innerHTML = parseInt(val * 100);
}

function initBitcrusher() {
    const bc = document.getElementById("bc");

    bc.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].bitcrusher = val;

        updateBitcrusherUI(val);
        setTrackBitcrusher(val);

        markAsChanged();
    });
}

function updateBitcrusherUI(val) {
    const bc = document.getElementById("bc");
    const bcDisplay = document.getElementById("bcDisplay");

    // format the value so it displays 0-100
    bc.value = val;
    bcDisplay.innerHTML = parseInt(val * 100);
}

function initChorusRate() {
    const rate = document.getElementById("chorusRate");

    rate.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].chorusRate = val;

        updateChorusRateUI(val);
        setTrackChorusRate(val);

        markAsChanged();
    });
}

function updateChorusRateUI(val) {
    const rate = document.getElementById("chorusRate");
    const rateDisplay = document.getElementById("chorusRateDisplay");

    // format the value so it displays 0-100
    rate.value = val;
    rateDisplay.innerHTML = parseInt(val * 20);
}

function initChorusDepth() {
    const depth = document.getElementById("chorusDepth");

    depth.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].chorusDepth = val;

        updateChorusDepthUI(val);
        setTrackChorusDepth(val);

        markAsChanged();
    });
}

function updateChorusDepthUI(val) {
    const depth = document.getElementById("chorusDepth");
    const depthDisplay = document.getElementById("chorusDepthDisplay");

    // format the value so it displays 0-100
    depth.value = val;
    depthDisplay.innerHTML = parseInt(val * 100);
}

function initChorusMix() {
    const mix = document.getElementById("chorusMix");

    mix.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].chorusMix = val;

        updateChorusMixUI(val);
        setTrackChorusMix(val);

        markAsChanged();
    });
}

function updateChorusMixUI(val) {
    const mix = document.getElementById("chorusMix");
    const mixDisplay = document.getElementById("chorusMixDisplay");

    // format the value so it displays 0-100
    mix.value = val;
    mixDisplay.innerHTML = parseInt(val * 100);
}

function initTremoloRate() {
    const rate = document.getElementById("tremRate");

    rate.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].tremRate = val;

        updateTremoloRateUI(val);
        setTrackTremoloRate(val);

        markAsChanged();
    });
}

function updateTremoloRateUI(val) {
    const rate = document.getElementById("tremRate");
    const rateDisplay = document.getElementById("tremRateDisplay");

    // format the value so it displays 0-100
    rate.value = val;
    rateDisplay.innerHTML = parseInt(val * 5);
}

function initTremoloDepth() {
    const depth = document.getElementById("tremDepth");

    depth.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].tremDepth = val;

        updateTremoloDepthUI(val);
        setTrackTremoloDepth(val);

        markAsChanged();
    });
}

function updateTremoloDepthUI(val) {
    const depth = document.getElementById("tremDepth");
    const depthDisplay = document.getElementById("tremDepthDisplay");

    // format the value so it displays 0-100
    depth.value = val;
    depthDisplay.innerHTML = parseInt(val * 100);
}

function initTremoloMix() {
    const mix = document.getElementById("tremMix");

    mix.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].tremMix = val;

        updateTremoloMixUI(val);
        setTrackTremoloMix(val);

        markAsChanged();
    });
}

function updateTremoloMixUI(val) {
    const mix = document.getElementById("tremMix");
    const mixDisplay = document.getElementById("tremMixDisplay");

    // format the value so it displays 0-100
    mix.value = val;
    mixDisplay.innerHTML = parseInt(val * 100);
}

function initDelayTime() {
    const time = document.getElementById("delTime");

    time.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].delTime = val;

        updateDelayTimeUI(val);
        setTrackDelayTime(val);

        markAsChanged();
    });
}

function updateDelayTimeUI(val) {
    const time = document.getElementById("delTime");
    const timeDisplay = document.getElementById("delTimeDisplay");

    // format the value so it displays 0-100
    time.value = val;
    timeDisplay.innerHTML = parseInt(val * 100);
}

function initDelayFeedback() {
    const feedback = document.getElementById("delFback");

    feedback.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].delFback = val;

        updateDelayFeedbackUI(val);
        setTrackDelayFeedback(val);

        markAsChanged();
    });
}

function updateDelayFeedbackUI(val) {
    const feedback = document.getElementById("delFback");
    const feedbackDisplay = document.getElementById("delFbackDisplay");

    // format the value so it displays 0-100
    feedback.value = val;
    feedbackDisplay.innerHTML = parseInt(val * 111.11);
}

function initDelayMix() {
    const mix = document.getElementById("delMix");

    mix.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].delMix = val;

        updateDelayMixUI(val);
        setTrackDelayMix(val);

        markAsChanged();
    });
}

function updateDelayMixUI(val) {
    const mix = document.getElementById("delMix");
    const mixDisplay = document.getElementById("delMixDisplay");

    // format the value so it displays 0-100
    mix.value = val;
    mixDisplay.innerHTML = parseInt(val * 100);
}

function initReverbSend() {
    const send = document.getElementById("revSend");

    send.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].reverb = val;

        updateReverbSendUI(val);
        setTrackReverbSend(val);

        markAsChanged();
    });
}

function updateReverbSendUI(val) {
    const send = document.getElementById("revSend");
    const sendDisplay = document.getElementById("revSendDisplay");

    // format the value so it displays 0-100
    send.value = val;
    sendDisplay.innerHTML = parseInt(val * 100);
}