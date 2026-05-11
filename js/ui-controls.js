// UI event listeners and logic

// modify UI based on whether user is logged in or not
function userNotLoggedIn() {
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
function initTransport() {
    const transport = document.getElementById("transport");

    transport.addEventListener("click", async function () {
        if (running) {
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
        if (recording) {
            // stop recording
            stopTransport();

            recording = false;
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
            recording = true;
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

            currentPage = parseInt(this.dataset.index);
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

function initSampleSelector() {
    const selector = document.getElementById("samples");

    // load sample
    selector.addEventListener("change", function () {
        if (this.value === "upload") {
            return;
        }

        // update data
        const path = this.value;
        const name = this.options[this.selectedIndex].dataset.name;

        currentData.tracks[currentTrack].samplePath = path;
        currentData.tracks[currentTrack].sampleName = name;

        // update audio engine
        instruments[currentTrack].load(path);

        markAsChanged();
    });
}


function initGuestUpload() {
    const upload = document.getElementById("localFile");

    if (upload) {
        upload.addEventListener("change", function (e) {
            const file = e.target.files[0];
            handleLocalUpload(file, currentTrack);
        });
    }
}

function initTrackSelectors() {
    const trackBtns = document.querySelectorAll(".trackBtn");

    trackBtns.forEach((btn) => {
        const index = parseInt(btn.dataset.index);
        // for single clicks, display the track's parameters
        btn.addEventListener("click", function () {
            trackBtns.forEach((b) => b.classList.remove("selected"));
            this.classList.add("selected");

            currentTrack = index;

            renderSequencer();
            renderParams();
        });

        // for double clicks, mute the track
        btn.addEventListener("dblclick", function () {
            if (currentData.tracks[index].muted) {
                currentData.tracks[index].muted = false;
                panVols[index].mute = false;
                this.classList.remove("muted");
            } else {
                currentData.tracks[index].muted = true;
                panVols[index].mute = true;
                this.classList.add("muted");
            }
        });
    });
}

// clear sequence for current track
function initClear() {
    let clear = document.getElementById("clear");

    clear.addEventListener("click", function () {
        currentData.tracks[currentTrack].steps = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
        renderSequencer();
        markAsChanged();
    });
}

function toggleTrackHit(index) {
    const trackBtns = document.querySelectorAll(".trackBtn");
    trackBtns[index].classList.add("flash");
}

function untoggleTrackHit(index) {
    const trackBtns = document.querySelectorAll(".trackBtn");
    trackBtns[index].classList.remove("flash");
}

function togglePageHit(step) {
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

function initGlobalControls() {
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
function renderParams() {
    const trackParams = document.getElementById("trackParams");
    const effectParams = document.getElementById("effectParams");
    const effectHouse = document.getElementById("effectsHouse");
    const divider = document.getElementById("paramDivider");
    const selectorRow = document.getElementById("selectorRow"); // sample selector
    const stateRow = document.getElementById("stateRow"); // sequence selector
    const sequencer = document.getElementById("sequencer");

    // check if current track is master
    if (currentTrack === 99) {
        // hide the track specific UI
        selectorRow.classList.add("hidden");
        divider.classList.add("hidden");

        const rows = trackParams.querySelectorAll(".paramRow");
        rows.forEach((row) => {
            row.classList.add("hidden");
        });

        const effectRows = effectHouse.querySelectorAll(".paramRow");
        effectRows.forEach((row) => {
            row.classList.add("hidden");
        });

        // show the master UI
        trackParams.classList.add("master");
        effectParams.classList.add("master");
        stateRow.classList.add("master");

        renderMasterParams();
        sequencer.classList.add("read-only");
    } else {
        trackParams.classList.remove("master");
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

        const rows = trackParams.querySelectorAll(".paramRow");
        rows.forEach((row) => row.classList.remove("hidden"));

        const effectsRows = effectHouse.querySelectorAll(".paramRow");
        effectsRows.forEach((row) => row.classList.remove("hidden"));

        renderTrackParams();
        sequencer.classList.remove("read-only");
    }
}

// update the master track's saved values
function renderMasterParams() {
    const master = currentData.master;
    const masterRows = document.querySelectorAll(".master");

    masterRows.forEach((row) => {
        row.classList.remove("hidden");
    });

    // master UI
    globalMasterControls.forEach((param) => {
        updateGlobalMasterControlUI(param, currentData[param.key]);
    });
    updatePageVisuals(parseInt(currentData.length))

    // master effects
    masterParams.forEach(param => {
        const val = master[param.key];
        updateParamUI(val, param.key, param.display(val));
    });
}

// update all params to track's saved value
function renderTrackParams() {
    const track = currentData.tracks[currentTrack];
    const samplesDropdown = document.getElementById("samples");

    if (track.samplePath) {
        samplesDropdown.value = track.samplePath;
    } else {
        // fallback if no sample is loaded
        samplesDropdown.selectedIndex = 0;
        samplesDropdown.value = "";
    }

    trackParams.forEach(param => {
        const val = track[param.key];
        updateParamUI(val, param.key, param.display(val));
    });
}

function syncTrackParams() {
    const originalViewTrack = currentTrack;

    currentData.tracks.forEach((track, index) => {
        if (track.id === 99) return;

        currentTrack = index;
        trackParams.forEach((param) => {
            param.set(track[param.key]);
        });
    });

    currentTrack = originalViewTrack;
}

function syncMasterParams() {
    const master = currentData.master;

    // master controls
    globalMasterControls.forEach((control) => {
        control.set(currentData[control.key]);
    });

    // master effects
    masterParams.forEach((param) => {
        param.set(master[param.key]);
    });
}

function resetParams() {
    syncMasterParams();
    syncTrackParams();
}