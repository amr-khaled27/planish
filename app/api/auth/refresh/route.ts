import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Get the current ID token from the Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header with Bearer token is required" },
        { status: 401 }
      );
    }

    const currentToken = authHeader.substring(7);

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(currentToken, true); // checkRevoked = true
    } catch (error: any) {
      if (error.code === "auth/id-token-expired") {
        try {
          decodedToken = await adminAuth.verifyIdToken(currentToken, false); // Don't check expiration
        } catch (innerError) {
          return NextResponse.json(
            { error: "Invalid or revoked token" },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    const customToken = await adminAuth.createCustomToken(decodedToken.uid, {
      refreshedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      customToken,
      uid: decodedToken.uid,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}
