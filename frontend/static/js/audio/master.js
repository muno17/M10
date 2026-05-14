////////////////////////// Master Audio Chain \\\\\\\\\\\\\\\\\\\\\\\\\\

export class Master {
    constructor() {
        this.volNode = null;
        this.compressor = null;
        this.eq = null;
        this.saturator = null;
        this.saturatorFilter = null;
        this.limiter = null;
        this.reverb = null;
        this.reverbWidener = null;
        this.reverbHeat = null;
        this.reverbLimiter = null;
    }

    initChain() {
        // master volume
        this.volNode = new Tone.Gain(1);

        // init master effects
        this.eq = new Tone.EQ3(0, 0, 0);
        this.compressor = new Tone.Compressor(-24, 3);
        this.saturator = new Tone.Distortion(0);
        this.saturatorFilter = new Tone.Filter(20000, "lowpass");
        this.limiter = new Tone.Limiter(-1);


        // chain master audio and send to main output
        this.eq.chain(
            this.compressor,
            this.saturator,
            this.saturatorFilter,
            this.volNode,
            this.limiter,
            Tone.Destination,
        );
    }

    // chain together effects to create a master reverb bus
    async initReverbBus() {
        // dirt
        this.reverbHeat = new Tone.Chebyshev(10);
        this.reverbHeat.wet.value = 0.05;

        this.reverb = new Tone.Reverb({
            decay: 3,
            preDelay: 0.01,
            wet: 1.0
        });

        // width
        this.reverbWidener = new Tone.StereoWidener(0.3);
        this.reverbLimiter = new Tone.Limiter(-3);

        // chain effects from reverb bus together and send to masterEQ
        this.reverbHeat.chain(this.reverb, this.reverbWidener, this.reverbLimiter, this.eq);

        await this.reverb.generate();
    }

    setVolume(val) { this.volNode.gain.rampTo(Tone.dbToGain(val), 0.1); }

    // reverb
    setDirt(val) { this.reverbHeat.order = Math.floor(val); }
    setDirtMix(val) { this.reverbHeat.wet.value = val; }
    async setSpace(val) { this.reverb.decay = val > 0 ? val : 0.001; await this.reverb.generate(); }
    setPredelay(val) { this.reverb.preDelay = val; }
    setReverbWidth(val) { this.reverbWidener.width.rampTo(val, 0.1); }

    // eq
    setEqLow(val) { this.eq.low.value = val; }
    setEqMid(val) { this.eq.mid.value = val; }
    setEqHigh(val) { this.eq.high.value = val; }

    // compressor
    setCompThresh(val) { this.compressor.threshold.rampTo(Math.min(0, val), 0.1); }
    setCompRatio(val) { this.compressor.ratio.rampTo(val, 0.1); }
    setCompAttack(val) { this.compressor.attack.rampTo(val, 0.1); }
    setCompRelease(val) { this.compressor.release.rampTo(val, 0.1); }
    setCompKnee(val) { this.compressor.knee.rampTo(val, 0.1); }

    // saturator
    setSatDrive(val) { this.saturator.distortion = val; }
    setSatTone(val) { this.saturatorFilter.frequency.rampTo(val, 0.1); }
    setSatMix(val) { this.saturator.wet.value = val; }
}

// master singleton
export const master = new Master();
