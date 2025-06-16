import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ApolloProvider from "@/shared/provider/apolloProvider";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthLayoutWrapper from "../components/AuthLayoutWrapper"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Account Settings",
  description: "User profile and business settings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApolloProvider>
          <Header />
          <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
          <Footer />
        </ApolloProvider>
      </body>
    </html>
  );
}
