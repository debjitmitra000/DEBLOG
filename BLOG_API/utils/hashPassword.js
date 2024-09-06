const bcrypt = require('bcryptjs')

const hashedPassword = (password) =>{
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(5,(error,salt)=>{
            if(error){
                return reject(error);
            }
            bcrypt.hash(password,salt,(error,hash)=>{
                if(error){
                    return reject(error)
                }
                resolve(hash);
            })
        })
    })
}

module.exports = hashedPassword;