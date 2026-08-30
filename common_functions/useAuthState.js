import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase/firebase";

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  return isAuthenticated;
}
