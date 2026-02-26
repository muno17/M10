////////////////////////// Audio Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
// functions to update audio for each parameter

////// global params
function setMasterVol(val) {
    masterVolNode.gain.rampTo(Tone.dbToGain(val), 0.1);
}

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

////////////////////////// Master Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\

// reverb
function setMasterCompression(val) {
    masterCompressor.threshold.value = val;
}

function setMasterDirt(val) {
    reverbHeat.order = Math.floor(val);
}

function setMasterDirtMix(val) {
    reverbHeat.wet.value = val;
}

async function setMasterSpace(val) {
    masterReverb.decay = Math.min(0.001, val);
    await masterReverb.generate();
}

function setMasterPredelay(val) {
    masterReverb.preDelay = val;
}

function setMasterReverbWidth(val) {
    // 0 = mono, 1 = very Wide
    reverbWidener.width.rampTo(val, 0.1);
}

function setMasterReverbLimit(val) {
    reverbLimiter.threshold.value = val;
}

// eq

function setMasterEqLow(val) {
    masterEQ.low.value = val;
}

function setMasterEqMid(val) {
    masterEQ.mid.value = val;
}

function setMasterEqHigh(val) {
    masterEQ.high.value = val;
}

// compressor
function setMasterCompThresh(val) {
    masterCompressor.threshold.rampTo(Math.min(0, val), 0.1);
}

function setMasterCompRatio(val) {
    masterCompressor.ratio.rampTo(val, 0.1);
}

function setMasterCompAttack(val) {
    masterCompressor.attack.rampTo(val, 0.1);
}

function setMasterCompRelease(val) {
    masterCompressor.release.rampTo(val, 0.1);
}

function setMasterCompKnee(val) {
    masterCompressor.knee.rampTo(val, 0.1);
}

// saturator
function setMasterSatDrive(val) {
    masterSaturator.distortion = val;
}

function setMasterSatTone(val) {
    saturatorFilter.frequency.rampTo(val, 0.1);
}

function setMasterSatMix(val) {
    masterSaturator.wet.value = val;
}

// Limiter

function setMasterLimitThresh(val) {
    masterLimiter.threshold.rampTo(Math.min(0, val), 0.05);
}
