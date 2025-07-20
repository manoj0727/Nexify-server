const nodemailer = require("nodemailer");
const User = require("../../models/user.model");
const EmailVerification = require("../../models/email.model");
const PendingRegistration = require("../../models/pendingRegistration.model");
const { query, validationResult } = require("express-validator");
const { verifyEmailHTML } = require("../../utils/emailTemplates");

const CLIENT_URL = process.env.CLIENT_URL;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

const verifyEmailValidation = [
  query("email").isEmail().normalizeEmail(),
  query("code").isLength({ min: 5, max: 5 }).trim(),
  (req, res, next) => {
    console.log("Raw query params:", req.query);
    console.log("Before validation - Email:", req.query.email, "Code:", req.query.code);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(422).json({ errors: errors.array() });
    }
    console.log("After validation - Email:", req.query.email, "Code:", req.query.code);
    next();
  },
];

const sendVerificationEmail = async (req, res) => {
  const USER = process.env.EMAIL;
  const PASS = process.env.PASSWORD;
  // Use email and name from request object (set by addUser) or from body
  let email = req.userEmail || req.body.email;
  const name = req.userName || req.body.name;
  
  // Normalize email to lowercase
  email = email?.trim().toLowerCase();

  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
  const verificationLink = `${CLIENT_URL}/auth/verify?code=${verificationCode}&email=${email}`;

  console.log("Generated verification code:", verificationCode, "Type:", typeof verificationCode);

  try {
    let transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: USER,
        pass: PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let info = await transporter.sendMail({
      from: `"Nexify" <${USER}>`,
      to: email,
      subject: "Verify your email address",
      html: verifyEmailHTML(name, verificationLink, verificationCode),
    });

    const newVerification = new EmailVerification({
      email,
      verificationCode,
      messageId: info.messageId,
      for: "signup",
    });

    await newVerification.save();
    console.log("Verification saved:", { email, verificationCode });

    res.status(201).json({
      message: `User registered successfully! A verification email has been sent to ${email}. Please verify your email to sign in.`,
    });
  } catch (err) {
    console.error("Email sending error:", err);
    console.log(
      "Could not send verification email. There could be an issue with the provided credentials or the email service."
    );
    // More specific error handling
    if (err.code === 11000) {
      // Duplicate key error - might be from the unique constraint
      console.error("Duplicate verification code generated. This is rare but possible.");
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyEmail = async (req, res, next) => {
  let { code, email } = req.query;
  
  // Trim whitespace and normalize
  code = code?.trim();
  email = email?.trim().toLowerCase();
  
  console.log("Verification attempt:", { code, email, codeType: typeof code });

  try {
    // Check if user already exists (already verified)
    const existingUser = await User.findOne({ email: { $eq: email } });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "Email is already verified" });
    }

    // First, let's check all verifications for this email
    const allVerifications = await EmailVerification.find({ email: { $eq: email } });
    console.log("All verifications for email:", email);
    console.log("Stored verifications:", allVerifications.map(v => ({
      email: v.email,
      code: v.verificationCode,
      codeType: typeof v.verificationCode,
      for: v.for
    })));

    // Check if verification code is valid - ensure both are strings
    const verification = await EmailVerification.findOne({
      email: email,
      verificationCode: code,
      for: "signup"
    });

    if (!verification) {
      console.log("Verification not found.");
      console.log("Looking for - Email:", email, "Code:", code);
      
      // Try to find by just email to debug
      const emailOnly = await EmailVerification.findOne({ email: { $eq: email } });
      if (emailOnly) {
        console.log("Found by email only:", {
          storedCode: emailOnly.verificationCode,
          providedCode: code,
          match: emailOnly.verificationCode === String(code)
        });
      }
      
      return res
        .status(400)
        .json({ message: "Verification code is invalid or has expired" });
    }

    // Find pending registration
    const pendingRegistration = await PendingRegistration.findOne({
      email: { $eq: email },
    });

    if (!pendingRegistration) {
      return res
        .status(400)
        .json({ message: "Registration has expired. Please sign up again." });
    }

    // Create the actual user from pending registration
    const newUser = new User({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      password: pendingRegistration.hashedPassword,
      role: pendingRegistration.role,
      avatar: pendingRegistration.avatar,
      isEmailVerified: true,
    });

    await newUser.save();

    // Clean up temporary data
    await Promise.all([
      EmailVerification.deleteMany({ email: { $eq: email } }).exec(),
      PendingRegistration.deleteOne({ email: { $eq: email } }).exec(),
    ]);

    req.userId = newUser._id;
    req.email = newUser.email;
    next();
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resendVerificationEmail = async (req, res) => {
  const USER = process.env.EMAIL;
  const PASS = process.env.PASSWORD;
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  
  // Normalize email to lowercase
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check if user already exists (already verified)
    const existingUser = await User.findOne({ email: { $eq: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Find pending registration to get the name
    const pendingRegistration = await PendingRegistration.findOne({
      email: { $eq: normalizedEmail },
    });

    if (!pendingRegistration) {
      return res
        .status(400)
        .json({ message: "No pending registration found. Please sign up again." });
    }

    // Delete any existing verification codes for this email
    await EmailVerification.deleteMany({ email: { $eq: normalizedEmail } });

    // Generate new verification code
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    const verificationLink = `${CLIENT_URL}/auth/verify?code=${verificationCode}&email=${normalizedEmail}`;

    // Send email
    let transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: USER,
        pass: PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let info = await transporter.sendMail({
      from: `"Nexify" <${USER}>`,
      to: normalizedEmail,
      subject: "Verify your email address",
      html: verifyEmailHTML(pendingRegistration.name, verificationLink, verificationCode),
    });

    // Save new verification code
    const newVerification = new EmailVerification({
      email: normalizedEmail,
      verificationCode,
      messageId: info.messageId,
      for: "signup",
    });

    await newVerification.save();

    res.status(200).json({
      message: `Verification email has been resent to ${normalizedEmail}. Please check your inbox.`,
    });
  } catch (err) {
    console.error("Email resend error:", err);
    res.status(500).json({ message: "Failed to resend verification email" });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  verifyEmailValidation,
  resendVerificationEmail,
};
