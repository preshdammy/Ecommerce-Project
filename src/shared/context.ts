// types/context.ts
export interface ContextType {
  user?: {
    email: string;
    [key: string]: any;
  };
}
