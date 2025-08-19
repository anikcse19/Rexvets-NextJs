import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest, res: NextResponse) => {
  const userHeader = req.headers.get("user");
  const user = userHeader ? JSON.parse(userHeader) : null;
  return NextResponse.json({ message: "Hello from the test API route!", user });
};
