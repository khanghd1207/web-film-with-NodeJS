const mongoose = require('mongoose');
main().catch(err => console.error(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoCreate: true
    });
    console.log('Connected to MongoDB');
};
module.exports = { main }