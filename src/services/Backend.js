import Auth from './Auth';
import Database from './Database';
import VideoChat from './VideoChat';
import Storage from './Storage';

/**
 * Root service, which provides access to controllers to all backend services:
 * Database, Authentication, VideoChat, Storage
 */
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

    /**
     * Class constructor
     */
    constructor() {
        this.db = Database;
        this.auth = Auth;
        this.videoChat = VideoChat;
        this.storage = Storage;
    }

    /**
     * Initialization method
     */
    init() {
       Auth.init();
       Storage.init();
       VideoChat.init();
    }
}

export default Backend.getInstance();