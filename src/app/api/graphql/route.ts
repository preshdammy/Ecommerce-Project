import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "@/shared/graphql/schema";
import { connect } from "@/shared/database/db.connect";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    try {
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.split(" ")[1];
      if (!token) return {};
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

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
      console.error("JWT error:", error);
      return {};
    }
  }
});


// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Wrap GET and POST with CORS headers
async function handleRequest(req: Request) {
  const res = await handler(req as any);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

export async function GET(req: Request) {
  await connect();
  return handleRequest(req);
}

export async function POST(req: Request) {
  await connect();
  return handleRequest(req);
}
