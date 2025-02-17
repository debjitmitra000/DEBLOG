const errorHandler = (error,req,res,next)=>{
    const code = res.code ? res.code : 500;
    res.status(code).json({code,status:false,message:error.message})
};

module.exports = errorHandler;