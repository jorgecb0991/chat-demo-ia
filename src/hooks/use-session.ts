"use client";

// Este hook ha sido diseñado para funcionar con TanStack Query y es útil
// para manejar el estado de la sesión con una estrategia de caché inteligente.
//
// Es ideal para escenarios donde la data de la sesión se gestiona
// por un servicio de backend que puede cambiar en cualquier momento,
// y se desea mantener la UI actualizada sin sobrecargar el servidor.
//
// Para usarlo, simplemente descomente el código de abajo y comente el actual.
//
// import { useQuery } from "@tanstack/react-query";
//
// export const useSession = () => {
//     return useQuery({
//         // Una clave única para identificar los datos en el caché de TanStack Query.
//         queryKey: ['session'],
//
//         // La función asíncrona que va a buscar los datos de la sesión.
//         queryFn: async () => {
//             const res = await fetch('/api/auth/session');
//             if (!res.ok) {
//                 throw new Error('Failed to fetch session data');
//             }
//             return res.json();
//         },
//
//         // staleTime: Configurado en 1 minuto. Los datos son "frescos" por este tiempo.
//         // Después de 1 minuto, si un componente necesita la sesión, se le servirá
//         // del caché mientras se hace una nueva petición en segundo plano.
//         // Esta es la estrategia "stale-while-revalidate".
//         staleTime: 1000 * 60 * 1, // 1 minuto
//
//         // refetchOnWindowFocus: Revalida la data al volver a enfocar la ventana.
//         refetchOnWindowFocus: true,
//     });
// };

// ⭐️ Implementación actual sin TanStack Query
// Este hook ahora es un simple marcador de posición que devuelve valores nulos
// para evitar errores, ya que la sesión ahora se carga en el servidor y se pasa como prop.
export const useSession = () => {
    return { data: null, isLoading: false, isError: false };
};
