import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "@/shared/graphql/schema";
import { connect } from "@/shared/database/db.connect";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";


const server = new ApolloServer<object>({
  typeDefs,
  resolvers
})


const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => {
      try {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];
  
        if (!token) {
          return {};
        }
  
        const decoded: any = jwt.verify(token, process.env.SECRETKEY!);
  
        if (decoded.role === "admin") {
          return { admin: { id: decoded.id, email: decoded.email }, role: "admin" };
        } else if (decoded.role === "vendor") {
          return { vendor: { id: decoded.id, email: decoded.email }, role: "vendor" };
        } else if (decoded.role === "user") {
          return { user: { id: decoded.id, email: decoded.email }, role: "user" };
        } else {
          return {};
        }
      } catch (error) {
        console.log("JWT error:", error);
        return {};
      }
    },
  });
  


export async function GET(req: Request) {
    return handler(req);
  }
  
  export async function POST(req: Request) {
    return handler(req);
  }
  
  connect()