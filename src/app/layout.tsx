import type { Metadata } from "next"
import "./globals.css"
import { geistSans } from "../styles/fonts"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "PosturIA - Be the best version of yourself (or at least fake it)",
  description: "Let an AI write your LinkedIn post",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
