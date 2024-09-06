function generate12Code() {
    let number = Math.floor(Math.random() * 1000000000000);

    const code = String(number).padStart(12, '0');

    return code;
}

module.exports = generate12Code;
