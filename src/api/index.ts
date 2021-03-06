import "reflect-metadata";

import { createConnection } from "typeorm";
import { ActiveBusinessLicenseResolver } from "../resolver/ActiveBusinessLicenseResolver";
import * as TypeGraphQL from "type-graphql";
import { ApolloServer } from "apollo-server";

const port = process.env.PORT || 4000;
const cors = process.env.NODE_ENV === "production" ? { origin: "https://denverdata.org" } : { origin: "*" };

async function run (): Promise<void> {
  try {
    await createConnection();
    const schema = await TypeGraphQL.buildSchema({
      validate: false,
      resolvers: [
        ActiveBusinessLicenseResolver
      ]
    });
    const server = new ApolloServer({ cors, schema });
    const { url } = await server.listen(port);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (error) {
    console.error(error);
  }
}

run();
