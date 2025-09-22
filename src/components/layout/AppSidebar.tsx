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
import {
    LogOut,
    FileText,
    Youtube,
    MessageSquare,
    FileQuestion
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

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
        iconColor: "text-[#006AB5]",
    },
    {
        title: "Quiz YouTube",
        href: "/quiz/youtube",
        icon: Youtube,
        iconColor: "text-[#006AB5]",
    },
    {
        title: "Quiz",
        href: "/quiz",
        icon: FileQuestion,
        iconColor: "text-[#006AB5]",
    },
    {
        title: "Chatbot",
        href: "/chatbot",
        icon: MessageSquare,
        iconColor: "text-[#006AB5]",
    },
];

export function AppSidebar() {
    const [activePath, setActivePath] = useState("/quiz");
    return (
        <Sidebar className="bg-white border border-utec-gray-300 rounded-2xl m-6 shadow-lg flex flex-col max-h-[90vh]  overflow-hidden">
            {/* Header con logo */}
            <SidebarHeader className="flex items-center gap-3 px-5 py-4 border-b border-utec-gray-300 bg-gradient-to-r from-white to-utec-gray-50">
                {/* Logo dentro de un círculo elegante */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white shadow-md overflow-hidden">
                    <Image
                        src="/img/utechie-001.png"
                        alt="UTEC Logo"
                        fill            // ⬅️ Esto hace que ocupe todo el contenedor
                        className="object-contain" // ⬅️ Mantiene proporciones, sin recortar
                    />
                </div>

                {/* Nombre y subtítulo */}
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-utec-gray-800 tracking-tight">
                        UTEC Coach
                    </span>
                </div>
            </SidebarHeader>

            {/* Información del usuario */}
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
                            {user.name}
                        </p>
                        <p className="text-sm text-utec-gray-300 dark:text-gray-400">
                            {user.role} • {user.program}
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
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.href} className={clsx(
                                    item.href === activePath && "border-l-4 border-[#F5A623] bg-[#F5A623]/10"
                                )}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.href}
                                            className="text-black"
                                            onClick={() => setActivePath(item.href)}>
                                            <item.icon className={clsx("h-5 w-5", item.iconColor)} />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
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
