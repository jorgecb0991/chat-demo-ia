"use client";

import React from 'react';
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Home, Youtube, FileText, Settings, BookOpen, HelpCircle } from "lucide-react";
const iconMap: Record<string, React.ElementType> = {
    youtube: Youtube,
    quiz: FileText,
    config: Settings,
    cursos: BookOpen,
};

export function AppBreadcrumb() {
    const pathname = usePathname(); // ruta actual
    const pathSegments = pathname?.split("/").filter(Boolean)||[];

    // Construir rutas acumulativas y títulos bonitos
    let accumulatedPath = "";
    const crumbs = pathSegments?.map((segment) => {
        accumulatedPath += `/${segment}`;
        const title = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        return { href: accumulatedPath, title };
    });

    return (
        <Breadcrumb className="flex items-center px-6 ">
            <BreadcrumbList className="flex items-center gap-1">
                {/* Inicio */}
                <BreadcrumbItem className="flex items-center">
                    <BreadcrumbLink asChild className="flex items-center h-full text-gray-600 hover:text-[#F5A623] transition-colors duration-200">
                        <Link href="/" className="flex items-center ">
                            <Home className="w-4 h-4 mr-1" />
                            Inicio
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {crumbs?.map((crumb, idx) => {
                    const segment = pathSegments[idx];
                    const Icon = iconMap[segment.toLowerCase()] || HelpCircle;

                    return (
                        <span key={idx} className="flex items-center">
                            {/* Separador */}
                            <BreadcrumbSeparator className="flex items-center" />

                            {idx === crumbs.length - 1 ? (
                                <BreadcrumbPage className="flex items-center gap-1 text-[#002C5B] font-semibold">
                                    {Icon && <Icon className="w-4 h-4 mr-1" />}
                                    {crumb.title}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbItem className="flex items-center">
                                    <BreadcrumbLink asChild className="flex items-center gap-1 h-full hover:text-[#F5A623] transition-colors duration-200">
                                        <Link href={crumb.href} className="flex items-center">
                                            {Icon && <Icon className="w-4 h-4 mr-1" />}
                                            {crumb.title}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            )}
                        </span>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}