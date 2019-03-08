module.exports = function (rules = {}) {
    this.rules = {
        email: {
            regex: /^[a-z.0-9]+@[\w-]+?(\.[a-z]{2,})+$/,
            onInvalid: "Wrong email format!"
        },
        password: {
            regex: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
            onInvalid: "Your password must contain 8 characters or more and at least one uppercase letter and one number"
        },
        ...rules
    };

    this.validate = (inputs) => {
        let isValid = { result: true };
        inputs.forEach(({ value, rule }) => {
            const { regex, onInvalid } = this.rules[rule];
            if (!regex) {
                isValid = { result: null, reason: `${rule}'s regex is not defined.` };
                return null;
            }
            if (!regex.test(value)) {
                isValid = { result: false, reason: onInvalid };
                return false;
            }
        });
        return isValid;
    }
};