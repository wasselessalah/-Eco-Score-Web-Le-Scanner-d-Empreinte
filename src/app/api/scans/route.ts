import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { data: scans, error } = await supabase
            .from('scans')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true, data: scans });
    } catch (error) {
        console.error('Scans fetch error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch scans' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const scanId = searchParams.get('id');

        if (!scanId) {
            return NextResponse.json(
                { success: false, error: 'Scan ID is required' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('scans')
            .delete()
            .eq('id', scanId)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete scan error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete scan' },
            { status: 500 }
        );
    }
}
