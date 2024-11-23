const createError = require("../utils/create-error");
const { prisma, bcrypt, jwt } = require("../model");

exports.loginGoogle = async (req, res, next) => {
  try {
    console.log("check body -->",req.body)
    const { email, name, picture } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    console.log(user)
    let newUser = null;
    if(user){
       newUser = await prisma.user.update({
        where: {
          email: email,
        },data: {
          email: email,
          name: name,
          picture: picture,
        }
      });

    }else{

       newUser = await prisma.user.create({
      data: {
          email: email,
          name: name,
          picture: picture,
        }
      });
    }
    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      address: newUser.address,
      name: newUser.name,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          return createError(500, "Server Error");
        }
        res.json({ payload, token });
      }
    );


  }catch(err){
    next(err)
  }
}

exports.register = async (req, res, next) => {
  try {
    const { email, password  } = req.body;
    if (!email) {
      return createError(400, "Email is require");
    }
    if (!password) {
      return createError(400, "Password is require");
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      return createError(400, "Email already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    console.log(hashedPassword);
    res.status(200).json("Register successfully");
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user || !user.enabled) {
      return createError(400, "User not found or not enable");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return createError(400, "Password is invalid");
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      address: user.address,
      name: user.name,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          return createError(500, "Server Error");
        }
        res.json({ payload, token });
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.currentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
      select:{
        id: true,
        email: true,
        name: true,
        role:true,
        address:true,
      }
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};
