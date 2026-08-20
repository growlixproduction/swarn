import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import StorefrontShell from "../components/StorefrontShell";

export const metadata: Metadata = {
  title: "Swarn Mahal Jewellers | Luxury Jewellery & Live Bullion Pricing | Ambikapur",
  description:
    "Swarn Mahal Jewellers Ambikapur - Handcrafted 22K BIS Hallmarked Gold, Certified Diamond Solitaires, Bridal Rani Haars, and Dynamic Real-Time Bullion Pricing Engine.",
  keywords: ["jewellery", "gold rate ambikapur", "swarn mahal", "22k gold", "solitaires", "chhattisgarh", "bis 916"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <AppProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </AppProvider>
      </body>
    </html>
  );
}
