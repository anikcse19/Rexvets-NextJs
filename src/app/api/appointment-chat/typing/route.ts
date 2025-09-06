import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusher } from '@/lib/pusher';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId, userId, userName, action } = await request.json();

    if (!appointmentId || !userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Trigger typing events via Pusher
    if (action === 'start') {
      await pusher.trigger(`appointment-${appointmentId}`, 'typing-start', {
        userId,
        userName: userName || 'User'
      });
    } else if (action === 'stop') {
      await pusher.trigger(`appointment-${appointmentId}`, 'typing-stop', {
        userId
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling typing event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
