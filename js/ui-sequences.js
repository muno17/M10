// Sequence save, reload, and reset actions

function resetDataToInit() {
    projectData = structuredClone(initData);
    currentData = structuredClone(initData);
}

// save currentData
// assign a copy of currentData to projectData on success
// 'glow' if there are changes to be made, remove if saved or if reloaded
function initSave() {
    const saveBtn = document.getElementById("save");
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

            renderAll();
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

            resetDataToInit();

            projectData.name = name;
            currentData.name = name;
            currentData.id = null;

            renderAll();
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
    resetDataToInit();
    resetChanges();

    Tone.Transport.stop();
    globalState.currentStep = 0;

    renderAll();
    renderGlobalControls();
    updateUIPlayHead(0);
}
