const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.User) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v-password"
        );

        return userData;
      }
      throw new AuthenticationError("Not Logged In");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, args) => {
        const user = await User.findOne(args.email);
        const correctPassword = await user.isCorrectPassword(password);

        if (!user){
            throw new AuthenticationError("Incorrect Email");
        }

        if (!correctPassword) {
            throw new AuthenticationError("Incorrect Password")
        }
    },

    saveBook: {},

    removeBook: {},
  },
};

module.exports = resolvers;
