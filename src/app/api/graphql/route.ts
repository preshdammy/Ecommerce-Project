import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "@/shared/graphql/schema";
import { connect } from "@/shared/database/db.connect";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { handleError } from "@/shared/utils/handleError";

interface ContextType {
  admin?: { id: string; email: string };
  vendor?: { id: string; email: string };
  user?: { id: string; email: string };
}


const server = new ApolloServer<ContextType>({
  typeDefs,
  resolvers
})


const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => {
      try {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];
  
        if (!token) {
          return {}; // Return an empty object if no token is provided
        }
  
        const decoded: any = jwt.verify(token, process.env.secret_key!);
  
        if (decoded.role === "admin") {
          return { admin: { id: decoded.id, email: decoded.email }, role: "admin" };
        } else if (decoded.role === "vendor") {
          return { vendor: { id: decoded.id, email: decoded.email, name: decoded.name }, role: "vendor" };
        } else if (decoded.role === "user") {
          return { user: { id: decoded.id, email: decoded.email, name: decoded.name }, role: "user" };
        } else {
          return {}; // Return an empty object for unrecognized roles
        }
      } catch (error) {
        console.log("JWT error:", error);
        handleError(error);
        return {}; // Ensure an object is always returned in case of an error
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