const mongoose = require('mongoose');
const initData = require('./data.js')
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://localhost:27017/WanderNest';

main()
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((listing) => ({ ...listing, author:'6853b1ac57250b6c09083c23'}));
    await Listing.insertMany(initData.data);
    console.log('Database initialized with initial data.');
    console.log('Total listings:', await Listing.countDocuments());
}

initDB();

