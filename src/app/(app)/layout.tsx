import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb"
import { Card } from "@/components/ui/card"
import { getSession } from "@/lib/auth/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //La sesión ahora se carga en el servidor antes de que se renderice cualquier componente de cliente.
  const session = await getSession();
  
  return (
    <SidebarProvider>
      {/*Envolvemos la aplicación con el proveedor */}
        {/* Fondo fijo */}
        <div className="fixed inset-0 bg-app-pattern -z-10"></div>

        {/* Estructura principal */}
        <div className="flex min-h-screen relative z-10">
          {/*PASAMOS LA SESIÓN AL COMPONENTE DE CLIENTE COMO PROP */}
          <AppSidebar session={session} />

          {/* Contenido */}
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
  )
}
