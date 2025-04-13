function generateCode() {
    let number = Math.floor(Math.random() * 1000000);
    
    const code = String(number).padStart(6, '0');

    return code;
}

module.exports = generateCode;
