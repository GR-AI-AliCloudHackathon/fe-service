import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import ToasterContext from "./context/ToasterContext";
import dynamic from "next/dynamic";

// Import the backend provider with client-side only execution
const BackendProviderClient = dynamic(
  () => import("./context/BackendContext").then(mod => ({ default: mod.BackendProvider })),
  { ssr: false }
);

// Import the OfflineBanner component dynamically
const OfflineBanner = dynamic(
  () => import("./components/OfflineBanner"),
  { ssr: false }
);

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
        <BackendProviderClient>
          <div className="w-full">
            {/* OfflineBanner will only display when backend is disconnected */}
            <OfflineBanner />
            {children}
          </div>
        </BackendProviderClient>
      </body>
    </html>
  );
}
