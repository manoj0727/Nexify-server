const nodemailer = require("nodemailer");
const SuspiciousLogin = require("../../models/suspiciousLogin.model");
const UserContext = require("../../models/context.model");
const EmailVerification = require("../../models/email.model");
const { query, validationResult } = require("express-validator");
const { verifyLoginHTML } = require("../../utils/emailTemplates");
const { createEmailTransporter, getBaseUrl } = require("../../config/deployment");

const CLIENT_URL = getBaseUrl();

const verifyLoginValidation = [
  query("email").isEmail().normalizeEmail(),
  query("id").isLength({ min: 24, max: 24 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
const sendLoginVerificationEmail = async (req, res) => {
  const currentContextData = req.currentContextData;
  const { email, name } = req.user;

  const id = currentContextData.id;
  const verificationLink = `${CLIENT_URL}/verify-login?id=${id}&email=${email}`;
  const blockLink = `${CLIENT_URL}/block-device?id=${id}&email=${email}`;

  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.error("Email service not configured for login verification.");
      // Store the suspicious login but can't send email
      const suspiciousLogin = new SuspiciousLogin({
        ...currentContextData,
        status: "email_failed"
      });
      await suspiciousLogin.save();
      
      return res.status(200).json({
        message: "Login from new device detected. Email service not configured. Please contact support.",
        requiresManualVerification: true,
        suspiciousLoginId: id
      });
    }

    let info = await transporter.sendMail({
      from: `"Nexify" <${process.env.EMAIL}>`,
      to: email,
      subject: "Action Required: Verify Recent Login",
      html: verifyLoginHTML(
        name,
        verificationLink,
        blockLink,
        currentContextData
      ),
    });

    const newVerification = new EmailVerification({
      email,
      verificationCode: id,
      messageId: info.messageId,
      for: "login",
    });

    await newVerification.save();

    res.status(401).json({
      message: `Access blocked due to suspicious activity. Verification email was sent to your email address.`,
    });
  } catch (err) {
    console.log(
      "Could not send email. There could be an issue with the provided credentials or the email service."
    );
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyLogin = async (req, res) => {
  const { id, email } = req.query;

  try {
    const suspiciousLogin = await SuspiciousLogin.findById(id);

    if (!suspiciousLogin || suspiciousLogin.email !== email) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    const newContextData = new UserContext({
      user: suspiciousLogin.user,
      email: suspiciousLogin.email,
      ip: suspiciousLogin.ip,
      city: suspiciousLogin.city,
      country: suspiciousLogin.country,
      device: suspiciousLogin.device,
      deviceType: suspiciousLogin.deviceType,
      browser: suspiciousLogin.browser,
      os: suspiciousLogin.os,
      platform: suspiciousLogin.platform,
    });

    await newContextData.save();
    await SuspiciousLogin.findOneAndUpdate(
      { _id: { $eq: id } },
      { $set: { isTrusted: true, isBlocked: false } },
      { new: true }
    );

    res.status(200).json({ message: "Login verified" });
  } catch (err) {
    res.status(500).json({ message: "Could not verify your login" });
  }
};

const blockLogin = async (req, res) => {
  const { id, email } = req.query;

  try {
    const suspiciousLogin = await SuspiciousLogin.findById(id);

    if (!suspiciousLogin || suspiciousLogin.email !== email) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    await SuspiciousLogin.findOneAndUpdate(
      { _id: { $eq: id } },
      { $set: { isBlocked: true, isTrusted: false } },
      { new: true }
    );

    res.status(200).json({ message: "Login blocked" });
  } catch (err) {
    res.status(500).json({ message: "Could not block your login" });
  }
};

module.exports = {
  verifyLoginValidation,
  sendLoginVerificationEmail,
  verifyLogin,
  blockLogin,
};
