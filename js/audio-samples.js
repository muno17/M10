////////////////////////// Sample Loading & Management \\\\\\\\\\\\\\\\\\\\\\\\\\

// default samples for guest (not-logged-in) users
let initSamples = {
    samples: [
        {
            path: "/samples/init/Marshalls_Kick.wav",
            name: "Marshalls Kick",
        },
        {
            path: "/samples/init/Marshalls_Clap.wav",
            name: "Marshalls Clap",
        },
        {
            path: "/samples/init/Marshalls_Open.wav",
            name: "Marshalls Open Hat",
        },
        {
            path: "/samples/init/Marshalls_Closed.wav",
            name: "Marshalls Closed Hat",
        },
        {
            path: "/samples/init/Digi Buzz Bass.wav",
            name: "Digi Buzz Bass",
        },
        {
            path: "/samples/init/canto.wav",
            name: "Canto Stab",
        },
        {
            path: "/samples/init/Grain_Drone.wav",
            name: "Grain Drone",
        },
        {
            path: "/samples/init/OB Cosmic Pad.wav",
            name: "OB Cosmic Pad",
        },
        {
            path: "/samples/init/Digi Galactic Bass.wav",
            name: "Digi Galactic Bass",
        },
        {
            path: "/samples/init/Pro 3 bass 1.wav",
            name: "Pro3 Bass",
        },
    ],
};

// load samples for the currently selected sequence, then re-enable the UI
function loadSequenceSamples() {
    loadInstruments();

    // reenable once everything is loaded
    Tone.loaded().then(() => {
        enableSequencer();
        renderParams();
    });
}

// load tracks with samples from currentData
function loadInstruments() {
    currentData.tracks.forEach((track, index) => {
        if (track.sample.path) {
            tracks[index].loadSample(track.sample.path);
        }
    });
}

// populate the sample dropdown with the default guest samples
function loadInitSamples() {
    const samples = document.getElementById("samples");

    initSamples.samples.forEach((sample, index) => {
        const option = document.createElement("option");
        option.value = sample.path;
        option.dataset.name = sample.name;
        option.innerHTML = '📦 ' + sample.name;
        option.classList.add("initSample");
        samples.appendChild(option);
    })
}

// wire up the sample <select> so picking a sample loads it into the current track
function initSampleSelector() {
    const selector = document.getElementById("samples");

    selector.addEventListener("change", function () {
        if (this.value === "upload") {
            return;
        }

        // update data
        const path = this.value;
        const name = this.options[this.selectedIndex].dataset.name;

        currentData.tracks[globalState.currentTrack].sample.path = path;
        currentData.tracks[globalState.currentTrack].sample.name = name;

        // update audio engine
        tracks[globalState.currentTrack].loadSample(path);

        markAsChanged();
    });
}

// ****************** local uploads ****************** \\
async function handleLocalUpload(file, trackIndex) {
    if (!file) return;

    // create a temporary url for the local file
    const localURL = URL.createObjectURL(file);

    await tracks[trackIndex].loadSample(localURL);
    currentData.tracks[trackIndex].sample.name = file.name;
    currentData.tracks[trackIndex].sample.path = localURL;

    const samples = document.getElementById("samples")
    let newSample = document.createElement("option");
    newSample.value = localURL;
    newSample.dataset.name = file.name;
    newSample.innerHTML = file.name;
    newSample.selected = true;
    samples.appendChild(newSample);

    renderParams();
    console.log(`Local sample loaded to track ${trackIndex}: ${file.name}`);
}

// wire up the guest local-file input
function initGuestUpload() {
    const upload = document.getElementById("localFile");

    if (upload) {
        upload.addEventListener("change", function (e) {
            const file = e.target.files[0];
            handleLocalUpload(file, globalState.currentTrack);
        });
    }
}
