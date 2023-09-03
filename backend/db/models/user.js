'use strict';
// Necessary imports
const bcrypt = require('bcryptjs')

const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Will return an object with only the User instance information that is safe to save to a JWT
    toSafeObject(){
      const { id, username, email } = this // context will be the User
      return { id, username, email }
    }
    // Will return true is there is a match with the User instance's hashedPassword, if no match will return false
    validatePassword(password){
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    }
    // Will accept an id and use the currentUser scope to return a User with that id
    static getCurrentUserById(id){
      return User.scope('currentUser').findByPk(id)
    }
    // Will search for one User with the specified credential, if a user is found the user is returned using currentUser scope
    static async login({ credential, password }){
      const { Op } = require('sequelize')
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      })
      if(user && user.validatePassword(password)){
        return await User.scope("currentUser").findByPk(user.id)
      }
    }
    // Will create a User with the username, email, and hashedPassword and return the created user using the currentUser scope
    static async signup({ username, email, password }){
      const hashedPassword = bcrypt.hashSync(password)
      const user = await User.create({
        username,
        email,
        hashedPassword
      })
      return await User.scope('currentUser').findByPk(user.id)
    }
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error('Cannot be an email')
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: {
          exclude: ['hashedPassword']
        }
      },
      loginUser: {
        attributes: {}
      }
    }
  });
  return User;
};