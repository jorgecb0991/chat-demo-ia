"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
        <Breadcrumb className="flex items-center h-full">
            <BreadcrumbList className="flex items-center gap-1 h-full">
                {/* Inicio */}
                <BreadcrumbItem className="flex items-center h-full">
                    <BreadcrumbLink asChild className="flex items-center h-full">
                        <Link href="/" className="flex items-center h-full">
                            <Home className="w-4 h-4 mr-1" />
                            Inicio
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {crumbs?.map((crumb, idx) => {
                    const segment = pathSegments[idx];
                    const Icon = iconMap[segment.toLowerCase()] || HelpCircle;

                    return (
                        <span key={idx} className="flex items-center h-full">
                            {/* Separador */}
                            <BreadcrumbSeparator className="flex items-center h-full" />

                            {idx === crumbs.length - 1 ? (
                                <BreadcrumbPage className="flex items-center gap-1 h-full">
                                    {Icon && <Icon className="w-4 h-4 mr-1" />}
                                    {crumb.title}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbItem className="flex items-center h-full">
                                    <BreadcrumbLink asChild className="flex items-center gap-1 h-full">
                                        <Link href={crumb.href} className="flex items-center h-full">
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