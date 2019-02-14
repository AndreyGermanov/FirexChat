class Auth {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!Auth.instance) Auth.instance = new Auth();
        return Auth.instance;
    }
};

export default Auth.getInstance();