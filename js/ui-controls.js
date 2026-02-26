// UI event listeners and logic

// modify UI based on whether user is logged in or not
function userNotLoggedIn() {
    const sequences = document.getElementById("sequences");
    sequences.innerHTML = "<option>Log in to save sequences</option>";

    const save = document.getElementById("save");
    save.disabled = true;

    const newB = document.getElementById("new");
    newB.disabled = true;

    const userUpload = document.getElementById("userUpload");
    userUpload.classList.toggle('hidden');

    const guestUpload = document.getElementById("guestUpload");
    guestUpload.classList.toggle("hidden");

    const reload = document.getElementById("reload");
    reload.innerHTML = "Reset"

    loggedIn = false;
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

function initTempo() {
    const tempo = document.getElementById("tempo");

    tempo.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.bpm = val;

        updateTempoUI(val);
        setTempo(val);

        markAsChanged();
    });
}

function updateTempoUI(val) {
    const tempo = document.getElementById("tempo");
    const tempoDisplay = document.getElementById("tempoDisplay");

    tempo.value = val;
   tempoDisplay.innerHTML = parseInt(val);
}

function initMasterVol() {
    const masterVol = document.getElementById("masterVol");

    masterVol.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.masterVolume = val;

        updateMasterVolUI(val);
        setMasterVol(val);

        markAsChanged();
    });
}

function updateMasterVolUI(val) {
    const masterVol = document.getElementById("masterVol");
    const masterVolDisplay = document.getElementById("masterVolDisplay");

    masterVol.value = val;
    masterVolDisplay.innerHTML = parseInt(val) + "dB";
}

function initSwing() {
    Tone.Transport.swingSubdivision = "16n";
    const swing = document.getElementById("swing");

    swing.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.swing = val;

        updateSwingUI(val);
        setSwing(val);

        markAsChanged();
    });
}

