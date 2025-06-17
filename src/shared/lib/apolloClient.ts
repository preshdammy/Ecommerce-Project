import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

const httplink =new HttpLink({
  uri: "/api/graphql",
})

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

 export function createApolloClient() {
    return new ApolloClient({
      link: authLink.concat(httplink),
      cache: new InMemoryCache(),
    });
  }