import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Use 127.0.0.1 to avoid Mac DNS issues with 'localhost'
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/auth_db');
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};


export default connectDB;