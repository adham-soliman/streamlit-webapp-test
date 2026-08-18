import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
