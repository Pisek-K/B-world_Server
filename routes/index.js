const authRoutes = require("./auth-route")
const categoryRoutes = require("./category-route")
const productRoutes = require("./product-route")
const userRoutes = require("./user-route")
const adminRoutes = require("./admin-route")
const stripeRoutes = require("./stripe-routes")





module.exports = {
    authRoutes,
    categoryRoutes,
    productRoutes,
    userRoutes,
    adminRoutes,
    stripeRoutes
}