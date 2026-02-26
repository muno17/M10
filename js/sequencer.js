// ****************** sequencer functionality ****************** \\

function initSequencer() {
    const sequence = document.getElementById("sequencer");

    // activate the step on click
    sequence.addEventListener("click", function (e) {
        if (currentTrack === 99) return;
        
        // check if an actual step was clicked
        if (e.target.classList.contains("step")) {
            // grab the step index
            const step = parseInt(e.target.dataset.step);

            const offset = currentPage * 16;
            const actualStep = offset + step;

            // toggle the data in the master object
            const currentVal = currentData.tracks[currentTrack].steps[actualStep];
            if (currentVal === 0) {
                currentData.tracks[currentTrack].steps[actualStep] = 1;
            } else {
                currentData.tracks[currentTrack].steps[actualStep] = 0;
            }

            e.target.classList.toggle("active");
            markAsChanged();
        }
    });
}

function renderSequencer() {
    if (currentTrack == 99) {
        return;
    }

    // look at currentdata and add values to sequence for current track
    const steps = document.querySelectorAll(".step");
    const currentSeq = currentData.tracks[currentTrack].steps;

    // calculate the current page steps
    const offset = currentPage * 16;

    steps.forEach((stepBtn, index) => {
        // only look at steps for the current page
        if (currentSeq[offset + index] === 1) {
            stepBtn.classList.add("active");
        } else {
            stepBtn.classList.remove("active");
        }
    });
}

// update sequencer UI position to make it look animated
function updateUIPlayHead(step) {
    if (!running) return;

    // calculate which page the transport is currently on
    const transportPage = Math.floor(step / 16);
    const activeStep = step % 16;

    // remove styling from previous step
    const previous = document.querySelector(".step.current");
    if (previous) {
        previous.classList.remove("current");
    }

    // add styling to current step
    if (transportPage == currentPage) {
        const current = document.querySelector(`.step[data-step="${activeStep}"]`);
        if (current) {
            current.classList.add("current");
        }
    }
}

function disableSequencer(message) {
    const playBtn = document.getElementById("transport");

    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;
    running = false;
    currentStep = 0;

    document.querySelectorAll(".step").forEach((el) => {
        el.classList.remove("current");
    });

    playBtn.disabled = true;
    playBtn.innerHTML = message;
}

function enableSequencer() {
    const playBtn = document.getElementById("transport");
    playBtn.disabled = false;
    playBtn.innerHTML = "Play";
}

function updateSequenceLength(numPages) {
    currentData.length = numPages + "m";
    Tone.Transport.loopEnd = currentData.length;
}