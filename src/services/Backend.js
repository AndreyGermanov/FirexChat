import Auth from './Auth';
import Database from './Database';
import VideoChat from './VideoChat';

class Backend {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!Backend.instance) Backend.instance = new Backend();
        return Backend.instance;
    }

    constructor() {
        this.db = Database;
        this.videoChat = VideoChat;
        this.auth = Auth;
    }
};

export default Backend.getInstance();