function updateSwingUI(val) {
    const swing = document.getElementById("swing");
    const swingDisplay = document.getElementById("swingDisplay");

    swing.value = val;
    swingDisplay.innerHTML = parseInt(val * 100);
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

// save currentData
// assign a copy of currentData to projectData on success
// 'glow' if there are changes to be made, remove if saved or if reloaded
function initSave() {
    const saveBtn = document.getElementById("save");
    if (saveBtn) {
        saveBtn.addEventListener("click", async function () {
        // check if its the default sequence
        const sequencesDropdown = document.getElementById("sequences");
        if (sequencesDropdown.value === "new") {
            const name = await openNamingModal();

            // if user clicks the cancel button in the modal
            if (!name) {
                return;
            }

            currentData.name = name;
            projectData.name = name;
        }

        // don't do anything if there isn't anything to save;
        if (changes) {
            await saveSequence();

            resetChanges();
        }
        });
    }
}

// make the save button glow when changes have been made
function markAsChanged() {
    changes = true;
    if (loggedIn) {
        const saveBtn = document.getElementById("save");
        if (saveBtn) {
            saveBtn.classList.add("changes");
        }
    }
}

function resetChanges() {
    const saveBtn = document.getElementById("save");
    saveBtn.classList.remove("changes");
    changes = false;
}

// revert back to last saved state
function initReload() {
    const reloadBtn = document.getElementById("reload");

    reloadBtn.addEventListener("click", function () {
        // don't do anything if there aren't any changes
        if (changes) {
            currentData = JSON.parse(JSON.stringify(projectData));
            resetChanges();

            // stop the current audio and reload instruments
            stopAllSounds();
            loadInstruments();

            // redraw the UI
            renderSequencer();
            renderParams();
        }
    });
}

// create an init sequence
async function initNew() {
    const newBtn = document.getElementById("new");

    newBtn.addEventListener("click", async function () {
        const name = await openNamingModal();

        if (name) {
            // User confirmed, now reset the data
            stopTransport();

            // Deep copy fresh data
            projectData = JSON.parse(JSON.stringify(initData));
            currentData = JSON.parse(JSON.stringify(initData));

            projectData.name = name;
            currentData.name = name;
            currentData.id = null;

            renderSequencer();
            renderParams();
            markAsChanged();
        }
    });
}

function openNamingModal() {
    const overlay = document.getElementById("sequence-overlay");
    const seqName = document.getElementById("seq-name");

    seqName.value = "";
    overlay.classList.remove("modal-hidden");
    seqName.focus();

    // create a promise so initSave waits
    return new Promise((resolve) => {
        modalResolver = resolve;
    });
}

function initOpenModal() {
    const overlay = document.getElementById("sequence-overlay");
    const closeBtn = document.getElementById("sequence-close-btn");
    const sequenceInitBtn = document.getElementById("sequence-init-btn");
    const seqName = document.getElementById("seq-name");

    // cancel button
    closeBtn.addEventListener("click", () => {
        overlay.classList.add("modal-hidden");
        if (modalResolver) {
            modalResolver(false);
        }
    });

    // confirm button
    sequenceInitBtn.addEventListener("click", function () {
        const name = seqName.value.trim() || "Untitled Sequence";

        // logic for creating the new option
        const sequences = document.getElementById("sequences");
        const newSeq = document.createElement("option");
        newSeq.value = "";
        newSeq.innerHTML = name;
        newSeq.selected = true;
        sequences.appendChild(newSeq);

        overlay.classList.add("modal-hidden");
        if (modalResolver) {
            modalResolver(name);
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

function initUserUpload() {
    const upload = document.getElementById("file");

    if (upload) {
        upload.addEventListener("change", function (e) {
            console.log("calling user upload");
            const file = e.target.files[0];
            uploadSample(file);
        });
    }
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

function initSequenceSelector() {
    const selector = document.getElementById("sequences");

    selector.addEventListener("change", function () {
        var selectedId = this.value;
        // save currentData if changes
        if (changes) {
            openSaveModal(selectedId);
        } else {
            if (selectedId != "new") {
                getSequence(selectedId);
                length = currentData.length;
            } else {
                resetInterface();
            }
        }
    });
}

function openSaveModal(id) {
    // initiate the new sequence modal
    const overlay = document.getElementById("save-overlay");
    const noBtn = document.getElementById("sequence-nosave-btn");
    const yesBtn = document.getElementById("sequence-save-btn");

    function openModal() {
        overlay.classList.remove("modal-hidden");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        overlay.classList.add("modal-hidden");
        document.body.style.overflow = "auto";
        resetChanges();
    }

    // close when clicking either button in the modal
    noBtn.addEventListener("click", closeModal);
    yesBtn.addEventListener("click", async function () {
        await saveSequence();
        await getSequence(id);
        closeModal()
    });

    openModal();
}

function resetInterface() {
    currentData = JSON.parse(JSON.stringify(initData));
    projectData = JSON.parse(JSON.stringify(initData));

    resetChanges();

    Tone.Transport.stop();
    currentStep = 0;

    renderParams();
    renderSequencer();
    updateUIPlayHead(0);

    document.getElementById("tempo").value = currentData.bpm;
    document.getElementById("tempoDisplay").innerText = currentData.bpm;
    document.getElementById("masterVol").value = currentData.masterVolume;
}

// clear sequence for current track
function initClear() {
    var clear = document.getElementById("clear");

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
    initTempo();
    initMasterVol();
    initSwing();
    initPageSelectors();
    initSave();
    initReload();
    initNew();
    initRecord();
    initClear();
    initTrackSelectors();
    initSequenceSelector();
    initSampleSelector();
    initUserUpload();
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
    updateMasterVolUI(currentData.masterVolume);
    setMasterVol(currentData.masterVolume);

    updateTempoUI(currentData.bpm);
    setTempo(currentData.bpm);

    updateSwingUI(currentData.swing);
    setSwing(currentData.swing);

    updatePageVisuals(parseInt(currentData.length))

    // master effects
    updateDirtUI(master.dirt);
    setMasterDirt(master.dirt);

    updateDirtMixUI(master.dirtMix);
    setMasterDirtMix(master.dirtMix);

    updateSpaceUI(master.space);
    setMasterSpace(master.space);

    updatePredelayUI(master.predelay);
    setMasterPredelay(master.predelay);

    updateReverbWidthUI(master.revWidth);
    setMasterReverbWidth(master.revWidth);

    updateReverbLimitUI(master.revLimit);
    setMasterReverbLimit(master.revLimit);

    updateEqLowUI(master.eqLow);
    setMasterEqLow(master.eqLow);

    updateEqMidUI(master.eqMid);
    setMasterEqMid(master.eqMid);

    updateEqHighUI(master.eqHigh);
    setMasterEqHigh(master.eqHigh);

    updateSatDriveUI(master.satDrive);
    setMasterSatDrive(master.satDrive);

    updateSatToneUI(master.satTone);
    setMasterSatTone(master.satTone);

    updateSatMixUI(master.satMix);
    setMasterSatMix(master.satMix);

    updateCompThreshUI(master.compThresh);
    setMasterCompThresh(master.compThresh);

    updateCompRatioUI(master.compRatio);
    setMasterCompRatio(master.compRatio);

    updateCompAttackUI(master.compAttack);
    setMasterCompAttack(master.compAttack);

    updateCompReleaseUI(master.compRelease);
    setMasterCompRelease(master.compRelease);

    updateCompKneeUI(master.compKnee);
    setMasterCompKnee(master.compKnee);

    updateLimitThreshUI(master.limitThresh);
    setMasterLimitThresh(master.limitThresh);
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

    // params
    updateVolumeUI(track.volume);
    setTrackVolume(track.volume, true);

    updatePanUI(track.pan);
    setTrackPan(track.pan, true);

    updatePitchUI(track.pitch);
    setTrackPitch(track.pitch);

    updateStartUI(track.start);
    setTrackStart(track.start);

    updateAttackUI(track.attack);
    setTrackAttack(track.attack);

    updateDecayUI(track.decay);
    setTrackDecay(track.decay);

    updateSustainUI(track.sustain);
    setTrackSustain(track.sustain);

    updateReleaseUI(track.release);
    setTrackRelease(track.release);

    updateLpWidthUI(track.lpWidth);
    setTrackLpWidth(track.lpWidth);

    updateLpQUI(track.lpq);
    setTrackLpQ(track.lpq);

    updateHpWidthUI(track.hpWidth);
    setTrackHpWidth(track.hpWidth);

    updateHpQUI(track.hpq);
    setTrackHpQ(track.hpq);

    // effects
    updateDistortionUI(track.distortion);
    setTrackDistortion(track.distortion);

    updateBitcrusherUI(track.bitcrusher);
    setTrackBitcrusher(track.bitcrusher);

    updateChorusRateUI(track.chorusRate);
    setTrackChorusRate(track.chorusRate);

    updateChorusDepthUI(track.chorusDepth);
    setTrackChorusDepth(track.chorusDepth);

    updateChorusMixUI(track.chorusMix);
    setTrackChorusMix(track.chorusMix);

    updateTremoloRateUI(track.tremRate);
    setTrackTremoloRate(track.tremRate);

    updateTremoloDepthUI(track.tremDepth);
    setTrackTremoloDepth(track.tremDepth);

    updateTremoloMixUI(track.tremMix);
    setTrackTremoloMix(track.tremMix);

    updateDelayTimeUI(track.delTime);
    setTrackDelayTime(track.delTime);

    updateDelayFeedbackUI(track.delFback);
    setTrackDelayFeedback(track.delFback);

    updateDelayMixUI(track.delMix);
    setTrackDelayMix(track.delMix);

    updateReverbSendUI(track.reverb);
    setTrackReverbSend(track.reverb);
}

function syncTrackParams() {
        currentData.tracks.forEach((track, index) => {
            if (track.id === 99) return;

            let originalViewTrack = currentTrack;
            currentTrack = index;

            // params
            setTrackVolume(track.volume, true);
            setTrackPan(track.pan, true);
            setTrackPitch(track.pitch);
            setTrackStart(track.start);
            setTrackAttack(track.attack);
            setTrackDecay(track.decay);
            setTrackSustain(track.sustain);
            setTrackRelease(track.release);
            setTrackLpWidth(track.lpWidth);
            setTrackLpQ(track.lpq);
            setTrackHpWidth(track.hpWidth);
            setTrackHpQ(track.hpq);

            // effects
            setTrackDistortion(track.distortion);
            setTrackBitcrusher(track.bitcrusher);
            setTrackChorusRate(track.chorusRate);
            setTrackChorusDepth(track.chorusDepth);
            setTrackChorusMix(track.chorusMix);
            setTrackTremoloRate(track.tremRate);
            setTrackTremoloDepth(track.tremDepth);
            setTrackTremoloMix(track.tremMix);
            setTrackDelayTime(track.delTime);
            setTrackDelayFeedback(track.delFback);
            setTrackDelayMix(track.delMix);
            setTrackReverbSend(track.reverb);

            currentTrack = originalViewTrack;
        });
}