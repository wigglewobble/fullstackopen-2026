require("dotenv").config();

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");

require("./db");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const User = require("./models/user");

const JWT_SECRET = process.env.JWT_SECRET || "NEED_TO_CHANGE_THIS";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: {
    port: process.env.PORT || 4000,
  },

  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        JWT_SECRET
      );

      const currentUser = await User.findById(decodedToken.id);

      return { currentUser };
    }

    return {};
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});