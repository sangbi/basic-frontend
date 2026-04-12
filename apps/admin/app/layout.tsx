import type { Metadata } from "next";
import Providers from "./provider";

export const metadata: Metadata = {
  title: "Web",
  description: "Frontend basic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
