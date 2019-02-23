import Sound from 'react-native-sound';
import async from 'async';

/**
 * Service used to manage Audio playing
 */
class Audio {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!Audio.instance) Audio.instance = new Audio();
        return Audio.instance;
    }

    /**
     * Class constructor
     */
    constructor() {
        this.sound = null;
        this.intervals = {}
    }

    /**
     * Method used to play specified file single time
     * @param fileName - Name of file to play
     * @param callback - Function runs when operation finished
     */
    play(fileName,callback=()=>{}) {
        async.series([
            (callback) => {
                if (this.sound) this.stop(callback); else callback();
            },
            (callback) => {
                this.sound = new Sound(fileName, Sound.MAIN_BUNDLE, () => {
                    if (this.sound) this.sound.play((success) => callback(success)); else callback();
                });
            }
        ], () => callback())
    }

    /**
     * Method used to stop current play
     * @param callback - Function runs when operation finished
     */
    stop(callback=()=>{}) {
        if (this.sound) {
            this.sound.stop(callback);
            this.sound = null;
        }
    }

    /**
     * Method used to play specified file in a loop
     * @param fileName - Name of file to play
     * @param loopInterval - Loop interval in milliseconds
     */
    playLoop(fileName,loopInterval) {
        if (!this.intervals[fileName]) this.intervals[fileName] = setInterval(() => {
            this.play(fileName);
        }, loopInterval);
    }

    /**
     * Method used to stop and remove already started play loop.
     * @param fileName - Name of file, for which loop was started. If no filename provided, then stops and removes
     * all loops
     */
    stopLoop(fileName=null) {
        this.stop();
        if (!fileName) {
            for (let interval in this.intervals) this.stopLoop(interval);
            return;
        }
        if (this.intervals[fileName] && typeof(this.intervals[fileName]) !== "undefined") {
            clearInterval(this.intervals[fileName]);
            delete this.intervals[fileName];
        }
    }
}

export default Audio.getInstance();