import { useAuth } from "./useAuth";
import { authenticatedFetch } from "@/utils/auth";

export const useAuthenticatedFetch = () => {
  const { user, refreshToken } = useAuth();

  const getToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  };

  const authFetch = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return authenticatedFetch(url, options, getToken, refreshToken);
  };

  return { authFetch };
};
