require('dotenv').config();
const mongoose = require('mongoose');

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database');

    const db = mongoose.connection.db;
    const collection = db.collection('emails'); // EmailVerification collection

    // List current indexes
    console.log('\nCurrent indexes:');
    const indexes = await collection.listIndexes().toArray();
    indexes.forEach(index => {
      console.log(index);
    });

    // Check if there's a unique index on verificationCode
    const hasUniqueCodeIndex = indexes.some(idx => 
      idx.key && idx.key.verificationCode === 1 && idx.unique === true
    );

    if (hasUniqueCodeIndex) {
      console.log('\nFound unique index on verificationCode. Dropping it...');
      try {
        await collection.dropIndex({ verificationCode: 1 });
        console.log('Unique index dropped successfully');
      } catch (err) {
        console.log('Error dropping index:', err.message);
      }
    } else {
      console.log('\nNo unique index found on verificationCode');
    }

    // Create compound index on email and verificationCode for better query performance
    console.log('\nCreating compound index on email and verificationCode...');
    try {
      await collection.createIndex({ email: 1, verificationCode: 1 });
      console.log('Compound index created successfully');
    } catch (err) {
      console.log('Index may already exist:', err.message);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

fixIndexes();