import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { users, cars } from "./data.js";

const app = express();

const typeDefs = gql`
  type Query {
    cars: [Car]
    car(id: Int!): Car
    users: [User]
    user(id: Int!): User
  }

  type Car {
    id: ID!
    make: String!
    model: String!
    owner: User!
  }

  type User {
    id: ID!
    name: String!
    car: [Car]
  }
`;

const resolvers = {
  Query: {
    cars: () => cars,
    car: (parent, { id }) => cars.filter(car => car.id === id),
    users: () => users,
    user: (parent, { id }) => users.filter(user => user.id === id)[0]
  },
  Car: {
    owner: parent => users
  },
  User: {
    car: parent => cars.map(car => cars[car.id - 1])
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

app.listen(3000, () => console.info("Running apollo on 3000"));
