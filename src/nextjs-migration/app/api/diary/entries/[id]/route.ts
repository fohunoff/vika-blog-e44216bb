
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Запись не найдена' },
          { status: 404 }
        );
      }
      
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching diary entry:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении записи из дневника' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();
  const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating diary entry:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении записи в дневнике' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_BASE_URL}/diary/entries/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении записи из дневника' },
      { status: 500 }
    );
  }
}
