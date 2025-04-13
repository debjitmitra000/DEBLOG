const isAdmin = (req,res,next)=>{
    try {
        if (req.user.role === 1 || req.user.role === 2) {
            next();
        }else{
            res.code = 400;
            throw new Error("Permission Denied");
        }
    } catch (error) {
       next(error); 
    }
}

module.exports = isAdmin;