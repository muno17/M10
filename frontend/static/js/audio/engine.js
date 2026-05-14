import { globalState, currentData } from '../state/state.js';
import { master } from './master.js';
import { tracks } from './track.js';
import { updateUIPlayHead } from '../ui/sequencer.js';
import { toggleTrackHit, untoggleTrackHit, togglePageHit } from '../ui/controls.js';

////////////////////////// Audio Functionality \\\\\\\\\\\\\\\\\\\\\\\\\\
export let recorder;
let recording = false;

export function isRecording() {
    return recording;
}

export function startRecording() {
    recording = true;
}

export function stopRecording() {
    recording = false;
}

export function initAudioContext() {
    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = globalState.loopLength;
    Tone.Transport.swingSubdivision = "16n";
    Tone.context.lookAhead = 0.1;

    recorder = new Tone.Recorder();
    Tone.Destination.connect(recorder);
}

////////////////////////// Loop Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\

// schedule the loop
export function setupAudioLoop() {
    // clear any existing loop
    Tone.Transport.cancel();

    Tone.Transport.scheduleRepeat((time) => {
        const totalSteps = parseInt(currentData.length) * 16;
        // play the sounds for the current step
        currentData.tracks.forEach((track, index) => {
            if (track.steps[globalState.currentStep] == 1) {
                playTrackSound(index, time);
            }
        });

        // schedule the UI to move ONLY when the audio actually hits
        // pass the currentStep into the Draw function
        let stepToDraw = globalState.currentStep;
        Tone.Draw.schedule(() => {
            updateUIPlayHead(stepToDraw);

            currentData.tracks.forEach((track, index) => {
                untoggleTrackHit(index);
                if (track.steps[globalState.currentStep] == 1) {
                    toggleTrackHit(index);
                }
            });

            // flash current page to bpm
            if (stepToDraw % 4 === 0) {
                togglePageHit(stepToDraw);
            }
        }, time);

        // increment for the next time the loop runs
        globalState.currentStep = (globalState.currentStep + 1) % totalSteps;
    }, "16n");
}

// trigger the audio for sample playback
export function playTrackSound(index, time) {
    const player = tracks[index].instrument;
    const env = tracks[index].ampEnv;
    const now = time || Tone.now();

    try {
        if (player && player.buffer && player.buffer.loaded) {
            // stop the player and current env immediately so cut off existing sound
            player.stop(now);
            env.cancel(now);

            // get the start point of the sample and the time to play
            const offset = player.buffer.duration * (tracks[index].playStart || 0);
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
export function stopAllSounds() {
    const now = Tone.now();

    tracks.forEach((track, i) => {
        // 1. Stop the sample source immediately
        if (track.instrument) {
            track.instrument.stop(now);
        }

        // 2. Kill the envelope
        if (track.ampEnv) {
            // This stops any scheduled attack/release ramps
            track.ampEnv.cancel(now); 
            // This forces the envelope to its "off" state
            track.ampEnv.output.gain.setValueAtTime(0, now);
            track.ampEnv.triggerRelease(now);
        }

        // 3. Clear Delay tails - using .value for the Signal
        if (track.delay) {
            track.delay.delayTime.cancelScheduledValues(now);

            // Use the track data to remember where the wet should be
            const currentWet = currentData.tracks[i].delay.mix;
            
            // Momentarily "Mute" the delay output
            track.delay.wet.setValueAtTime(0, now);
            // Schedule it to come back in 100ms
            track.delay.wet.setValueAtTime(currentWet, now + 0.1);
        }
    });
}

export async function startTransport() {
    const transport = document.getElementById("transport");

    await Tone.start();
    Tone.context.resume();

    // initiate reverb if it hasn't started
    if (master.reverb && !master.reverb.ready) {
        await master.reverb.generate();
    }

    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = currentData.length;

    // start LFOs
    tracks.forEach((t) => t.startLFOs());

    // functionality to play
    globalState.currentStep = 0;
    updateUIPlayHead(0);
    globalState.running = true;
    Tone.Transport.start("+0.1");
    transport.innerHTML = "Stop";
}

export function stopTransport() {
    const transport = document.getElementById("transport");
    globalState.running = false;
    // functionality to stop
    Tone.Transport.cancel(0);
    Tone.Transport.stop();
    stopAllSounds();
    Tone.Draw.cancel();

    globalState.currentStep = 0;

    document.querySelectorAll(".step").forEach((el) => {
        el.classList.remove("current");
    });
    document.querySelectorAll(".trackBtn").forEach((el) => {
        el.classList.remove("flash");
    });
    transport.innerHTML = "Play";

    // reschedule so its ready to play again
    setupAudioLoop();
}