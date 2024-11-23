const errorMiddleware = require("./error-middleware")
const notFound = require("./not-found")
const {auth,checkAdmin} = require("./authenticate")



module.exports = {
    errorMiddleware,
    notFound,
    auth,
    checkAdmin
}