module.exports = class Key {
    constructor() {
    }
    sendgrid() {
        return "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";
    }
    stripe() {
        return "sk_test_BQokikJOvBiI2HlWgH4olfQ2";
    }
    openexchangerates() {
        return "85e741570c834f5690de4ff736a25977";
    }
    get getsendgridKey() {
        return this.sendgrid();
    }

    get getstripeKey() {
        return this.stripe();
    }

    get getopenexchangeratesKey() {
        return this.openexchangerates();
    }
}