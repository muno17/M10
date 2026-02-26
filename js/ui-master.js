// master track specific UI

///////////////////////// Master Effects \\\\\\\\\\\\\\\\\\\\\\\\\\
function initMasterParams() {
    // reverb
    initDirt();
    initDirtMix();
    initSpace();
    initPredelay();
    initReverbWidth();
    initReverbLimit();

    // eq
    initEqLow();
    initEqMid();
    initEqHigh();

    // compressor
    initCompThresh();
    initCompRatio();
    initCompAttack();
    initCompRelease();
    initCompKnee();

    // saturator
    initSatDrive();
    initSatTone();
    initSatMix();

    // limiter
    initLimitThresh();
}

// reverb
function initDirt() {
    const dirt = document.getElementById("dirt");

    dirt.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.dirt = val;

        updateDirtUI(val);
        setMasterDirt(val);

        markAsChanged();
    });
}

function updateDirtUI(val) {
    const dirt = document.getElementById("dirt");
    const dirtDisplay = document.getElementById("dirtDisplay");

    // format the value so it displays 0-100
    dirt.value = val;
    dirtDisplay.innerHTML = parseInt(val);
}

function initDirtMix() {
    const dirt = document.getElementById("dirtMix");

    dirt.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.dirtMix = val;

        updateDirtMixUI(val);
        setMasterDirtMix(val);

        markAsChanged();
    });
}

function updateDirtMixUI(val) {
    const dirt = document.getElementById("dirtMix");
    const dirtDisplay = document.getElementById("dirtMixDisplay");

    // format the value so it displays 0-100
    dirt.value = val;
    dirtDisplay.innerHTML = parseInt(val * 100);
}

function initSpace() {
    const space = document.getElementById("space");

    space.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.space = val;

        updateSpaceUI(val);
        setMasterSpace(val);

        markAsChanged();
    });
}

function updateSpaceUI(val) {
    const space = document.getElementById("space");
    const spaceDisplay = document.getElementById("spaceDisplay");

    // format the value so it displays 0-100
    space.value = val;
    spaceDisplay.innerHTML = parseInt(val * 10);
}

function initPredelay() {
    const predelay = document.getElementById("predelay");

    predelay.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.predelay = val;

        updatePredelayUI(val);
        setMasterPredelay(val);

        markAsChanged();
    });
}

function updatePredelayUI(val) {
    const predelay = document.getElementById("predelay");
    const predelayDisplay = document.getElementById("predelayDisplay");

    // format the value so it displays 0-100
    predelay.value = val;
    predelayDisplay.innerHTML = parseInt(val * 100);
}

function initReverbWidth() {
    const revWidth = document.getElementById("revWidth");

    revWidth.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.revWidth = val;

        updateReverbWidthUI(val);
        setMasterReverbWidth(val);

        markAsChanged();
    });
}

function updateReverbWidthUI(val) {
    const revWidth = document.getElementById("revWidth");
    const revWidthDisplay = document.getElementById("revWidthDisplay");

    // format the value so it displays 0-100
    revWidth.value = val;
    revWidthDisplay.innerHTML = parseInt(val * 100);
}

function initReverbLimit() {
    const revLimit = document.getElementById("revLimit");

    revLimit.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.revLimit = val;

        updateReverbLimitUI(val);
        setMasterReverbLimit(val);

        markAsChanged();
    });
}

function updateReverbLimitUI(val) {
    const revLimit = document.getElementById("revLimit");
    const revLimitDisplay = document.getElementById("revLimitDisplay");

    revLimit.value = val;
    revLimitDisplay.innerHTML = parseInt(val);
}

// eq
function initEqLow() {
    const eqLow = document.getElementById("eqLow");

    eqLow.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.eqLow = val;

        updateEqLowUI(val);
        setMasterEqLow(val);

        markAsChanged();
    });
}

function updateEqLowUI(val) {
    const eqLow = document.getElementById("eqLow");
    const eqLowDisplay = document.getElementById("eqLowDisplay");

    eqLow.value = val;
    eqLowDisplay.innerHTML = parseInt(val) + "db";
}

function initEqMid() {
    const eqMid = document.getElementById("eqMid");

    eqMid.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.eqMid = val;

        updateEqMidUI(val);
        setMasterEqMid(val);

        markAsChanged();
    });
}

function updateEqMidUI(val) {
    const eqMid = document.getElementById("eqMid");
    const eqMidDisplay = document.getElementById("eqMidDisplay");

    eqMid.value = val;
    eqMidDisplay.innerHTML = parseInt(val) + "db";
}

function initEqHigh() {
    const eqHigh = document.getElementById("eqHigh");

    eqHigh.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.eqHigh = val;

        updateEqHighUI(val);
        setMasterEqHigh(val);

        markAsChanged();
    });
}

