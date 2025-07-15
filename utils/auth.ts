export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  getToken: () => Promise<string | null>,
  refreshToken: () => Promise<any>
): Promise<Response> {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token available");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    try {
      await refreshToken();
      const newToken = await getToken();

      if (newToken) {
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      return response;
    }
  }

  return response;
}

export function getTokenFromCookie(
  cookieName: string = "firebase-auth-token"
): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${cookieName}=`)
  );

  if (tokenCookie) {
    return tokenCookie.split("=")[1];
  }

  return null;
}

export function setTokenInCookie(
  token: string,
  cookieName: string = "firebase-auth-token"
): void {
  if (typeof document === "undefined") return;

  document.cookie = `${cookieName}=${token}; path=/; samesite=lax`;
}

export function removeTokenFromCookie(
  cookieName: string = "firebase-auth-token"
): void {
  if (typeof document === "undefined") return;

  document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}
