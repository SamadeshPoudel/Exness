import express from "express"
import authRoutes from "./authRoutes.ts"

const app =  express()
const port = 5000
app.use(express.json());
app.use("/api/v1", authRoutes)
app.get('/', (req, res)=>{
    res.send("Hello from express")
})

app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`)
})