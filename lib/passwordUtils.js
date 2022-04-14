const bcrypt = require('bcryptjs');

async function generatePasswordHash(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(userInputtedPassword, hashedPassword) {
    const passwordsMatch = await bcrypt.compare(userInputtedPassword, hashedPassword);
    return passwordsMatch;
}

module.exports.validatePassword = validatePassword;
module.exports.generatePasswordHash = generatePasswordHash;