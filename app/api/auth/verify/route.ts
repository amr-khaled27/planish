import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Oops! We need your authentication details" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const decodedToken = await adminAuth.verifyIdToken(token);

    return NextResponse.json({
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Your session seems to have expired" },
      { status: 401 }
    );
  }
}
