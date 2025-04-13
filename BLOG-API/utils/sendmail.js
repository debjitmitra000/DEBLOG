const nodemailer  = require('nodemailer');
const {senderEmail,senderPassword} = require("../config/keys")

const sendEmail = async({emailTo,subject,code,content,senderName}) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth : {
            user : senderEmail,
            pass: senderPassword,
        }
    });

    const message = {
        to: emailTo,
        subject,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Code Email</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    h1 {
                        color: #007bff;
                    }
                    .code-block {
                        background-color: #f1f1f1;
                        border: 1px solid #ccc;
                        padding: 10px;
                        margin: 20px 0;
                        white-space: pre-wrap;
                        overflow-x: auto;
                        border-radius: 5px;
                    }
                    .code-block code {
                        color: #d63384;
                        font-size: 60px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Hello ${senderName}</h3>
                    <h3>Here Is The Code You Requested To ${content}:</h4>
                    <div class="code-block">
                        <pre align="center"><code>${code}</code></pre>
                    </div>
                    <h3>Thank You</h3>
                    <div class="footer">
                        <h4>This Email Was Sent From DEBLOG</h4>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(message);
}

module.exports = sendEmail;