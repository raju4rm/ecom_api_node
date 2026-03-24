const EventEmitter = require('events');
class UserEmitter extends EventEmitter {}
const { sendWelcomeEmail } = require('../services/emailServices');

const userEmitter = new UserEmitter();
userEmitter.on('userRegistered', (user) => {
    console.log(`User registered: ${user.name} (${user.email})`);
    sendWelcomeEmail(user);
});

module.exports = {
    userEmitter
}