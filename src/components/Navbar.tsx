"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                {/* Botón menú (izquierda) */}
                <button
                    onClick={() => setMenuOpen(true)}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    <Menu size={28} className="text-gray-800 dark:text-white" />
                </button>

                {/* Logo centrado */}
                <div className="flex items-center gap-2">
                    <Image src="/img/logo_blanco_utec.png" alt="Logo UTEC" width={80} height={100} />
                    <span className="font-bold text-lg text-gray-800 dark:text-white">
                        
                    </span>
                </div>

                {/* Espacio para balancear */}
                <div className="w-10"></div>
            </div>

            {/* Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Menú lateral */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 flex flex-col justify-between"
                    >
                        {/* Encabezado con avatar */}
                        <div>
                            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/img/logo_blanco_utec.png"
                                        alt="Usuario"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">
                                            Jorge
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Administrador
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                >
                                    <X size={24} className="text-gray-700 dark:text-white" />
                                </button>
                            </div>

                            {/* Opciones */}
                            <ul className="flex flex-col p-4 gap-4">
                                <li>
                                    <Link
                                        href="/chatbot"
                                        className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Chatbot
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/slide"
                                        className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Generador de presentaciones
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/quiz/youtube"
                                        className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Generador de Quiz de youtube
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Logout */}
                        <div className="border-t p-4 dark:border-gray-700">
                            <button
                                className="flex items-center gap-2 text-red-600 hover:text-red-800 dark:hover:text-red-400 transition"
                                onClick={() => alert("Cerrar sesión")}
                            >
                                <LogOut size={20} />
                                Cerrar sesión
                            </button>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
