import { globalState, currentData } from '../state/state.js';
import { tracks } from '../audio/track.js';
import { master } from '../audio/master.js';
import { markAsChanged } from './sequences.js';

// track and master parameter UI
// tracks[currentTrack].setParam(val)

export function intDisplay(val, multiplier) {
    return parseInt(val * multiplier);
}

export function dbDisplay(val) {
    return parseInt(val) + "db";
}

export function pitchDisplay(val) {
    const num = parseFloat(val);
    const formattedVal = num.toFixed(1);
    let sign = "";
    if (num > 0) {
        sign = "+";
    }
    return sign + formattedVal;
}

export function filterWidthDisplay(val) {
    if (val >= 1000) {
        return (val / 1000).toFixed(1) + "kHz";
    }
    return Math.round(val) + "Hz";
}

///////////////////////// Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
export const trackParams = [
    {key: "volume",     path: ["mix", "volume"],          display: dbDisplay,                    set: (val) => tracks[globalState.currentTrack].setVolume(val)},
    {key: "pan",        path: ["mix", "pan"],             display: (v) => intDisplay(v, 50),     set: (val) => tracks[globalState.currentTrack].setPan(val)},
    {key: "pitch",      path: ["mix", "pitch"],           display: pitchDisplay,                 set: (val) => tracks[globalState.currentTrack].setPitch(val)},
    {key: "start",      path: ["mix", "start"],           display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setStart(val)},
    {key: "attack",     path: ["envelope", "attack"],     display: (v) => intDisplay(v, 50),     set: (val) => tracks[globalState.currentTrack].setAttack(val)},
    {key: "decay",      path: ["envelope", "decay"],      display: (v) => intDisplay(v, 50),     set: (val) => tracks[globalState.currentTrack].setDecay(val)},
    {key: "sustain",    path: ["envelope", "sustain"],    display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setSustain(val)},
    {key: "release",    path: ["envelope", "release"],    display: (v) => intDisplay(v, 20),     set: (val) => tracks[globalState.currentTrack].setRelease(val)},
    {key: "lpWidth",    path: ["lowpass", "frequency"],   display: filterWidthDisplay,           set: (val) => tracks[globalState.currentTrack].setLpWidth(val)},
    {key: "lpq",        path: ["lowpass", "q"],           display: (v) => intDisplay(v, 5),      set: (val) => tracks[globalState.currentTrack].setLpQ(val)},
    {key: "hpWidth",    path: ["highpass", "frequency"],  display: filterWidthDisplay,           set: (val) => tracks[globalState.currentTrack].setHpWidth(val)},
    {key: "hpq",        path: ["highpass", "q"],          display: (v) => intDisplay(v, 5),      set: (val) => tracks[globalState.currentTrack].setHpQ(val)},
    {key: "distortion", path: ["distortion", "amount"],   display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setDistortion(val)},
    {key: "bitcrusher", path: ["bitcrusher", "mix"],      display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setBitcrusher(val)},
    {key: "chorusRate", path: ["chorus", "rate"],         display: (v) => intDisplay(v, 20),     set: (val) => tracks[globalState.currentTrack].setChorusRate(val)},
    {key: "chorusDepth",path: ["chorus", "depth"],        display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setChorusDepth(val)},
    {key: "chorusMix",  path: ["chorus", "mix"],          display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setChorusMix(val)},
    {key: "tremRate",   path: ["tremolo", "rate"],        display: (v) => intDisplay(v, 5),      set: (val) => tracks[globalState.currentTrack].setTremoloRate(val)},
    {key: "tremDepth",  path: ["tremolo", "depth"],       display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setTremoloDepth(val)},
    {key: "tremMix",    path: ["tremolo", "mix"],         display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setTremoloMix(val)},
    {key: "delTime",    path: ["delay", "time"],          display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setDelayTime(val)},
    {key: "delFback",   path: ["delay", "feedback"],      display: (v) => intDisplay(v, 111.11), set: (val) => tracks[globalState.currentTrack].setDelayFeedback(val)},
    {key: "delMix",     path: ["delay", "mix"],           display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setDelayMix(val)},
    {key: "reverb",     path: ["reverb", "send"],         display: (v) => intDisplay(v, 100),    set: (val) => tracks[globalState.currentTrack].setReverbSend(val)},
];

