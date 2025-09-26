import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import StoreProvider from "../providers/StoreProvider"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "UTEC App",
    description: "Aplicación de Chatbot y Generador de Slides",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-app-pattern antialiased text-utec-gray-800 dark:text-white`}
            >
                <StoreProvider>
                    {children}
                </StoreProvider>
            </body>
        </html>
    )
}
