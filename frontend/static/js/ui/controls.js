import { globalState, currentData, createEmptySteps } from '../state/state.js';
import { tracks } from '../audio/track.js';
import { master } from '../audio/master.js';
import { startTransport, stopTransport, isRecording, startRecording, stopRecording, recorder } from '../audio/engine.js';
import { renderSequencer, updateUIPlayHead } from './sequencer.js';
import { trackParams, masterParams, globalMasterControls, initGlobalMasterParams, updateParamUI, updateGlobalMasterControlUI } from './parameters.js';
import { initSave, initReload, initNew, initSequenceSelector, markAsChanged } from './sequences.js';
import { initSampleSelector, initGuestUpload } from '../audio/samples.js';
import { initOpenModal } from './modals.js';

// UI event listeners and logic

// modify UI based on whether user is logged in or not
export function userNotLoggedIn() {
    const sequences = document.getElementById("sequences");
    sequences.innerHTML = "<option>Log in to save sequences</option>";
    sequences.style.display = "none";

    const seqLabel = document.getElementById("sequenceLabel");
    seqLabel.style.display = "none";

    const save = document.getElementById("save");
    save.disabled = true;
    save.style.display = "none";

    const newB = document.getElementById("new");
    newB.disabled = true;
    newB.style.display = "none";

    const userUpload = document.getElementById("userUpload");
    userUpload.classList.toggle('hidden');

    const guestUpload = document.getElementById("guestUpload");
    guestUpload.classList.toggle("hidden");

    const reload = document.getElementById("reload");
    reload.innerHTML = "Reset"
}

////////////////////////// Global Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
export function initTransport() {
    const transport = document.getElementById("transport");

    transport.addEventListener("click", async function () {
        if (globalState.running) {
            stopTransport();
        } else {
            startTransport();
        }
    });
}

function initRecord() {
    const record = document.getElementById("record");
    const transport = document.getElementById("transport");

    record.addEventListener("click", async function () {
        if (isRecording()) {
            // stop recording
            stopTransport();

            stopRecording();
            record.innerHTML = "Record";
            record.classList.remove("recording");

            const recordedAudio = await recorder.stop();

            // create a link and click it automatically to start download
            const url = URL.createObjectURL(recordedAudio);
            const anchor = document.createElement("a");
            anchor.download = "recording.webm";
            anchor.href = url;
            anchor.click();

            transport.disabled = false;
        } else {
            // start recording
            transport.disabled = true;
            startRecording();
            record.innerHTML = "Stop";
            record.classList.add("recording");

            // reset the transport
            stopTransport();
            startTransport();
            recorder.start();
        }
    });
}

function initPageSelectors() {
    const pageBtns = document.querySelectorAll(".page");

    // show the sequence for the selected page
    pageBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            pageBtns.forEach((b) => b.classList.remove("selected"));
            this.classList.add("selected");

            globalState.currentPage = parseInt(this.dataset.index);
            renderSequencer();
        });

        // change length to whatever the page button selected was
        btn.addEventListener("dblclick", function () {
            const newLength = parseInt(this.dataset.index) + 1;
            currentData.length = newLength + "m";

            Tone.Transport.setLoopPoints(0, currentData.length);
            Tone.Transport.loop = true;

            updatePageVisuals(newLength);

            markAsChanged();
        });
    });
}

// add indicator for the pages that are on
function updatePageVisuals(measures) {
    const pageBtns = document.querySelectorAll(".page");
    pageBtns.forEach((btn, index) => {
        if (index < measures) {
            btn.classList.add("loop");
        } else {
            btn.classList.remove("loop");
        }
    });
}

function initTrackSelectors() {
    const trackBtns = document.querySelectorAll(".trackBtn");

    trackBtns.forEach((btn) => {
        const raw = btn.dataset.index;
        const index = raw === "master" ? "master" : parseInt(raw);

        btn.addEventListener("click", function () {
            trackBtns.forEach((b) => b.classList.remove("selected"));
            this.classList.add("selected");

            globalState.currentTrack = index;

            renderAll();
        });

        if (index !== "master") {
            btn.addEventListener("dblclick", function () {
                if (currentData.tracks[index].mix.muted) {
                    currentData.tracks[index].mix.muted = false;
                    tracks[index].setMute(false);
                    this.classList.remove("muted");
                } else {
                    currentData.tracks[index].mix.muted = true;
                    tracks[index].setMute(true);
                    this.classList.add("muted");
                }
            });
        }
    });
}

// clear sequence for current track
function initClear() {
    let clear = document.getElementById("clear");

    clear.addEventListener("click", function () {
        currentData.tracks[globalState.currentTrack].steps = createEmptySteps();
        renderSequencer();
        markAsChanged();
    });
}

export function toggleTrackHit(index) {
    const trackBtns = document.querySelectorAll(".trackBtn");
    trackBtns[index].classList.add("flash");
}

