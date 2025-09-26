"use client";

import { useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { iconMap } from "@/lib/icon/icon-map";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

// AHORA RECIBIMOS LA SESIÓN COMO UNA PROP DEL COMPONENTE PADRE
export function AppSidebar({ session }: { session: any }) {
    // ⭐️ Manejamos los estados de carga y error con un componente de placeholder
    console.log(session)
    if (!session) {
        return (
            <Sidebar className="bg-white border border-utec-gray-300 rounded-2xl m-6 shadow-lg flex flex-col max-h-[90vh] overflow-hidden justify-center items-center">
                <p className="text-red-600 font-semibold text-center">Error al cargar la sesión. Por favor, recargue.</p>
            </Sidebar>
        );
    }

    // EXTRAEMOS LOS DATOS DEL USUARIO Y LAS OPCIONES DE LA SESIÓN
    const userData = session;
    const userOptions = userData.businessUnits?.[0]?.profiles?.[0]?.options || [];

    const userName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || "Invitado";
    const userRole = userData.position || "N/A";
    const userProgram = userData.businessUnits?.[0]?.identifier || "N/A";

    const [activePath, setActivePath] = useState("/dashboard");

    return (
        <Sidebar className="bg-white border border-utec-gray-300 rounded-2xl m-6 shadow-lg flex flex-col max-h-[90vh]  overflow-hidden">
            {/* Header con logo */}
            <SidebarHeader className="flex items-center gap-3 px-5 py-4 border-b border-utec-gray-300 bg-gradient-to-r from-white to-utec-gray-50">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white shadow-md overflow-hidden">
                    <Image
                        src="/img/utechie-001.png"
                        alt="UTEC Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-utec-gray-800 tracking-tight">
                        UTEC Coach
                    </span>
                </div>
            </SidebarHeader>

            {/* Información del usuario - Ahora dinámica */}
            <div className="px-4 py-3 border-b border-utec-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <Image
                        src="/img/avatar1.png"
                        alt="Usuario"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-semibold text-utec-gray-800 dark:text-white">
                            {userName}
                        </p>
                        <p className="text-sm text-utec-gray-300 dark:text-gray-400">
                            {userRole} • {userProgram}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenido con scroll */}
            <SidebarContent className="flex-1 overflow-y-auto">
                <SidebarGroup>
                    <SidebarGroupLabel>Menú</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {userOptions.map((item: any) => {
                                const DynamicIcon = iconMap[item.icon];
                                if (!DynamicIcon) return null;

                                return (
                                    <SidebarMenuItem key={item.id} className={clsx(
                                        item.value === activePath && "border-l-4 border-[#F5A623] bg-[#F5A623]/10"
                                    )}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.value}
                                                className="text-black"
                                                onClick={() => setActivePath(item.value)}>
                                                <DynamicIcon className="h-5 w-5 text-[#006AB5]" />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer fijo */}
            <SidebarFooter className="border-t border-utec-gray-300">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="text-red-600 hover:text-red-800 dark:hover:text-red-400">
                            <LogOut className="h-5 w-5" />
                            <span>Cerrar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
