export function handleError(error: unknown) {
    console.error("Error caught:", error);
  
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  
    // Handle plain strings or objects
    if (typeof error === "string") {
      throw new Error(error);
    }
  
    throw new Error("An unknown error occurred");

  }
  

