import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import ToasterContext from "./context/ToasterContext";

export const metadata = {
  title: "GoShield",
  description: "Protect your trip with GoShield.",
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
        {children}
      </body>
    </html>
  );
}
