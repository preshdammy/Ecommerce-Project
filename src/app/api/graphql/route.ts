import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "../../../shared/graphql/schema";
import { resolvers } from "../../../shared/graphql/schema";
import { NextRequest } from "next/server";
import { connect } from "@/shared/database/db.connect";
import jwt from "jsonwebtoken";
import { ContextType } from "@/types/context"; // ✅ import context type

await connect()

const server = new ApolloServer<ContextType>({
  typeDefs,
  resolvers,
});


const handler = startServerAndCreateNextHandler<NextRequest, ContextType>(server, {
  context: async (req: NextRequest): Promise<ContextType> => {
    await connect();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return {};

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as ContextType["admin"];
      return { admin: decoded };
    } catch (error) {
      console.error("Invalid token:", error);
      return {};
    }
  }
});

export { handler as GET, handler as POST };

