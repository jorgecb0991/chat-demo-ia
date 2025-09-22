import React from 'react';
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import StoreProvider from "./StoreProvider"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb"
import { Card } from "@/components/ui/card"

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
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-app-pattern antialiased text-utec-gray-800 dark:text-white`}
      >
        <StoreProvider>
          <SidebarProvider>
            {/* Fondo fijo que cubre toda la pantalla */}
            <div className="fixed inset-0 bg-app-pattern -z-10"></div>
            
            {/* Contenido principal */}
            <div className="flex min-h-screen relative z-10">
              {/* Sidebar fijo */}
              <AppSidebar />

              {/* Contenido principal con scroll */}
              <div className="flex-1 flex flex-col gap-4 py-6 min-h-0 overflow-y-auto">
                {/* Breadcrumb */}
                <div className="w-full sm:w-full md:w-5xl lg:w-6xl xl:w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Card className="flex h-12 items-center rounded-xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 gap-2">
                    <div className="flex items-center h-full w-full">
                      <AppBreadcrumb />
                    </div>
                  </Card>
                </div>

                {/* Contenido central */}
                <main className="flex-1 flex items-center justify-center min-h-0">
                  <div className="w-full max-w-5xl h-full flex flex-col min-h-0">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </StoreProvider>
      </body>
    </html>
  );
}