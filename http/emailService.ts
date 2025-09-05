import nodemailer from "nodemailer"

export async function sendEmail(to:any, link:any) {
    let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Login Link",
    text: `Click here to login: ${link}`
  });
}
