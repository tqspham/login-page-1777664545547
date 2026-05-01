import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const initSecret = request.headers.get('x-init-secret');
  
  if (initSecret !== process.env.INIT_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const initSql = process.env.INIT_SQL;
  
  if (!initSql) {
    return NextResponse.json(
      { ok: false, error: 'INIT_SQL not configured' },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.rpc('exec_sql', { sql: initSql });
    
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}
