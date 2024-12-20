import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: number;
}

export const extractUserIdFromToken = (token: string): number | null => {
  try {
    const decodedToken: JwtPayload = jwtDecode(token);
    return decodedToken.userId;
  } catch (error) {
    console.error("Invalid token");
    return null;
  }
};
