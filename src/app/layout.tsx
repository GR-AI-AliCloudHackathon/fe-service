import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import ToasterContext from "./context/ToasterContext";

export const metadata = {
  title: "iRiS",
  description: "Prevent and respond to domestic violence with iRiS.",
  icons: [{ rel: "icon", url: "/logo-iris.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ToasterContext />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
