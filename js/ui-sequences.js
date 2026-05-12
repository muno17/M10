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
            if (changes) {
                // await saveSequence(); // *** figure this out

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

function initSequenceSelector() {
    const selector = document.getElementById("sequences");

    selector.addEventListener("change", function () {
        let selectedId = this.value;
        // save currentData if changes
        if (changes) {
            openSaveModal(selectedId);
        } else {
            if (selectedId != "new") {
                // getSequence(selectedId); // *** figure this out
                length = currentData.length;
            } else {
                resetInterface();
            }
        }
    });
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

    const tempoVal = currentData.tempo;
    document.getElementById("tempo").value = tempoVal;
    document.getElementById("tempoDisplay").innerText = tempoVal;
    document.getElementById("masterVolume").value = currentData.masterVolume;
}
