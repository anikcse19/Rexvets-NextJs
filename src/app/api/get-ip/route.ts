import ip from "ip";
import macaddress from "macaddress";
import { NextResponse } from "next/server";
export const GET = async () => {
  const myIp = ip.address();
  const mac = await macaddress.one();
  return NextResponse.json({ ip: myIp, mac });
};
