import { NextResponse } from 'next/server';

/**
 * Endpoint de la API para manejar una instrucción específica por su ID.
 *
 * NOTA: Este archivo maneja las rutas dinámicas como /api/chatbot/instruction/123.
 */

// Función para manejar peticiones GET a /api/chatbot/instruction/:id
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;

    if (!id || typeof id !== 'string') {
        return NextResponse.json({ mensaje: 'Falta el parámetro ID en la URL.' }, { status: 400 });
    }

    // TODO: Implementar lógica para obtener la instrucción por ID
    return NextResponse.json({ mensaje: `GET instrucción con id: ${id}` });
}

// Función para manejar peticiones PUT a /api/chatbot/instruction/:id
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;

    if (!id || typeof id !== 'string') {
        return NextResponse.json({ mensaje: 'Falta el parámetro ID en la URL.' }, { status: 400 });
    }

    // TODO: Implementar lógica para actualizar la instrucción
    return NextResponse.json({ mensaje: `PUT instrucción con id: ${id}` });
}

// Función para manejar peticiones DELETE a /api/chatbot/instruction/:id
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;

    if (!id || typeof id !== 'string') {
        return NextResponse.json({ mensaje: 'Falta el parámetro ID en la URL.' }, { status: 400 });
    }

    // TODO: Implementar lógica para eliminar la instrucción
    return NextResponse.json({ mensaje: `DELETE instrucción con id: ${id}` });
}
