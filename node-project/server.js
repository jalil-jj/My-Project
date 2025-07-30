const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4000;

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB Connected :))");

        app.listen(port, () => {
            console.log(`🚀 Server Running On Port ${port}`);
        });
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
    }
})();