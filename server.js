require("dotenv").config();
const {express,app,morgan,cors,port}  = require("./model")
const {authRoutes,categoryRoutes,productRoutes,userRoutes, adminRoutes,stripeRoutes} = require("./routes")
const {notFound,errorMiddleware} = require("./middlewares")


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE","PATCH"],
    credentials: true,
}));
app.use(express.json({limit:"20mb"}));
app.use(morgan("dev"));



app.use("/auth",authRoutes)
app.use("/category",categoryRoutes)
app.use("/product",productRoutes)
app.use("/user",userRoutes)
app.use("/admin",adminRoutes)
app.use("/checkout",stripeRoutes)


app.use("*", notFound);
app.use(errorMiddleware);


app.listen(port,()=>console.log(`server is running on port ${port}`))