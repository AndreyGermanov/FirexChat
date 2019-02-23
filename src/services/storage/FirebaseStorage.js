import firebase from 'react-native-firebase';
import Config from '../../config/firebase_storage';

/**
 * Service provides interface to Firebase Storage
 */
class FirebaseStorage {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!FirebaseStorage.instance) FirebaseStorage.instance = new FirebaseStorage();
        return FirebaseStorage.instance;
    }

    /**
     * Class constructor
     */
    constructor() {
        this.storage = null;
    }

    /**
     * Initialization method
     */
    init() {
        this.storage = firebase.storage();
    }

    /**
     * Method used to upload specified file data to storage
     * @param path - Path to file in storage
     * @param data - Data to store to this file (Uri to local file)
     * @param callback - Function runs when operation finished
     */
    putFile(path,data,callback=()=>{}) {
        firebase.storage().ref(Config.rootDir+"/"+path).putFile(data)
        .then(() => {
            callback(null);
        })
        .catch((error) => {
            callback(error);
        })
    }

    /**
     * Method used to delete specified file from storage
     * @param path - Path to file in storage
     * @param callback - Function runs when operation finished
     */
    deleteFile(path,callback=()=>{}) {
        firebase.storage().ref(Config.rootDir+"/"+path).delete().then(()=> callback()).catch(()=> callback());
    }

    /**
     * Method return absolute URL of specified file in storage
     * @param path - Name of file
     * @returns Full URL to specified file
     */
    getFileUrl(path) {
        return Config.urlPrefix+"/"+encodeURIComponent(Config.rootDir+"/"+path)+"?alt=media"
    }
}

export default FirebaseStorage.getInstance();
