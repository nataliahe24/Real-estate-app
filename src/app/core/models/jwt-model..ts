export interface JwtPayload {
  sub: string;
  authorities: string;
  iat: number;
  exp: number;
  nbf: number;
} 