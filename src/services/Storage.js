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

    /**
     * Class constructor
     */
    constructor() {
        this.engine = null;
    }

    /**
     * Initialization method. Binds storage backend depending on specified type in configuration file
     */
    init() {
        switch(Config.backend) {
            case "firebase_storage":
                this.engine = FirebaseStorage;
                break;
        }
        if (this.engine) this.engine.init();
    }

    /**
     * Method used to upload file to storage
     * @param path - Path to resulting file in storage
     * @param data - File data to upload
     * @param callback - Function runs after operation completes
     */
    putFile(path,data,callback) { this.engine.putFile(path,data,callback); }

    /**
     * Method used to delete file from storage
     * @param path - Path to file in storage to delete
     * @param callback - Function runs after operation completes
     */
    deleteFile(path,callback) { this.engine.deleteFile(path,callback); }

    /**
     * Method retuns absolute URL to specified file in storage
     * @param path - Path to file in storage
     * @returns Absolute public URL for specified file
     */
    getFileUrl(path) { return this.engine.getFileUrl(path); }
}

export default Storage.getInstance();