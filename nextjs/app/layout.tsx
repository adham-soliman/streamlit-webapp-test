import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FH Platform – Access Rights Demo",
  description: "Local Next.js, Auth.js, and Keycloak authentication demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}