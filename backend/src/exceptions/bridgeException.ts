export default class BridgeError extends Error {
    constructor(message) {
        super(message);
        this.name = message;
    }
}