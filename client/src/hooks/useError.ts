import { useState, useCallback } from "react";
import type { ErrorType } from "../types";

export const useError = () => {
  const [error, setError] = useState<ErrorType>({
    status: false,
    message: "",
  });

  const handleSetError = useCallback((error: ErrorType) => {
    setError(error);
  }, []);

  return { error, handleSetError };
};
