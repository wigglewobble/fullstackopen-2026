const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const jwt = require("jsonwebtoken");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const pubsub = new PubSub();
const BOOK_ADDED = "BOOK_ADDED";

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),

    authorCount: async () => await Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      const filter = {};

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author });

        if (!author) {
          return [];
        }

        filter.author = author._id;
      }

      return await Book.find(filter).populate("author");
    },

    allAuthors: async () => {
      const authors = await Author.find({});
      const bookCounts = await Book.aggregate([
        {
          $group: {
            _id: "$author",
            count: { $sum: 1 },
          },
        },
      ]);
      const countByAuthor = new Map(
        bookCounts.map((item) => [item._id.toString(), item.count])
      );

      return authors.map((author) => ({
        ...author.toObject(),
        id: author.id,
        bookCount: countByAuthor.get(author._id.toString()) || 0,
      }));
    },

    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        let author = await Author.findOne({
          name: args.author,
        });

        if (!author) {
          author = new Author({
            name: args.author,
          });

          await author.save();
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        });

        await book.save();

        const addedBook = await book.populate("author");
        pubsub.publish(BOOK_ADDED, { bookAdded: addedBook });

        return addedBook;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const author = await Author.findOne({
          name: args.name,
        });

        if (!author) {
          return null;
        }

        author.born = args.setBornTo;

        await author.save();

        return author;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }
    },
    createUser: async (root, args) => {
      try {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        });

        return await user.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({
        username: args.username,
      });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, JWT_SECRET),
      };
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }

      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});

      return true;
    },
  },

  Author: {
    bookCount: async (root) => {
      if (root.bookCount !== undefined) {
        return root.bookCount;
      }

      return await Book.countDocuments({
        author: root._id,
      });
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator([BOOK_ADDED]),
    },
  },
};

module.exports = resolvers;
