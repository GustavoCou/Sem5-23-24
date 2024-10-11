export default class TaskError extends Error {
    constructor(message) {
        super(message);
        this.name = message;
    }
}