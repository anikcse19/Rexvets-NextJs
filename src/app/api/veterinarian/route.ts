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
    const q = (searchParams.get('q') || searchParams.get('name') || '').trim();
    const specialization = (searchParams.get('specialization') || '').trim();
    const availableParam = searchParams.get('available');
    const approvedParam = searchParams.get('approved');
    const speciality = (searchParams.get('speciality') || '').trim();
    const treatedSpecies = (searchParams.get('treatedSpecies') || '').trim();
    const interest = (searchParams.get('interest') || '').trim();
    const researchArea = (searchParams.get('researchArea') || '').trim();
    const monthlyGoal = searchParams.get('monthlyGoal');
    const experienceYears = (searchParams.get('experienceYears') || '').trim();
    const city = (searchParams.get('city') || '').trim();
    const state = (searchParams.get('state') || '').trim();
    const country = (searchParams.get('country') || '').trim();
    const gender = (searchParams.get('gender') || '').trim();
    const yearsOfExperience = (searchParams.get('yearsOfExperience') || '').trim();

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
    if (speciality) {
      filter.specialities = { $in: [speciality] };
    }
    if (treatedSpecies) {
      filter.treatedSpecies = { $in: [treatedSpecies] };
    }
    if (interest) {
      filter.interests = { $in: [interest] };
    }
    if (researchArea) {
      filter.researchAreas = { $in: [researchArea] };
    }
    if (monthlyGoal) {
      filter.monthlyGoal = { $gte: parseInt(monthlyGoal) };
    }
    if (experienceYears) {
      filter.experienceYears = { $regex: experienceYears, $options: 'i' };
    }
    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }
    if (state) {
      filter.state = { $regex: state, $options: 'i' };
    }
    if (country) {
      filter.country = { $regex: country, $options: 'i' };
    }
    if (gender) {
      filter.gender = gender.toLowerCase();
    }
    if (yearsOfExperience) {
      filter.yearsOfExperience = { $regex: yearsOfExperience, $options: 'i' };
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


