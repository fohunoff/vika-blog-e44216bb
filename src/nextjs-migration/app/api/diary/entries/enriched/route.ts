
import { NextResponse } from 'next/server';

export async function GET() {
  const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_BASE_URL}/diary/entries/enriched`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching enriched diary entries:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении обогащенных записей из дневника' },
      { status: 500 }
    );
  }
}
