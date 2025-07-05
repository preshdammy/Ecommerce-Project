import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.log(err.message, "graphqlerror");

      if (
        err.message.includes("jwt expired") ||
        err.extensions?.code === "UNAUTHENTICATED"
      ) {
        // Redirect to login
        Cookies.remove("token");
        window.location.href = "/login";
      }
    }
  }
});

const httplink = new HttpLink({
  uri: "/api/graphql",
<<<<<<< HEAD
  credentials: "include", // optional: can leave or remove; doesn't hurt
=======
>>>>>>> 47e93d3dd353694d0eae13fd75ed00a429d61477
});

const authLink = setContext((_, { headers }) => {
  const usertoken = Cookies.get("usertoken");
  const vendortoken = Cookies.get("vendortoken");
  const admintoken = Cookies.get("admintoken");
  const token = usertoken || vendortoken || admintoken;
<<<<<<< HEAD

=======
>>>>>>> 47e93d3dd353694d0eae13fd75ed00a429d61477
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