export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className="bg-background antialiased">
                <main className="flex items-center justify-center min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
