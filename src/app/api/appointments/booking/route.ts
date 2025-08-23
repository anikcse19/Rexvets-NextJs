// import Veterinarian from "@/models/Veterinarian";
// import { NextResponse } from "next/server";

// export const GET = async () => {
//   try {
//     const response = await Veterinarian.find({ isActive: true });
//     return NextResponse.json(response, {
//       status: 200,
//       statusText: "Success",
//     });
//   } catch (error) {
//     console.error("Error fetching veterinarians:", error);
//     return NextResponse.json(
//       { message: "Error fetching veterinarians" },
//       { status: 500, statusText: "Internal Server Error" }
//     );
//   }
// };
