////////////////////////// Tracks \\\\\\\\\\\\\\\\\\\\\\\\\\

class Track {
    constructor(trackData, master) {
        this.instrument = null;
        this.playStart = null;
        this.panVol = null;
        this.ampEnv = null;
        this.lpFilter = null;
        this.hpFilter = null;
        this.distortion = null;
        this.bitcrusher = null;
        this.chorus = null;
        this.tremolo = null;
        this.delay = null;
        this.reverbSend = null;

        this.initChain(trackData, master);
    }

    initChain(trackData, master) {
        this.instrument = new Tone.Player({
            url: null,
            autostart: false,
            fadeOut: "32n",
        });

        this.ampEnv = new Tone.AmplitudeEnvelope({
            attack: trackData.attack,
            decay: trackData.decay,
            sustain: trackData.sustain,
            release: trackData.release,
        });

        this.lpFilter = new Tone.Filter(trackData.lpWidth, "lowpass");
        this.hpFilter = new Tone.Filter(trackData.hpWidth, "highpass");

        this.distortion = new Tone.Distortion({
            distortion: trackData.distortion,
            wet: 1,
        });

        this.bitcrusher = new Tone.BitCrusher({
            bits: 4,
            wet: trackData.bitcrusher,
        });

        this.chorus = new Tone.Chorus(4, 2.5, 0.5);
        this.chorus.wet.value = trackData.chorusMix;

        this.tremolo = new Tone.Tremolo(5, 0.75);
        this.tremolo.wet.value = trackData.tremMix;

        this.delay = new Tone.FeedbackDelay("8n", trackData.delFback);
        this.delay.wet.value = trackData.delMix;

        // reverbSend is a side bus (delay -> reverbSend -> master.reverbHeat),
        // it is NOT in the main chain below
        this.reverbSend = new Tone.Gain(trackData.reverb);
        this.delay.connect(this.reverbSend);
        this.reverbSend.connect(master.reverbHeat);

        this.panVol = new Tone.PanVol(trackData.pan, trackData.volume);

        this.instrument.chain(
            this.ampEnv,
            this.lpFilter,
            this.hpFilter,
            this.distortion,
            this.bitcrusher,
            this.chorus,
            this.tremolo,
            this.delay,
            this.panVol,
            master.eq, // final destination
        );

        this.setMute(trackData.muted);
    }

    setMute(bool) { this.muted = bool; this.panVol.mute = bool; }

    setVolume(val, instant = false) {
        if (this.muted) return;
        if (instant) {
            this.panVol.volume.value = val;
        } else {
            this.panVol.volume.rampTo(val, 0.05);
        }
    }

    setPan(val, instant = false) {
        if (instant) {
            this.panVol.pan.value = val;
        } else {
            this.panVol.pan.rampTo(val, 0.05);
        }
    }

    setPitch(val) {
        const rate = Math.pow(2, val / 12);
        this.instrument.playbackRate = rate;
    }

    setStart(val) { this.playStart = val; }
    setAttack(val) { this.ampEnv.attack = val; }
    setDecay(val) { this.ampEnv.decay = val; }
    setSustain(val) { this.ampEnv.sustain = val; }
    setRelease(val) { this.ampEnv.release = val; }

    setLpWidth(val) { this.lpFilter.frequency.rampTo(val, 0.05); }
    setLpQ(val) { this.lpFilter.Q.rampTo(val, 0.05); }
    setHpWidth(val) { this.hpFilter.frequency.rampTo(val, 0.05); }
    setHpQ(val) { this.hpFilter.Q.rampTo(val, 0.05); }

    setDistortion(val) { this.distortion.distortion = val; }
    setBitcrusher(val) { this.bitcrusher.wet.value = val; }
    setReverbSend(val) { this.reverbSend.gain.rampTo(val, 0.05); }

    setChorusRate(val) { this.chorus.frequency.value = val; }
    setChorusDepth(val) { this.chorus.depth = val; }
    setChorusMix(val) { this.chorus.wet.value = val; }

    setTremoloRate(val) { this.tremolo.frequency.value = val; }
    setTremoloDepth(val) { this.tremolo.depth.value = val; }
    setTremoloMix(val) { this.tremolo.wet.value = val; }

    setDelayTime(val) { this.delay.delayTime.rampTo(val, 0.05); }
    setDelayFeedback(val) { this.delay.feedback.rampTo(val, 0.05); }
    setDelayMix(val) { this.delay.wet.value = val; }

    loadSample(url) { return this.instrument.load(url); }
    startLFOs() { this.chorus.start(); this.tremolo.start(); }
}

const tracks = [];

function initTracks() {
    for (let i = 0; i < 10; i++) {
        tracks.push(new Track(currentData.tracks[i], master));
    }
}
