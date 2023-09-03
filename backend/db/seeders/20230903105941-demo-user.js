'use strict';
// Necessary imports
const bcrypt = require('bcryptjs')

// Define schema name for production database
let options = {}
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

options.tableName = 'Users'

const demoUsers = [
  {
    email: 'demo@user.io',
    username: 'demouser',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'user1@user.io',
    username: 'user1',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'user2@user.io',
    username: 'user2',
    hashedPassword: bcrypt.hashSync('password')
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert(options, demoUsers, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['demouser', 'user1', 'user2']
      }
    }, {})
  }
};
