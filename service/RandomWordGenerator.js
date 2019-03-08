module.exports = ({ min = 6, max = 12 } = {}) => {
    const wordLength = rng(min, max);
    const charCodeArray = Array(wordLength).fill().map(() => rng(97, 122));
    return String.fromCharCode(...charCodeArray);
};

function rng(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}