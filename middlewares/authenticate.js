const {jwt, prisma} = require("../model")
const createError = require("../utils/create-error")

exports.auth = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return createError(401, "Unauthorized");
      }
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          console.log("check error",err)
          return createError(401, "Unauthorized");
        }
        req.user = decode;
      });
      const user = await prisma.user.findFirst({
        where:{
            email: req.user.email
        }
      })
      if(!user.enabled){
        return createError(401,"This account can't access")
      }
      next();
    } catch (err) {
      next(err);
    }
  };

exports.checkAdmin = async (req,res,next) => {
    try {
        const {email} = req.user
        console.log(email)

        const adminUser = await prisma.user.findFirst({
            where:{
                email: email
            }
        })

        if(!adminUser || adminUser.role !== "ADMIN"){
           return createError(403,"Access Denied admin only")
        }

        next()
    } catch (err) {
        next(err)
    }
}


