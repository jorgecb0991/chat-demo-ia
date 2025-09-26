// src/lib/icon/icon-map.ts

//Importamos todos los íconos que tu app podría necesitar
import {
    FileText,
    Youtube,
    MessageSquare,
    FileQuestion,
    Home,
    LogOut,
    // Agrega aquí todos los íconos de tu API
    type Icon,
} from "lucide-react";

import React from "react";

// ⭐️ Exportamos el mapa de íconos para que pueda ser usado en cualquier lugar
export const iconMap: { [key: string]: React.ElementType } = {
    "FileText": FileText,
    "Youtube": Youtube,
    "MessageSquare": MessageSquare,
    "FileQuestion": FileQuestion,
    "Home": Home,
    "LogOut": LogOut,
};