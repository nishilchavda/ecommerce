const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function checkDB() {
  try {
    console.log('Connecting to:', process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log('DB Connection Successful');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error('DB Connection Failed:', err);
    process.exit(1);
  }
}

checkDB();
