import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <HomePage />
    </ApolloProvider>
  );
}
