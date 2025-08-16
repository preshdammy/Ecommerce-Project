import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "@/shared/graphql/schema";
import { connect } from "@/shared/database/db.connect";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { handleError } from "@/shared/utils/handleError";

interface ContextType {
  admin?: { id: string; email: string };
  vendor?: { id: string; email: string; name: string };
  user?: { id: string; email: string; name: string };
}

const server = new ApolloServer<ContextType>({
  typeDefs,
  resolvers,
  introspection: true
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    try {
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) return {};

      const decoded: any = jwt.verify(token, process.env.secret_key!);

      if (decoded.role === "admin") {
        return { admin: { id: decoded.id, email: decoded.email }, role: "admin" };
      } else if (decoded.role === "vendor") {
        return { vendor: { id: decoded.id, email: decoded.email, name: decoded.name }, role: "vendor" };
      } else if (decoded.role === "user") {
        return { user: { id: decoded.id, email: decoded.email, name: decoded.name }, role: "user" };
      } else {
        return {};
      }
    } catch (error) {
      console.log("JWT error:", error);
      handleError(error);
      return {};
    }
  },
});

export const GET = handler;
export const POST = handler;

// You MUST have this to handle CORS preflight requests
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

connect();
