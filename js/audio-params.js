////////////////////////// Audio Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
// functions to update audio for each parameter

////// global params
function setTempo(val) {
    Tone.Transport.bpm.value = val;
}

function setSwing(val) {
    Tone.Transport.swing = val;
}

// instant when switching tracks, not instant when just sliding slider
function setTrackVolume(val, instant = false) {
    // only apply volume if not muted
    if (!panVols[currentTrack].mute) {
        if (instant) {
            panVols[currentTrack].volume.value = val;
        } else {
            panVols[currentTrack].volume.rampTo(val, 0.05);
        }
    }
}

function setTrackPan(val, instant = false) {
    if (instant) {
        panVols[currentTrack].pan.value = val;
    } else {
        panVols[currentTrack].pan.rampTo(val, 0.05);
    }
}

function setTrackPitch(val) {
    const rate = Math.pow(2, val / 12);
    instruments[currentTrack].playbackRate = rate;
}

function setTrackStart(val) {
    currentData.tracks[currentTrack].start = parseFloat(val);
}

function setTrackAttack(val) {
    ampEnvs[currentTrack].attack = val;
}

function setTrackDecay(val) {
    ampEnvs[currentTrack].decay = val;
}

function setTrackSustain(val) {
    ampEnvs[currentTrack].sustain = val;
}

function setTrackRelease(val) {
    ampEnvs[currentTrack].release = val;
}

function setTrackLpWidth(val) {
    lpFilters[currentTrack].frequency.rampTo(parseFloat(val), 0.05);
}

function setTrackLpQ(val) {
    lpFilters[currentTrack].Q.rampTo(parseFloat(val), 0.05);
}

function setTrackHpWidth(val) {
    hpFilters[currentTrack].frequency.rampTo(parseFloat(val), 0.05);
}

function setTrackHpQ(val) {
    hpFilters[currentTrack].Q.rampTo(parseFloat(val), 0.05);
}

// track effects
function setTrackDistortion(val) {
    distortions[currentTrack].wet.value = val;
    distortions[currentTrack].distortion = val;
}

function setTrackBitcrusher(val) {
    bitcrushers[currentTrack].wet.value = val;
}

function setTrackChorusRate(val) {
    choruses[currentTrack].frequency.value = val;
}

function setTrackChorusDepth(val) {
    choruses[currentTrack].depth = val;
}

function setTrackChorusMix(val) {
    choruses[currentTrack].wet.value = val;
}

function setTrackTremoloRate(val) {
    tremolos[currentTrack].frequency.value = val;
}

function setTrackTremoloDepth(val) {
    tremolos[currentTrack].depth.value = val;
}

function setTrackTremoloMix(val) {
    tremolos[currentTrack].wet.value = val;
}

function setTrackDelayTime(val) {
    delays[currentTrack].delayTime.rampTo(val, 0.1);
}

function setTrackDelayFeedback(val) {
    delays[currentTrack].feedback.rampTo(val, 0.1);
}

function setTrackDelayMix(val) {
    delays[currentTrack].wet.value = val;
}

function setTrackReverbSend(val) {
    reverbSends[currentTrack].gain.rampTo(val, 0.1);
}