require('dotenv').config();
const mongoose = require('mongoose');
const EmailVerification = require('./models/email.model');
const PendingRegistration = require('./models/pendingRegistration.model');

async function debugVerification() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database');

    // Get all email verifications
    const verifications = await EmailVerification.find({});
    console.log('\n=== All Email Verifications ===');
    verifications.forEach(v => {
      console.log({
        email: v.email,
        code: v.verificationCode,
        codeType: typeof v.verificationCode,
        for: v.for,
        createdAt: v.createdAt,
        messageId: v.messageId
      });
    });

    // Get all pending registrations
    const pendingRegs = await PendingRegistration.find({});
    console.log('\n=== All Pending Registrations ===');
    pendingRegs.forEach(p => {
      console.log({
        email: p.email,
        name: p.name,
        createdAt: p.createdAt
      });
    });

    // Test specific lookup
    if (verifications.length > 0) {
      const testEmail = verifications[0].email;
      const testCode = verifications[0].verificationCode;
      
      console.log('\n=== Testing Lookup ===');
      console.log('Testing with:', { email: testEmail, code: testCode });
      
      // Test exact match
      const found = await EmailVerification.findOne({
        email: { $eq: testEmail },
        verificationCode: { $eq: testCode }
      });
      console.log('Found with exact match:', !!found);
      
      // Test with string conversion
      const foundString = await EmailVerification.findOne({
        email: { $eq: testEmail },
        verificationCode: { $eq: testCode.toString() }
      });
      console.log('Found with toString:', !!foundString);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

debugVerification();