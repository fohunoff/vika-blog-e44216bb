
import { NextResponse } from 'next/server';

export async function GET() {
  const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_BASE_URL}/diary/entries`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении записей из дневника' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_BASE_URL}/diary/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании записи в дневнике' },
      { status: 500 }
    );
  }
}
