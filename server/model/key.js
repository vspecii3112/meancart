module.exports = class Key {
    constructor() {
    }
    sendgrid() {
        return "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";
    }
    get getsendgridKey() {
        return this.sendgrid();
    }

    stripe() {
        return "sk_test_BQokikJOvBiI2HlWgH4olfQ2";
    }

    get getstripeKey() {
        return this.stripe();
    }
}