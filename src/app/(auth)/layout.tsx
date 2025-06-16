import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ApolloProvider from "@/shared/provider/apolloProvider";


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
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
