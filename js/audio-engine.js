////////////////////////// Audio Functionality \\\\\\\\\\\\\\\\\\\\\\\\\\
Tone.Transport.loop = true;
Tone.Transport.loopEnd = length;
Tone.Transport.swingSubdivision = "16n";
Tone.context.lookAhead = 0.1;

// arrays for instruments, parameters and effects
const instruments = [];
const panVols = [];
const ampEnvs = [];
const lpFilters = [];
const hpFilters = [];
const distortions = [];
const bitcrushers = [];
const choruses = [];
const tremolos = [];
const delays = [];
const reverbSends = [];

// recording functionality
const recorder = new Tone.Recorder();
Tone.Destination.connect(recorder);
var recording = false;

// master output to apply master effects
const master = Tone.getDestination();

// global variables for master effects
var masterVolNode;
var masterCompressor;
var masterEQ;
var masterSaturator;
var masterLimiter;
var masterReverb;
var reverbWidener;
var reverbHeat;
var reverbLimiter;

// create tone.js samplers
function initInstruments() {
    initMasterChain();
    for (var i = 0; i < 10; i++) {
        const track = currentData.tracks[i];

        // initialize the sample player
        instruments[i] = new Tone.Player({
            url: null,
            autostart: false,
            fadeOut: "32n",
        });

        // initialize all of the components for the audio chain
        ampEnvs[i] = new Tone.AmplitudeEnvelope({
            attack: track.attack,
            decay: track.decay,
            sustain: track.sustain,
            release: track.release,
        });

        lpFilters[i] = new Tone.Filter(track.lpWidth, "lowpass");
        hpFilters[i] = new Tone.Filter(track.hpWidth, "highpass");

        // initialize all of the effects for the audio chain
        distortions[i] = new Tone.Distortion({
            distortion: track.distortion,
            wet: track.distortion,
        });
        bitcrushers[i] = new Tone.BitCrusher({
            bits: 4,
            wet: track.bitcrusher,
        });

        choruses[i] = new Tone.Chorus(4, 2.5, 0.5).start();
        choruses[i].wet.value = track.chorusMix;

        tremolos[i] = new Tone.Tremolo(5, 0.75).start();
        tremolos[i].wet.value = track.tremMix;

        delays[i] = new Tone.FeedbackDelay("8n", track.delFback);
        delays[i].wet.value = track.delMix;

        // final output node for the track
        panVols[i] = new Tone.PanVol(track.pan, track.volume);

        // send to master reverb bus
        reverbSends[i] = new Tone.Gain(track.reverb);
        panVols[i].connect(reverbSends[i]);
        reverbSends[i].connect(reverbHeat);

        // chain the audio path
        instruments[i].chain(
            ampEnvs[i],
            lpFilters[i],
            hpFilters[i],
            distortions[i],
            bitcrushers[i],
            choruses[i],
            tremolos[i],
            delays[i],
            panVols[i],
            masterEQ, // final destination
        );
    }
}

// load instruments with samples from currentData
function loadInstruments() {
    currentData.tracks.forEach((track, index) => {
        if (track.samplePath) {
            instruments[index].load(track.samplePath);
        }
    });
}

// chain together effects to create a master reverb bus
function initReverbBus() {
    // dirt
    reverbHeat = new Tone.Chebyshev(20);
    reverbHeat.wet.value = 0.2;

    masterReverb = new Tone.Reverb({
        decay: 3,
        preDelay: 0.01,
    });

    // width
    reverbWidener = new Tone.StereoWidener(0.3);
    reverbLimiter = new Tone.Limiter(-3);

    // chain effects from reverb bus together and send to masterEQ
    reverbHeat.chain(masterReverb, reverbWidener, reverbLimiter, masterEQ);

    masterReverb.generate();
}

function initMasterChain() {
    masterVolNode = new Tone.Gain(1);

    // init master effects
    masterEQ = new Tone.EQ3(0, 0, 0);
    masterCompressor = new Tone.Compressor(-24, 3);
    masterSaturator = new Tone.Distortion(0.1);
    saturatorFilter = new Tone.Filter(20000, "lowpass");
    masterLimiter = new Tone.Limiter(-1);

    initReverbBus();

    // chain master audio and send to main output
    masterEQ.chain(
        masterCompressor,
        masterSaturator,
        saturatorFilter,
        masterVolNode,
        masterLimiter,
        Tone.Destination,
    );
}

