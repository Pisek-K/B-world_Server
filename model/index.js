const express = require("express")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const cors = require("cors")
const morgan = require("morgan")
port = process.env.PORT
const bcrypt = require("bcryptjs")
const app = express()
const jwt = require("jsonwebtoken")
const cloudinary = require('cloudinary').v2;



module.exports = {
    express,
    cors,
    morgan,
    port,
    bcrypt,
    prisma,
    app,
    jwt,
    cloudinary
}