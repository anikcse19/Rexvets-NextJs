import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");

    if (!input) {
      return NextResponse.json(
        { error: "Input parameter is required" },
        { status: 400 }
      );
    }

    // Get Google Places API key from environment variables
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Places API key not configured" },
        { status: 500 }
      );
    }

    // Call Google Places Autocomplete API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=(cities)&key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Places API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return NextResponse.json({
      success: true,
      predictions: data.predictions || [],
    });
  } catch (error: any) {
    console.error("Places autocomplete error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch location suggestions",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
