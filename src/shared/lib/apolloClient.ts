import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";
import { onError } from "@apollo/client/link/error";
import { cookies } from "next/headers";


const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors ) {
      console.log(err.message, "graphqlerror");
      if (
        err.message.includes("jwt expired") ||
        err.extensions?.code === "UNAUTHENTICATED"
      ) {
        // Remove all role tokens if expired
        Cookies.remove("usertoken");
        Cookies.remove("vendortoken");
        Cookies.remove("admintoken");
        Cookies.remove("userinfo");
        Cookies.remove("vendorinfo");
        Cookies.remove("admininfo");
        window.location.href = "/login";
      }
    }
  }
});

const httplink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include", // optional: can leave or remove; doesn't hurt
});

const authLink = setContext((_, { headers }) => {
  const usertoken = Cookies.get("usertoken");
  const vendortoken = Cookies.get("vendortoken");
  const admintoken = Cookies.get("admintoken");
  const token = usertoken || vendortoken || admintoken;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export function createApolloClient() {
  return new ApolloClient({
    link: from([
      errorLink,
      authLink.concat(httplink),
    ]),
    cache: new InMemoryCache(),
  });
}
