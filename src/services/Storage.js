import Config from '../config/storage';
import FirebaseStorage from './storage/FirebaseStorage'

/**
 * Service provides functions to manage files in external cloud storage
 */
class Storage {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!Storage.instance) Storage.instance = new Storage();
        return Storage.instance;
    }

    constructor() {
        this.engine = null;
    }

    init() {
        switch(Config.backend) {
            case "firebase_storage":
                this.engine = FirebaseStorage;
                break;
        }
        if (this.engine) this.engine.init();
    }

    putFile(path,data,callback) { this.engine.putFile(path,data,callback); }

    deleteFile(path,callback) { this.engine.deleteFile(path,callback); }

    getFileUrl(path) { return this.engine.getFileUrl(path); }
}

export default Storage.getInstance();