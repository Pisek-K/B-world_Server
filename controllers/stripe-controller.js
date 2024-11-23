const { prisma } = require("../model");
const createError = require("../utils/create-error");


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.getConfig = (req,res,next)=>{
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    })
}

exports.createPayment = async (req,res,next)=>{
    try {
        const cart = await prisma.cart.findFirst({
            where:{
              orderedById : req.user.id
            }
          })
          const amountTHB = cart.cartTotal * 100

        const paymentIntent = await stripe.paymentIntents.create({
            amount : amountTHB,
            currency: "thb",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
            
        })
    } catch (error) {
        next(error)
    }
}