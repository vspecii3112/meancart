module.exports = class Domain {
    constructor() {
    }
    link() {
        return "http://localhost:4200";  // http://localhost:4200 , https://vspecii3112.github.io, http://localhost:49152
    }
    get url() {
        return this.link();
    }
}
