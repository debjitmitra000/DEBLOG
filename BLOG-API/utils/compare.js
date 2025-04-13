const bcrypt = require('bcryptjs')

const comparePassword = (password,hasPass)=>{
    return bcrypt.compare(password,hasPass);
}

module.exports = comparePassword