import UserModel, { IUser } from "@/models/User";
import PetParentModel from "@/models/PetParent";
import VeterinarianModel from "@/models/Veterinarian";
import VetTechModel from "@/models/VetTech";
import { connectToDatabase } from "@/lib/mongoose";

/**
 * Get full user data by populating references
 */
export async function getUserWithFullData(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) return null;

  let fullData: any = {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    profileImage: user.profileImage,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    fcmTokens: user.fcmTokens,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // Populate role-specific data
  switch (user.role) {
    case "pet_parent":
      if (user.petParentRef) {
        const petParent = await PetParentModel.findById(user.petParentRef);
        if (petParent) {
          fullData = { ...fullData, ...petParent.toObject() };
        }
      }
      break;
    
    case "veterinarian":
      if (user.veterinarianRef) {
        const veterinarian = await VeterinarianModel.findById(user.veterinarianRef);
        if (veterinarian) {
          fullData = { ...fullData, ...veterinarian.toObject() };
        }
      }
      break;
    
    case "technician":
      if (user.vetTechRef) {
        const vetTech = await VetTechModel.findById(user.vetTechRef);
        if (vetTech) {
          fullData = { ...fullData, ...vetTech.toObject() };
        }
      }
      break;
  }

  return fullData;
}

/**
 * Create or update user authentication record
 */
export async function createOrUpdateUserAuth(
  email: string,
  role: string,
  password?: string,
  googleData?: any
) {
  let user = await UserModel.findOne({ email });

  if (user) {
    // Update existing user
    if (password) user.password = password;
    if (googleData) {
      user.googleId = googleData.googleId;
      user.googleAccessToken = googleData.accessToken;
      user.googleRefreshToken = googleData.refreshToken;
      user.googleExpiresAt = googleData.expiresAt;
      user.googleTokenType = googleData.tokenType;
      user.googleScope = googleData.scope;
    }
    user.lastLogin = new Date();
    await user.save();
  } else {
    // Create new user
    user = new UserModel({
      email,
      role,
      password,
      isEmailVerified: googleData ? true : false,
      lastLogin: new Date(),
      ...(googleData && {
        googleId: googleData.googleId,
        googleAccessToken: googleData.accessToken,
        googleRefreshToken: googleData.refreshToken,
        googleExpiresAt: googleData.expiresAt,
        googleTokenType: googleData.tokenType,
        googleScope: googleData.scope,
      }),
    });
    await user.save();
  }

  return user;
}

/**
 * Link user auth to existing model
 */
export async function linkUserToModel(
  userId: string,
  modelId: string,
  role: string
) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  switch (role) {
    case "pet_parent":
      user.petParentRef = modelId;
      break;
    case "veterinarian":
      user.veterinarianRef = modelId;
      break;
    case "technician":
      user.vetTechRef = modelId;
      break;
  }

  await user.save();
  return user;
}

/**
 * Get user by email with role-specific data
 */
export async function getUserByEmailWithData(email: string) {
  const user = await UserModel.findOne({ email, isActive: true, isDeleted: false });
  if (!user) return null;

  return getUserWithFullData(user._id.toString());
}

/**
 * Check if a user is a veterinarian and get their veterinarian data
 */
export async function checkVeterinarianStatus(userId: string) {
  try {
    await connectToDatabase();
    
    // First check if user exists and has veterinarian role
    const user = await UserModel.findById(userId);
    if (!user) {
      return { isVeterinarian: false, error: "User not found" };
    }
    
    if (user.role !== "veterinarian") {
      return { isVeterinarian: false, error: "User is not a veterinarian" };
    }
    
    // Check if veterinarian profile exists using the reference
    if (!user.veterinarianRef) {
      return { isVeterinarian: false, error: "Veterinarian profile not found" };
    }
    
    const veterinarian = await VeterinarianModel.findById(user.veterinarianRef);
    if (!veterinarian) {
      return { isVeterinarian: false, error: "Veterinarian profile not found" };
    }
    
    return { isVeterinarian: true, veterinarian };
  } catch (error) {
    console.error("Error checking veterinarian status:", error);
    return { isVeterinarian: false, error: "Database error" };
  }
}
