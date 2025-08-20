import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { VeterinarianModel } from '@/models';

/**
 * GET /api/veterinarian
 * 
 * Returns a paginated list of veterinarians.
 * Query params:
 * - page: number (default 1)
 * - limit: number (default 20)
 * - q: text search on name (optional)
 * - specialization: exact match (optional)
 * - available: 'true' | 'false' (optional)
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100);
    const q = (searchParams.get('q') || '').trim();
    const specialization = (searchParams.get('specialization') || '').trim();
    const availableParam = searchParams.get('available');
    const approvedParam = searchParams.get('approved');

    const filter: Record<string, any> = {
      isActive: true,
      isDeleted: { $ne: true },
    };

    // Do not force approval by default; allow optional filtering via `approved`
    if (approvedParam === 'true') {
      filter.isApproved = true;
    } else if (approvedParam === 'false') {
      filter.isApproved = false;
    }

    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    if (specialization) {
      filter.specialization = specialization;
    }
    if (availableParam === 'true') {
      filter.available = true;
    } else if (availableParam === 'false') {
      filter.available = false;
    }

    const query = VeterinarianModel.find(filter)
      .select('-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const [items, total] = await Promise.all([
      query,
      VeterinarianModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      message: "Veterinarians retrieved successfully",
      data: {
        veterinarians: items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        }
      }
    });
  } catch (error: any) {
    console.error('GET /api/veterinarian error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch veterinarians',
      errorCode: 'FETCH_ERROR',
      errors: null
    }, { status: 500 });
  }
}


