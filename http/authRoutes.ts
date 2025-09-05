import express from "express";
import jwt from "jsonwebtoken";
import { sendEmail } from "./emailService"

const router = express.Router();

router.post("/signup", async(req, res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({msg:"Email is required"})
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {expiresIn:"24h"})
    const link = `http://localhost:5000/api/v1/signin/post?token=${token}`;

    await sendEmail(email, link)

    res.send("check your email for login")
})

router.get("/signin/post", (req, res)=>{
    const { token } = req.query;

    if(!token) return res.status(400).json({msg:"token missing"})
    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET!)
        res.cookie("auth", token, {httpOnly:true, secure:false})
        res.redirect("http://localhost:3000")
    } catch (error) {
        res.status(401).send("Invalid or expired token")
    }
})


export function authMiddleware(req:any, res:any, next:any) {
  const token = req.cookies?.auth;
  if (!token) return res.status(401).send("Not authenticated");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // add user info to request
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token");
  }
}

export default router