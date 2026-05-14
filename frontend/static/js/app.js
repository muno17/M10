import { globalState, currentData } from './state/state.js';
import { master } from './audio/master.js';
import { initTracks } from './audio/track.js';
import { initAudioContext, setupAudioLoop } from './audio/engine.js';
import { loadInitSamples } from './audio/samples.js';
import { initSequencer } from './ui/sequencer.js';
import { initTrackParams, initMasterParams } from './ui/parameters.js';
import { initGlobalControls, initTransport, renderParams, renderMasterParams, userNotLoggedIn } from './ui/controls.js';

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

// initialize all controls, audio engine and api
window.onload = async function () {
    try {
        // audio setup
        initAudioContext();
        master.initChain();
        await master.initReverbBus();
        initTracks();

        // set up transport
        Tone.Transport.bpm.value = currentData.tempo;
        initTransport();

        // control setup
        initGlobalControls();
        initSequencer();
        initTrackParams();
        initMasterParams();

        // load init samples into sample dropdown for guests
        loadInitSamples();

        // once loaded, update ui and start audio functionality
        Tone.loaded().then(() => {
            globalState.currentTrack = 0;
            renderParams();
            setupAudioLoop();
        });

        renderMasterParams();
        userNotLoggedIn();
        removeLoadingScreen();
    } catch (error) {
        console.error("Failed to load:", error);
        document.querySelector(".loading-box h3").innerText = "Load Failed :(";
    }
};
