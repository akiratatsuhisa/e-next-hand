import type { Metadata } from "next";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";

export const metadata: Metadata = {
  title: "E Next Hand",
  description: "E Next Hand",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          {children}
          {modal}
        </NextUIProvider>
      </body>
    </html>
  );
}