// initialize all controls, audio engine and api
window.onload = async function () {
    try {
        await checkLoginStatus();

        // audio setup
        initInstruments();
        Tone.Transport.bpm.value = currentData.bpm;
        initTransport();

        // control setup
        initGlobalControls();
        initSequencer();
        initTrackParams();
        initMasterParams();

        // api setup for logged in users
        if (loggedIn) {
            loadSequences();
            loadSamples();
        } else {
            // load init samples into sample dropdown for guests
            loadInitSamples();
        }

        // once loaded, update ui and start audio functionality
        Tone.loaded().then(() => {
            currentTrack = 0;
            renderParams();
            setupAudioLoop();
        });

        renderMasterParams();
        removeLoadingScreen();
    } catch (error) {
        console.error("Failed to load:", error);
        document.querySelector(".loading-box h3").innerText = "Load Failed :(";
    }
};

// remove loading screen modal, add a bit of extra time for everything to shift into place
function removeLoadingScreen() {
    setTimeout(() => {
        const loader = document.getElementById("loading-overlay");
        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            loader.classList.add("hidden");
        }, 500);
    }, 500);
}
////////////////////////// Loop Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\

// schedule the loop
function setupAudioLoop() {
    // clear any existing loop
    Tone.Transport.cancel();

    Tone.Transport.scheduleRepeat((time) => {
        const totalSteps = parseInt(currentData.length) * 16;
        // play the sounds for the current step
        currentData.tracks.forEach((track, index) => {
            untoggleTrackHit(index);
            if (track.steps[currentStep] == 1) {
                toggleTrackHit(index);
                playTrackSound(index, time);
            }
        });

        // schedule the UI to move ONLY when the audio actually hits
        // pass the currentStep into the Draw function
        let stepToDraw = currentStep;
        Tone.Draw.schedule(() => {
            updateUIPlayHead(stepToDraw);

            // flash current page to bpm
            if (stepToDraw % 4 === 0) {
                togglePageHit(stepToDraw);
            }
        }, time);

        // increment for the next time the loop runs
        currentStep = (currentStep + 1) % totalSteps;
    }, "16n");
}

// trigger the audio for sample playback
function playTrackSound(index, time) {
    const player = instruments[index];
    const env = ampEnvs[index];
    const track = currentData.tracks[index];
    const now = time || Tone.now();

    try {
        if (player && player.buffer && player.buffer.loaded) {
            // stop the player and current env immediately so cut off existing sound
            player.stop(now);
            env.cancel(now);

            // get the start point of the sample and the time to play
            const offset = player.buffer.duration * (track.start || 0);
            const safeOffset = Math.min(offset, player.buffer.duration - 0.005);

            // don't try to play past the length of the sample if start has been offset
            const remainingTime =
                (player.buffer.duration - safeOffset) / player.playbackRate;

            // restart the player and the envelope
            player.start(now, safeOffset);

            // starts next attack phase
            env.triggerAttackRelease(remainingTime, now);
        }
    } catch (e) {
        console.error("Playback error:", e);
    }
}

// stop the audio buffer for each instrument immediately
function stopAllSounds() {
    instruments.forEach((player) => {
        if (player) {
            player.stop();
        }
    });
}

async function startTransport() {
    const transport = document.getElementById("transport");
    Tone.context.resume();

    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = currentData.length;

    // functionality to play
    currentStep = 0;
    updateUIPlayHead(0);
    running = true;
    Tone.Transport.start("+0.1");
    transport.innerHTML = "Stop";
}

function stopTransport() {
    const transport = document.getElementById("transport");
    running = false;
    // functionality to stop
    Tone.Transport.stop();
    stopAllSounds();
    Tone.Draw.cancel();

    currentStep = 0;

    document.querySelectorAll(".step").forEach((el) => {
        el.classList.remove("current");
    });
    transport.innerHTML = "Play";
}