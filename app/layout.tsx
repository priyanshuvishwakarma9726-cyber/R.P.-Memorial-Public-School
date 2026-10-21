import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export const metadata: Metadata = {
  title: {
    default: `${SCHOOL_INFO.name} | ${SCHOOL_INFO.tagline}`,
    template: `%s | ${SCHOOL_INFO.name}`,
  },
  description: `Official website of ${SCHOOL_INFO.name}, Maharajganj, Uttar Pradesh (CBSE School Code: ${SCHOOL_INFO.schoolCode}). Established in 2011 on an 8,130 sq. m campus.`,
  keywords: [
    "R.P. Memorial Public School",
    "RPM Public School Maharajganj",
    "CBSE School Maharajganj",
    "School Code 2134039",
    "Partawal Bazar School",
    "Avadhes Kumar Chaurasaia",
    "Public School Uttar Pradesh",
  ],
  authors: [{ name: SCHOOL_INFO.name }],
  metadataBase: new URL("https://rpmpublicschool.in"),
  icons: {
    icon: "/favicon.ico",
    apple: "/images/school-logo.png",
  },
  openGraph: {
    title: `${SCHOOL_INFO.name} | ${SCHOOL_INFO.tagline}`,
    description: `Official website of ${SCHOOL_INFO.name}, Maharajganj (UP). CBSE School Code: ${SCHOOL_INFO.schoolCode}.`,
    url: "https://rpmpublicschool.in",
    siteName: SCHOOL_INFO.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/campus-entrance.jpg",
        width: 1200,
        height: 630,
        alt: `${SCHOOL_INFO.name} Campus`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0e2a47" />
      </head>
      <body>
        <TopBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
