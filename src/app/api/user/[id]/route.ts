import { IUser } from "@/lib";
import { authOptions } from "@/lib/auth";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import User from "@/models/User";
import { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   throw new Error("Unauthorized access");
    // }
    console.log(id);
    if (!id) {
      throw new Error("ID is required");
    }
    const user = await User.findOne({ _id: new Types.ObjectId(id) }).select(
      "-password"
    );
    if (!user) {
      throw new Error("User not found");
    }
    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "User fetched successfully",
      data: user,
    };
    return sendResponse(responseFormat);
  } catch (error: any) {
    const errResponse: IErrorResponse = {
      success: false,
      message: error.message || "Failed to fetch user",
      errorCode: "FETCH_ERROR",
      errors: null,
    };
    console.log("erorr", error);
    return throwAppError(errResponse, 500);
  }
};
