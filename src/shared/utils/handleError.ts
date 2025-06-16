export function handleError(error: unknown) {
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
}