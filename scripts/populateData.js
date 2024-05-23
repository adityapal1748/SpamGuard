const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('../models/user');
const Contact = require('../models/contact');
const config = require('../config/config.json');

const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];

const sequelize = new Sequelize(envConfig.database, envConfig.username, envConfig.password, {
    host: envConfig.host,
    dialect: envConfig.dialect,
});

const NUM_USERS = 10;
const NUM_CONTACTS = 50;

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const createSampleUsers = async () => {
    const users = [];

    for (let i = 0; i < NUM_USERS; i++) {
        const hashedPassword = await hashPassword('password123');
        users.push({
            name: faker.person.firstName(),
            phoneNumber: Math.floor(Math.random() * 10000000000), // Generate Indian phone numbers
            email: faker.internet.email(),
            password: hashedPassword,
        });
    }

    await User.bulkCreate(users);
};

const createSampleContacts = async () => {
    const users = await User.findAll();
    const contacts = [];

    for (let i = 0; i < NUM_CONTACTS; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        contacts.push({
            name: faker.person.fullName(),
            phoneNumber:Math.floor(Math.random() * 10000000000) , // Generate Indian phone numbers
            isSpam: faker.datatype.boolean(),
            userId: user.id,  // assuming `userId` is the foreign key in Contact model
        });
    }

    await Contact.bulkCreate(contacts);
};

const populateData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Check if there are existing records in the database
        const existingUsersCount = await User.count();
        const existingContactsCount = await Contact.count();

        if (existingUsersCount > 0 || existingContactsCount > 0) {
            // Delete existing records
            await User.destroy({ where: {} });
            await Contact.destroy({ where: {} });
            console.log('Existing records deleted successfully.');
        }

        // Sync all models
        await sequelize.sync({ force: true });
        console.log('All models were synchronized successfully.');

        await createSampleUsers();
        console.log('Sample users created successfully.');

        await createSampleContacts();
        console.log('Sample contacts created successfully.');

        console.log('Database populated with sample data.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

populateData();
