const {prisma} = require("../model")

exports.changeOrderStatus = async (req, res, next) => {
  try {
    const { orderId, orderStatus } = req.body;
    const orderUpdate = await prisma.order.update({
        where:{
            id: orderId
        },
        data:{
            orderStatus: orderStatus
        }
    })
    res.send(orderUpdate);
  } catch (err) {
    next(err);
  }
};

exports.getOrderAdmin = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
        include:{
            products:{
                include:{
                    product:true
                }
            },
            orderedBy:{
                select:{
                    id:true,
                    email:true,
                    address:true,
                }
            }
        }
    })
    res.send(orders);
  } catch (err) {
    next(err);
  }
};
