require('dotenv').config()
const User = require('../config/models/user')
const nodemailer = require('nodemailer')

const sendOTPCode = async (user, res) => {
  try {

    //Generate 4 random digits as OTP 
    const randomCode = Math.floor(1000 + Math.random() * 9000)
    user.token = randomCode
    user.save()

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'healthconnect34@gmail.com',
        pass: process.env.PASS
      }
    })

    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #34c759;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 0 0 5px 5px;
          }
          .otp-code {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            color: #34c759;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: #777;
          }
        </style>
      </head>
      <body>
      <table class="email-container" cellpadding="0" cellspacing="0" border="0">
        <tr>
        <td class="header">
            <h2>Your Verification Code</h2>
        </td>
        </tr>
        <tr>
        <td class="content">
            <p>Hello,</p>
            <p>Thank you for signing up. Here is your OTP code for verification:</p>
            
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center">
                <div class="otp-code">${randomCode}</div>
                </td>
            </tr>
            </table>
            
            <p>This code will expire in 15 minutes. Please do not share this code with anyone.</p>
            <p>If you didn't request this code, please ignore this email.</p>
        </td>
        </tr>
        <tr>
        <td class="footer">
          <p>&copy; ${new Date().getFullYear()} Health Connect | All rights reserved.</p>
        </td>
        </tr>
      </table>
      </body>
      </html>
    `
  try {
    await transporter.sendMail({
      to: user.email,
      subject: 'Verify Health Connect Account',
      html: message
    })
    res.status(201).json({
      linkSent: true, 
      id: user._id, 
      email: user.email,
      message: 'Verification link has been sent to your email, kindly check your inbox, or spam to complete the signup process'
    })
  } catch(err) {
    await User.findByIdAndDelete(user._id)
    res.status(500).json({ message: 'Verification link could not be sent, try again later'})
  }
  } catch(err) {  
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = sendOTPCode