///////////////////////// Master Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
export const masterParams = [
    {key: "dirt",        path: ["reverb", "dirt"],           display: (v) => intDisplay(v, 1),   set: (val) => master.setDirt(val)},
    {key: "dirtMix",     path: ["reverb", "dirtMix"],       display: (v) => intDisplay(v, 100), set: (val) => master.setDirtMix(val)},
    {key: "space",       path: ["reverb", "space"],         display: (v) => intDisplay(v, 10),  set: (val) => master.setSpace(val)},
    {key: "predelay",    path: ["reverb", "predelay"],      display: (v) => intDisplay(v, 100), set: (val) => master.setPredelay(val)},
    {key: "revWidth",    path: ["reverb", "width"],         display: (v) => intDisplay(v, 100), set: (val) => master.setReverbWidth(val)},
    {key: "eqLow",       path: ["eq", "low"],               display: dbDisplay,                 set: (val) => master.setEqLow(val)},
    {key: "eqMid",       path: ["eq", "mid"],               display: dbDisplay,                 set: (val) => master.setEqMid(val)},
    {key: "eqHigh",      path: ["eq", "high"],              display: dbDisplay,                 set: (val) => master.setEqHigh(val)},
    {key: "compThresh",  path: ["compressor", "threshold"], display: dbDisplay,                 set: (val) => master.setCompThresh(val)},
    {key: "compRatio",   path: ["compressor", "ratio"],     display: (v) => intDisplay(v, 1),   set: (val) => master.setCompRatio(val)},
    {key: "compAttack",  path: ["compressor", "attack"],    display: (v) => intDisplay(v, 100), set: (val) => master.setCompAttack(val)},
    {key: "compRelease", path: ["compressor", "release"],   display: (v) => intDisplay(v, 100), set: (val) => master.setCompRelease(val)},
    {key: "compKnee",    path: ["compressor", "knee"],      display: (v) => intDisplay(v, 1),   set: (val) => master.setCompKnee(val)},
    {key: "satDrive",    path: ["saturator", "drive"],      display: (v) => intDisplay(v, 200), set: (val) => master.setSatDrive(val)},
    {key: "satTone",     path: ["saturator", "tone"],       display: (v) => intDisplay(v, 0.005), set: (val) => master.setSatTone(val)},
    {key: "satMix",      path: ["saturator", "mix"],        display: (v) => intDisplay(v, 100), set: (val) => master.setSatMix(val)},
];

///////////////////////// Global Master Controls \\\\\\\\\\\\\\\\\\\\\\\\\\
export const globalMasterControls = [
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

export function initTrackParams() {
    initParams(trackParams, (val, param) => {
        const [group, prop] = param.path;
        currentData.tracks[globalState.currentTrack][group][prop] = val;
    });
}

export function initMasterParams() {
    initParams(masterParams, (val, param) => {
        const [group, prop] = param.path;
        currentData.master[group][prop] = val;
    });
}

export function initGlobalMasterParams() {
    initParams(globalMasterControls, (val, param) => {
        currentData[param.key] = val;
    });
}

///////////////////////// UI Rendering Functions \\\\\\\\\\\\\\\\\\\\\\\\\\

export function updateGlobalMasterControlUI(param, val) {
    const input = document.getElementById(param.key);
    const display = document.getElementById(param.key + "Display");

    input.value = val;
    display.innerHTML = param.display(val);
}

export function updateParamUI(val, key, display) {
    const param = document.getElementById(key);
    const paramDisplay = document.getElementById(key + "Display");

    param.value = val;
    paramDisplay.innerHTML = display;
}
