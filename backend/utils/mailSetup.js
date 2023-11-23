const nodemailer = require("nodemailer");

// Create a test account on Ethereal
async function createTestAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return testAccount;
  } catch (err) {
    console.error("Error creating a test account:", err);
    throw err;
  }
}

// Send an email using Nodemailer with Ethereal
async function sendEmail(toEmail, subject, text, fromEmail = undefined) {
  try {
    // Create a test account
    const testAccount = await createTestAccount();

    // Create a Nodemailer transporter with the test SMTP server details
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // false for TLS
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Define the email data
    const mailOptions = {
      from: fromEmail ?? testAccount.user,
      to: toEmail,
      subject: subject,
      text: text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error sending the email:", err);
  }
}

// Call the sendEmail function to send the test email
module.exports = sendEmail;
