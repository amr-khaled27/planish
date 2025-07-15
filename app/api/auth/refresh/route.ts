import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

/**
 * Token Refresh Endpoint
 * 
 * This endpoint handles token refresh for Firebase Authentication.
 * It takes an existing ID token (even if expired) and creates a new custom token.
 * 
 * How it works:
 * 1. Receives the current ID token via Authorization header
 * 2. Verifies the token to get user information (handles expired tokens)
 * 3. Creates a new custom token for the user
 * 4. Returns the custom token that can be used to sign in again
 * 
 * Usage:
 * POST /api/auth/refresh
 * Headers: { "Authorization": "Bearer <current-id-token>" }
 * 
 * Response:
 * {
 *   "success": true,
 *   "customToken": "<new-custom-token>",
 *   "uid": "<user-id>",
 *   "message": "Token refreshed successfully"
 * }
 */

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

    // Verify the current token (even if expired, we can still get user info)
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(currentToken, true); // checkRevoked = true
    } catch (error: any) {
      // If token is expired but not revoked, we can still proceed
      if (error.code === 'auth/id-token-expired') {
        try {
          decodedToken = await adminAuth.verifyIdToken(currentToken, false); // Don't check expiration
        } catch (innerError) {
          return NextResponse.json(
            { error: "Invalid or revoked token" },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        );
      }
    }

    // Create a new custom token for the user
    const customToken = await adminAuth.createCustomToken(decodedToken.uid, {
      // Add any additional claims if needed
      refreshedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      customToken,
      uid: decodedToken.uid,
      message: "Token refreshed successfully"
    });

  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}
