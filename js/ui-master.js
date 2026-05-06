// master track specific UI

///////////////////////// Master Effects \\\\\\\\\\\\\\\\\\\\\\\\\\
const masterParams = [
    {key: "dirt", id: "dirt", display: "Dirt", update: updateDirtUI, set: setMasterDirt},
    {key: "dirtMix", id: "dirtMix", display: "Dirt Mix", update: updateDirtMixUI, set: setMasterDirtMix},
    {key: "space", id: "space", display: "Space", update: updateSpaceUI, set: setMasterSpace},
    {key: "predelay", id: "predelay", display: "Predelay", update: updatePredelayUI, set: setMasterPredelay},
    {key: "revWidth", id: "revWidth", display: "Reverb Width", update: updateReverbWidthUI, set: setMasterReverbWidth},
    {key: "eqLow", id: "eqLow", display: "EQ Low", update: updateEqLowUI, set: setMasterEqLow},
    {key: "eqMid", id: "eqMid", display: "EQ Mid", update: updateEqMidUI, set: setMasterEqMid},
    {key: "eqHigh", id: "eqHigh", display: "EQ High", update: updateEqHighUI, set: setMasterEqHigh},
    {key: "compThresh", id: "compThresh", display: "Compressor Threshold", update: updateCompThreshUI, set: setMasterCompThresh},
    {key: "compRatio", id: "compRatio", display: "Compressor Ratio", update: updateCompRatioUI, set: setMasterCompRatio},
    {key: "compAttack", id: "compAttack", display: "Compressor Attack", update: updateCompAttackUI, set: setMasterCompAttack},
    {key: "compRelease", id: "compRelease", display: "Compressor Release", update: updateCompReleaseUI, set: setMasterCompRelease},
    {key: "compKnee", id: "compKnee", display: "Compressor Knee", update: updateCompKneeUI, set: setMasterCompKnee},
    {key: "satDrive", id: "satDrive", display: "Saturator Drive", update: updateSatDriveUI, set: setMasterSatDrive},
    {key: "satTone", id: "satTone", display: "Saturator Tone", update: updateSatToneUI, set: setMasterSatTone},
    {key: "satMix", id: "satMix", display: "Saturator Mix", update: updateSatMixUI, set: setMasterSatMix},
]

function initMasterParams() {
    masterParams.forEach(param => {
        let currentParam = document.getElementById(param.id);
        currentParam.addEventListener("input", function() {
            const val = parseFloat(this.value);
            currentData.master[param.key] = val;

            param.update(val);
            param.set(val);

            markAsChanged();
        })
    })
}

// reverb
function updateDirtUI(val) {
    const dirt = document.getElementById("dirt");
    const dirtDisplay = document.getElementById("dirtDisplay");

    // format the value so it displays 0-100
    dirt.value = val;
    dirtDisplay.innerHTML = parseInt(val);
}

function updateDirtMixUI(val) {
    const dirt = document.getElementById("dirtMix");
    const dirtDisplay = document.getElementById("dirtMixDisplay");

    // format the value so it displays 0-100
    dirt.value = val;
    dirtDisplay.innerHTML = parseInt(val * 100);
}

function updateSpaceUI(val) {
    const space = document.getElementById("space");
    const spaceDisplay = document.getElementById("spaceDisplay");

    // format the value so it displays 0-100
    space.value = val;
    spaceDisplay.innerHTML = parseInt(val * 10);
}

function updatePredelayUI(val) {
    const predelay = document.getElementById("predelay");
    const predelayDisplay = document.getElementById("predelayDisplay");

    // format the value so it displays 0-100
    predelay.value = val;
    predelayDisplay.innerHTML = parseInt(val * 100);
}

function updateReverbWidthUI(val) {
    const revWidth = document.getElementById("revWidth");
    const revWidthDisplay = document.getElementById("revWidthDisplay");

    // format the value so it displays 0-100
    revWidth.value = val;
    revWidthDisplay.innerHTML = parseInt(val * 100);
}

// eq
function updateEqLowUI(val) {
    const eqLow = document.getElementById("eqLow");
    const eqLowDisplay = document.getElementById("eqLowDisplay");

    eqLow.value = val;
    eqLowDisplay.innerHTML = parseInt(val) + "db";
}

function updateEqMidUI(val) {
    const eqMid = document.getElementById("eqMid");
    const eqMidDisplay = document.getElementById("eqMidDisplay");

    eqMid.value = val;
    eqMidDisplay.innerHTML = parseInt(val) + "db";
}

function updateEqHighUI(val) {
    const eqHigh = document.getElementById("eqHigh");
    const eqHighDisplay = document.getElementById("eqHighDisplay");

    eqHigh.value = val;
    eqHighDisplay.innerHTML = parseInt(val) + "db";
}

// compressor
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

function updateCompAttackUI(val) {
    const compAttack = document.getElementById("compAttack");
    const compAttackDisplay = document.getElementById("compAttackDisplay");

    compAttack.value = val;
    compAttackDisplay.innerHTML = parseInt(val * 100);
}

function updateCompReleaseUI(val) {
    const compRelease = document.getElementById("compRelease");
    const compReleaseDisplay = document.getElementById("compReleaseDisplay");

    compRelease.value = val;
    compReleaseDisplay.innerHTML = parseInt(val * 100);
}

function updateCompKneeUI(val) {
    const compKnee = document.getElementById("compKnee");
    const compKneeDisplay = document.getElementById("compKneeDisplay");

    compKnee.value = val;
    compKneeDisplay.innerHTML = parseInt(val);
}

//saturator
function updateSatDriveUI(val) {
    const satDrive = document.getElementById("satDrive");
    const satDriveDisplay = document.getElementById("satDriveDisplay");

    // format the value so it displays 0-100
    satDrive.value = val;
    satDriveDisplay.innerHTML = parseInt(val * 200);
}

function updateSatToneUI(val) {
    const satTone = document.getElementById("satTone");
    const satToneDisplay = document.getElementById("satToneDisplay");

    // format the value so it displays 0-100
    satTone.value = val;
    satToneDisplay.innerHTML = parseInt(val * 0.005);
}

function updateSatMixUI(val) {
    const satMix = document.getElementById("satMix");
    const satMixDisplay = document.getElementById("satMixDisplay");

    // format the value so it displays 0-100
    satMix.value = val;
    satMixDisplay.innerHTML = parseInt(val * 100);
}