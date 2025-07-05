import ApolloProvider from "@/shared/provider/apolloProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider>
      {children}
    </ApolloProvider>
  );
}
