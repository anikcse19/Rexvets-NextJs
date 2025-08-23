import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";
import PetParentModel from "@/models/PetParent";
import VeterinarianModel from "@/models/Veterinarian";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get some sample users for testing
    const users = await UserModel.find({ isActive: true, isDeleted: { $ne: true } })
      .limit(5)
      .select('_id email role');
    
    // Get some sample pet parents
    const petParents = await PetParentModel.find({ isActive: true, isDeleted: { $ne: true } })
      .limit(5)
      .select('_id name email');
    
    // Get some sample veterinarians
    const veterinarians = await VeterinarianModel.find({ isActive: true, isDeleted: { $ne: true } })
      .limit(5)
      .select('_id name email specialization');
    
    return NextResponse.json({
      success: true,
      message: "Test IDs fetched successfully",
      data: {
        users,
        petParents,
        veterinarians,
        sampleReviewRequest: {
          rating: 5,
          comment: "Excellent service! Dr. Smith was very knowledgeable and caring.",
          appointmentDate: "August 15, 2024",
          doctorId: veterinarians[0]?._id || "REPLACE_WITH_VALID_DOCTOR_ID",
          parentId: petParents[0]?._id || "REPLACE_WITH_VALID_PARENT_ID",
          visible: true
        }
      }
    });
  } catch (error) {
    console.error("Error fetching test IDs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch test IDs",
        errorCode: "FETCH_ERROR",
        errors: null
      },
      { status: 500 }
    );
  }
}
