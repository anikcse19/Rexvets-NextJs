import { NextRequest, NextResponse } from "next/server";
import { debugCloudinaryUrl, parseCloudinaryUrl } from "@/lib/utils/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ 
        error: "URL is required and must be a string" 
      }, { status: 400 });
    }

    const debugResult = await debugCloudinaryUrl(url);
    
    return NextResponse.json({
      success: true,
      ...debugResult
    });
    
  } catch (error: any) {
    console.error("Error debugging Cloudinary URL:", error);
    return NextResponse.json(
      { error: "Failed to debug URL", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ 
        error: "URL parameter is required" 
      }, { status: 400 });
    }

    const debugResult = await debugCloudinaryUrl(url);
    
    return NextResponse.json({
      success: true,
      ...debugResult
    });
    
  } catch (error: any) {
    console.error("Error debugging Cloudinary URL:", error);
    return NextResponse.json(
      { error: "Failed to debug URL", details: error.message },
      { status: 500 }
    );
  }
}
