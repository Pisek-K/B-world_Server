const { prisma } = require("../model");
const createError = require("../utils/create-error");

exports.listUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        address: true,
      },
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const { id, enabled } = req.body;
    const user = await prisma.user.update({
      where: {
        id: +id,
      },
      data: {
        enabled: enabled,
      },
    });
    res.send("Update status successfully");
  } catch (err) {
    next(err);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;
    const user = await prisma.user.update({
      where: {
        id: +id,
      },
      data: {
        role: role,
      },
    });
    res.send("Update role successfully");
  } catch (err) {
    next(err);
  }
};

exports.userCart = async (req, res, next) => {
  try {
    const { cart } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        id: +req.user.id,
      },
    });

    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user.id,
        },
      },
    });

    await prisma.cart.deleteMany({
      where: {
        orderedById: user.id,
      },
    });

    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    let cartTotal = products.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );
    const newCart = await prisma.cart.create({
      data: {
        products: {
          create: products,
        },
        cartTotal: cartTotal,
        orderedById: user.id,
      },
    });
    console.log("check",newCart);
    res.send("Add cart ok");
  } catch (err) {
    next(err);
  }
};

exports.getUserCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: +req.user.id,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    res.json({
      products: cart.products,
      cartTotal: cart.cartTotal,
    });
  } catch (err) {
    console.error("Error in getUserCart:", err);
    next(createError(500, "An error occurred while fetching the user's cart"));
  }
};

exports.emptyCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: +req.user.id,
      },
    });
    if (!cart) {
      return createError(400, "No cart");
    }

    await prisma.productOnCart.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    const result = await prisma.cart.deleteMany({
      where: {
        orderedById: +req.user.id,
      },
    });

    res.json({
      message: "Cart deleted successfully",
      deletedCount: result.count,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { address , name } = req.body;
    const userId = req.user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { address: address , name: name},
    });

    res.status(200).json({
      message: "Address updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.saveOrder = async (req, res, next) => {
  try {
    const { id, amount, status, currency , clientSecret} = req.body.paymentIntent;
    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: +req.user.id,
      },
      include: {
        products: true,
      },
    });
    if (!userCart || userCart.products.length === 0) {
      return createError(400, "Cart is empty");
    }

    // for (const item of userCart.products) {
    //     const product = await prisma.product.findUnique({
    //         where: { id: item.productId },
    //         select: { quantity: true, title: true }
    //     })
    //     if (!product || item.count > product.quantity) {
    //         return res.status(400).json({
    //             ok: false,
    //             message: `Sorry ${product?.title || 'product'} out of stock`
    //         })
    //     }
    // }
    const amountTHB = Number(amount) / 100
    
    const order = await prisma.order.create({
      data: {
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
        orderedBy: {
          connect: { id: req.user.id },
        },
        cartTotal: userCart.cartTotal,
        stripePaymentId: id,
        amount: amountTHB,
        status: status,
        currency: currency,
      },
    });

    const update = userCart.products.map((item) => ({
      where: { id: item.productId },
      data: {
        quantity: { decrement: item.count },
        sold: { increment: item.count },
      },
    }));

    await Promise.all(update.map((updated) => prisma.product.update(updated)));

    await prisma.cart.deleteMany({
      where: {
        orderedById: +req.user.id,
      },
    });


    res.json({ ok: true, order });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    console.log('Fetching orders for user ID:', userId);
    const orders = await prisma.order.findMany({
      where: {
        orderedById: userId,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },orderBy: {
        createdAt: 'desc',  
      },
    });
    if(orders.length === 0 ){
        return createError(400,"No order")
    }
    res.json({orders})
  } catch (err) {
    next(err);
  }
};

