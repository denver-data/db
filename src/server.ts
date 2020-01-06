import { ApolloServer } from "apollo-server-koa";
import * as Koa  from "koa";
import * as cors from "@koa/cors";
import { merge } from "lodash";

import { sitePlanSchema } from "./sitePlanSchema";

const PORT = process.env.PORT ?? 4000;

(async () => {
  const schemas = await Promise.all([
    sitePlanSchema()
  ]);
  const apolloServer = new ApolloServer({
    typeDefs: [`type Query { _empty: String }`, ...schemas.map(s => s.typeDef)],
    resolvers: merge(...schemas.map(s => s.resolvers)),
  });
  const app = new Koa();
  app.use(cors());
  apolloServer.applyMiddleware({ app });
  app.use(ctx => {
    ctx.body = `This is the Denver Data API.`;
  });
  app.listen({
      port: PORT
    },
    () => {
      console.log(`🚀 HTTP Server ready at http://localhost:${PORT}`)
      console.log(`🚀 Apollo Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
    }
  );
})();
