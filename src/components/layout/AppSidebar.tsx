"use client";

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
import {
    LogOut,
    FileText,
    Youtube,
    MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 🔹 Ejemplo: datos de usuario (pueden venir de contexto o props)
const user = {
    name: "Jorge Chávez",
    role: "Profesor",
    program: "Pregrado", // o "Postgrado"
};

// 🔹 Lista de opciones de menú dinámicas
const menuItems = [
    {
        title: "Presentaciones",
        href: "/slide",
        icon: FileText,
    },
    {
        title: "Quiz YouTube",
        href: "/quiz/youtube",
        icon: Youtube,
    },
    {
        title: "Chatbot",
        href: "/chatbot",
        icon: MessageSquare,
    },
];

export function AppSidebar() {
    return (
        <Sidebar className="bg-white dark:bg-utec-gray-800 border-r border-utec-gray-300">
            {/* Header con logo */}
            <SidebarHeader className="flex items-center gap-2 px-4 py-3">
                <Image
                    src="/img/logo_blanco_utec.png"
                    alt="UTEC"
                    width={40}
                    height={40}
                />
                <span className="font-semibold text-utec-gray-800 dark:text-white">
                    UTEC App
                </span>
            </SidebarHeader>

            {/* Información del usuario */}
            <div className="px-4 py-3 border-b border-utec-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <Image
                        src="next.svg" // 👈 puedes poner un avatar genérico
                        alt="Usuario"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-semibold text-utec-gray-800 dark:text-white">
                            {user.name}
                        </p>
                        <p className="text-sm text-utec-gray-300 dark:text-gray-400">
                            {user.role} • {user.program}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navegación dinámica */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menú</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.href}>
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer con logout */}
            <SidebarFooter>
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
