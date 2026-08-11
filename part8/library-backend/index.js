require("dotenv").config();

const http = require("http");
const cors = require("cors");
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const jwt = require("jsonwebtoken");

require("./db");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const User = require("./models/user");

const JWT_SECRET = process.env.JWT_SECRET || "NEED_TO_CHANGE_THIS";
const PORT = process.env.PORT || 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/",
});
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

const getCurrentUser = async (auth) => {
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const decodedToken = jwt.verify(
      auth.substring(7),
      JWT_SECRET
    );

    return await User.findById(decodedToken.id);
  }

  return null;
};

const start = async () => {
  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        currentUser: await getCurrentUser(req.headers.authorization),
      }),
    }),
  );

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/`);
  });
};

start();
