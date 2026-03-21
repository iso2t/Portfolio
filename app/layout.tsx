import type {Metadata} from "next";
import "./globals.css";
import Header from "@/app/components/Header";
import React from "react";
import Footer from "@/app/components/Footer";
import ThemeProvider from "@/app/components/ThemeProvider";

export const metadata: Metadata = {
    title: "ISO2T • Projects",
    description: "Project Index for ISO2T",
    icons: "/logo2.svg"
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body suppressHydrationWarning>
        <ThemeProvider>
            <Header/>
            <main>{children}</main>
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}

