import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthState } from "../../common_functions/useAuthState";

// Unconditional deep-link entry point: the only file that owns /meal/[mealId].
// Immediately forwards to the correct internal path for the current auth
// state (see research.md Decision 3 — the two auth groups deliberately do
// NOT share this path, since Expo Router's own docs warn that a shared path
// across two Stack.Protected-gated groups can't be resolved from the URL
// alone). In-app navigation never lands here — it already knows its auth
// context and pushes the internal path directly.
export default function MealDeepLinkRedirect() {
  const { mealId, mealTitle } = useLocalSearchParams();
  const router = useRouter();
  const isAuthenticated = useAuthState();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace({
        pathname: "/meals/meal/[mealId]",
        params: { mealId, mealTitle },
      });
    } else {
      router.replace({
        pathname: "/detail/[mealId]",
        params: { mealId, mealTitle },
      });
    }
  }, [isAuthenticated, mealId, mealTitle, router]);

  return null;
}
