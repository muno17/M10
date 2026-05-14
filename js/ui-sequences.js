// Sequence save, reload, and reset actions

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
            if (globalState.changes) {
                // await saveSequence(); // *** figure this out

                resetChanges();
            }
        });
    }
}

// make the save button glow when changes have been made
function markAsChanged() {
    globalState.changes = true;
    if (globalState.loggedIn) {
        const saveBtn = document.getElementById("save");
        if (saveBtn) {
            saveBtn.classList.add("changes");
        }
    }
}

function resetChanges() {
    const saveBtn = document.getElementById("save");
    saveBtn.classList.remove("changes");
    globalState.changes = false;
}

// revert back to last saved state
function initReload() {
    const reloadBtn = document.getElementById("reload");

    reloadBtn.addEventListener("click", function () {
        // don't do anything if there aren't any changes
        if (globalState.changes) {
            currentData = structuredClone(projectData);
            resetChanges();

            // stop the current audio and reload trackss
            stopAllSounds();
            loadInstruments();

            // redraw the UI
            renderSequencer();
            renderParams();

            // update params
            resetParams();
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
            projectData = structuredClone(initData);
            currentData = structuredClone(initData);

            projectData.name = name;
            currentData.name = name;
            currentData.id = null;

            renderSequencer();
            renderParams();
            markAsChanged();
        }
    });
}

function initSequenceSelector() {
    const selector = document.getElementById("sequences");

    selector.addEventListener("change", function () {
        let selectedId = this.value;
        // save currentData if changes
        if (globalState.changes) {
            openSaveModal(selectedId);
        } else {
            if (selectedId != "new") {
                // getSequence(selectedId); // *** figure this out
                globalState.loopLength = currentData.length;
            } else {
                resetInterface();
            }
        }
    });
}

function resetInterface() {
    currentData = structuredClone(initData);
    projectData = structuredClone(initData);

    resetChanges();

    Tone.Transport.stop();
    globalState.currentStep = 0;

    renderParams();
    renderSequencer();
    updateUIPlayHead(0);

    const tempoVal = currentData.tempo;
    document.getElementById("tempo").value = tempoVal;
    document.getElementById("tempoDisplay").innerText = tempoVal;
    document.getElementById("masterVolume").value = currentData.masterVolume;
}
