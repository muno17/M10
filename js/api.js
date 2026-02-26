// function to load samples
function loadSequenceSamples() {
    loadInstruments();

    // reenable once everything is loaded
    Tone.loaded().then(() => {
        enableSequencer();
        renderParams();
    });
}

// ****************** local uploads ****************** \\
async function handleLocalUpload(file, trackIndex) {
    if (!file) return;

    // create a temporary url for the local file
    const localURL = URL.createObjectURL(file);

    await instruments[trackIndex].load(localURL);
    currentData.tracks[trackIndex].sampleName = file.name;
    currentData.tracks[trackIndex].samplePath = localURL;

    const samples = document.getElementById("samples")
    var newSample = document.createElement("option");
    newSample.value = localURL;
    newSample.dataset.name = file.name;
    newSample.innerHTML = file.name;
    newSample.selected = true;
    samples.appendChild(newSample);

    renderParams();
    console.log(`Local sample loaded to track ${trackIndex}: ${file.name}`);
}

// load init samples for guest users
function loadInitSamples() {
    const samples = document.getElementById("samples");

    initSamples.samples.forEach((sample, index) => {
        const option = document.createElement("option");
        option.value = sample.path;
        option.dataset.name = sample.name;
        option.innerHTML = '📦 ' + sample.name;
        option.classList.add("initSample");
        samples.appendChild(option);

        // automatically loads the samples in - probably keep off
        /*
        if (instruments[index]) {
            instruments[index].load(sample.path);

            // Sync the internal data so the UI knows what's loaded
            currentData.tracks[index].samplePath = sample.path;
            currentData.tracks[index].sampleName = sample.name;
        }
        */
    })
}