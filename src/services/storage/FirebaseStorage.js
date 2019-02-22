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

    constructor() {
        this.storage = null;
    }

    init() {
        this.storage = firebase.storage();
    }

    putFile(path,data,callback=()=>{}) {
        firebase.storage().ref(Config.rootDir+"/"+path).putFile(data)
        .then(() => {
            callback(null);
        })
        .catch((error) => {
            callback(error);
        })
    }

    deleteFile(path,callback=()=>{}) {
        firebase.storage().ref(Config.rootDir+"/"+path).delete().then(()=> callback()).catch(()=> callback());
    }

    getFileUrl(path) {
        return Config.urlPrefix+"/"+encodeURIComponent(Config.rootDir+"/"+path)+"?alt=media"
    }
}

export default FirebaseStorage.getInstance();
