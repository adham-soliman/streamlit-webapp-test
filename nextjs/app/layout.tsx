import type { Metadata } from "next";
import { AuthProvider } from "../components/auth-provider";

export const metadata: Metadata = {
  title: "Webapplication Farm Next.js Demo",
  description: "Hello World proof of concept"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}