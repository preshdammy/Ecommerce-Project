// types/context.ts

export interface ContextType {
  admin?: {
    id: string;
    email: string;
    role: string;
    iat?: number; // optional: issued at
    exp?: number; // optional: expiry
  };
}