export function untoggleTrackHit(index) {
    const trackBtns = document.querySelectorAll(".trackBtn");
    trackBtns[index].classList.remove("flash");
}

export function togglePageHit(step) {
    // calculate which page the transport is actually playing
    const transportPage = Math.floor(step / 16);
    const id = "page" + (transportPage + 1);

    const page = document.getElementById(id);

    if (page) {
        page.classList.add("flash");

        setTimeout(() => {
            page.classList.remove("flash");
        }, 150);
    }
}

export function initGlobalControls() {
    initGlobalMasterParams();
    initPageSelectors();
    initSave();
    initReload();
    initNew();
    initRecord();
    initClear();
    initTrackSelectors();
    initSequenceSelector();
    initSampleSelector();
    initGuestUpload();
    initOpenModal();
}


///////////////////////// Rendering \\\\\\\\\\\\\\\\\\\\\\\\\\

// show/hide the track specific and master track params
export function renderParams() {
    const trackParamsEl = document.getElementById("trackParams");
    const effectParams = document.getElementById("effectParams");
    const effectHouse = document.getElementById("effectsHouse");
    const divider = document.getElementById("paramDivider");
    const selectorRow = document.getElementById("selectorRow"); // sample selector
    const stateRow = document.getElementById("stateRow"); // sequence selector
    const sequencer = document.getElementById("sequencer");

    // check if current track is master
    if (globalState.currentTrack === "master") {
        // hide the track specific UI
        selectorRow.classList.add("hidden");
        divider.classList.add("hidden");

        const rows = trackParamsEl.querySelectorAll(".paramRow");
        rows.forEach((row) => {
            row.classList.add("hidden");
        });

        const effectRows = effectHouse.querySelectorAll(".paramRow");
        effectRows.forEach((row) => {
            row.classList.add("hidden");
        });

        // show the master UI
        trackParamsEl.classList.add("master");
        effectParams.classList.add("master");
        stateRow.classList.add("master");

        renderMasterParams();
        sequencer.classList.add("read-only");
    } else {
        trackParamsEl.classList.remove("master");
        effectParams.classList.remove("master");
        stateRow.classList.remove("master");
        // hide the master specific UI
        const masterRows = document.querySelectorAll(".master");
        masterRows.forEach((row) => {
            row.classList.add("hidden");
        });

        // show the track specific UI
        selectorRow.classList.remove("hidden");
        divider.classList.remove("hidden");

        const rows = trackParamsEl.querySelectorAll(".paramRow");
        rows.forEach((row) => row.classList.remove("hidden"));

        const effectsRows = effectHouse.querySelectorAll(".paramRow");
        effectsRows.forEach((row) => row.classList.remove("hidden"));

        renderTrackParams();
        sequencer.classList.remove("read-only");
    }
}

export function renderAll() {
    renderSequencer();
    renderParams();
}

// update global controls (tempo, volume, swing, page indicators)
export function renderGlobalControls() {
    globalMasterControls.forEach((param) => {
        updateGlobalMasterControlUI(param, currentData[param.key]);
    });
    updatePageVisuals(parseInt(currentData.length));
}

// update the master track's saved values
export function renderMasterParams() {
    const masterData = currentData.master;
    const masterRows = document.querySelectorAll(".master");

    masterRows.forEach((row) => {
        row.classList.remove("hidden");
    });

    renderGlobalControls();

    masterParams.forEach(param => {
        const [group, prop] = param.path;
        const val = masterData[group][prop];
        updateParamUI(val, param.key, param.display(val));
    });
}

// update all params to track's saved value
export function renderTrackParams() {
    const track = currentData.tracks[globalState.currentTrack];
    const samplesDropdown = document.getElementById("samples");

    if (track.sample.path) {
        samplesDropdown.value = track.sample.path;
    } else {
        samplesDropdown.selectedIndex = 0;
        samplesDropdown.value = "";
    }

    trackParams.forEach(param => {
        const [group, prop] = param.path;
        const val = track[group][prop];
        updateParamUI(val, param.key, param.display(val));
    });
}

export function syncTrackParams() {
    const originalViewTrack = globalState.currentTrack;

    currentData.tracks.forEach((track, index) => {
        globalState.currentTrack = index;
        trackParams.forEach((param) => {
            const [group, prop] = param.path;
            param.set(track[group][prop]);
        });
    });

    globalState.currentTrack = originalViewTrack;
}

export function syncMasterParams() {
    // master controls
    globalMasterControls.forEach((control) => {
        control.set(currentData[control.key]);
    });

    // master effects
    const masterData = currentData.master;
    masterParams.forEach((param) => {
        const [group, prop] = param.path;
        param.set(masterData[group][prop]);
    });
}

export function resetParams() {
    syncMasterParams();
    syncTrackParams();
}