function updateEqHighUI(val) {
    const eqHigh = document.getElementById("eqHigh");
    const eqHighDisplay = document.getElementById("eqHighDisplay");

    eqHigh.value = val;
    eqHighDisplay.innerHTML = parseInt(val) + "db";
}

// compressor
function initCompThresh() {
    const compThresh = document.getElementById("compThresh");

    compThresh.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compThresh = val;

        updateCompThreshUI(val);
        setMasterCompThresh(val);

        markAsChanged();
    });
}

function updateCompThreshUI(val) {
    const compThresh = document.getElementById("compThresh");
    const compThreshDisplay = document.getElementById("compThreshDisplay");

    compThresh.value = val;
    compThreshDisplay.innerHTML = parseInt(val) + "db";
}

function initCompRatio() {
    const compRatio = document.getElementById("compRatio");

    compRatio.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compRatio = val;

        updateCompRatioUI(val);
        setMasterCompRatio(val);

        markAsChanged();
    });
}

function updateCompRatioUI(val) {
    const compRatio = document.getElementById("compRatio");
    const compRatioDisplay = document.getElementById("compRatioDisplay");

    compRatio.value = val;
    compRatioDisplay.innerHTML = parseInt(val);
}

function initCompAttack() {
    const compAttack = document.getElementById("compAttack");

    compAttack.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compAttack = val;

        updateCompAttackUI(val);
        setMasterCompAttack(val);

        markAsChanged();
    });
}

function updateCompAttackUI(val) {
    const compAttack = document.getElementById("compAttack");
    const compAttackDisplay = document.getElementById("compAttackDisplay");

    compAttack.value = val;
    compAttackDisplay.innerHTML = parseInt(val * 100);
}

function initCompRelease() {
    const compRelease = document.getElementById("compRelease");

    compRelease.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compRelease = val;

        updateCompReleaseUI(val);
        setMasterCompRelease(val);

        markAsChanged();
    });
}

function updateCompReleaseUI(val) {
    const compRelease = document.getElementById("compRelease");
    const compReleaseDisplay = document.getElementById("compReleaseDisplay");

    compRelease.value = val;
    compReleaseDisplay.innerHTML = parseInt(val * 100);
}

function initCompKnee() {
    const compKnee = document.getElementById("compKnee");

    compKnee.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compKnee = val;

        updateCompKneeUI(val);
        setMasterCompKnee(val);

        markAsChanged();
    });
}

function updateCompKneeUI(val) {
    const compKnee = document.getElementById("compKnee");
    const compKneeDisplay = document.getElementById("compKneeDisplay");

    compKnee.value = val;
    compKneeDisplay.innerHTML = parseInt(val);
}

//saturator
function initSatDrive() {
    const satDrive = document.getElementById("satDrive");

    satDrive.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.satDrive = val;

        updateSatDriveUI(val);
        setMasterSatDrive(val);

        markAsChanged();
    });
}

function updateSatDriveUI(val) {
    const satDrive = document.getElementById("satDrive");
    const satDriveDisplay = document.getElementById("satDriveDisplay");

    // format the value so it displays 0-100
    satDrive.value = val;
    satDriveDisplay.innerHTML = parseInt(val * 200);
}

function initSatTone() {
    const satTone = document.getElementById("satTone");

    satTone.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.satTone = val;

        updateSatToneUI(val);
        setMasterSatTone(val);

        markAsChanged();
    });
}

function updateSatToneUI(val) {
    const satTone = document.getElementById("satTone");
    const satToneDisplay = document.getElementById("satToneDisplay");

    // format the value so it displays 0-100
    satTone.value = val;
    satToneDisplay.innerHTML = parseInt(val * 0.005);
}

function initSatMix() {
    const satMix = document.getElementById("satMix");

    satMix.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.satMix = val;

        updateSatMixUI(val);
        setMasterSatMix(val);

        markAsChanged();
    });
}

function updateSatMixUI(val) {
    const satMix = document.getElementById("satMix");
    const satMixDisplay = document.getElementById("satMixDisplay");

    // format the value so it displays 0-100
    satMix.value = val;
    satMixDisplay.innerHTML = parseInt(val * 100);
}

//limiter
function initLimitThresh() {
    const limitThresh = document.getElementById("limitThresh");

    limitThresh.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.limitThresh = val;

        updateLimitThreshUI(val);
        setMasterLimitThresh(val);

        markAsChanged();
    });
}

function updateLimitThreshUI(val) {
    const limitThresh = document.getElementById("limitThresh");
    const limitThreshDisplay = document.getElementById("limitThreshDisplay");

    limitThresh.value = val;
    limitThreshDisplay.innerHTML = parseInt(val);
}