class Database {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!Database.instance) Signalling.instance = new Database();
        return Database.instance;
    }
};

export default Database.getInstance();