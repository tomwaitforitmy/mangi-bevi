import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import EditMangiIcon from "./EditMangiIcon";
import { GetAuthorByMealId } from "../../common_functions/GetAuthorName";
import { HasEditPermission } from "../../common_functions/HasEditPermission";
import { GetFriends } from "../../common_functions/GetFriends";

// Shared by the meal-detail and images routes: only render the header edit
// icon when the current user has permission to edit this meal (author or
// friend of the author) — the same check the old central navigation file
// made via `showEditIcon`, preserved verbatim per constitution Principle III.
export default function EditIconOrNull({ mealId, currentTab }) {
  const users = useSelector((state) => state.users.users);
  const user = useSelector((state) => state.users.user);

  const author = GetAuthorByMealId(mealId, users);
  const authorFriends = author ? GetFriends(author.id, users) : undefined;
  const hasPermission = author
    ? HasEditPermission(user, author.id, authorFriends)
    : false;

  // TEMPORARY DEBUG — remove once the ghost-icon regression is diagnosed.
  // Logs every render (mount + re-render) of this component with everything
  // the permission decision depends on, plus mount/unmount so we can tell a
  // stale native header view apart from a genuine logic bug: if this log's
  // last line for a meal says "HIDDEN" but the icon is still visible on
  // screen, it's a native rendering artifact, not a JS bug.
  const instanceId = useRef(Math.random().toString(36).slice(2, 8));
  useEffect(() => {
    console.log(
      `[EditIconOrNull ${instanceId.current}] MOUNTED mealId=${mealId}`,
    );
    return () =>
      console.log(
        `[EditIconOrNull ${instanceId.current}] UNMOUNTED mealId=${mealId}`,
      );
  }, [mealId]);
  console.log(`[EditIconOrNull ${instanceId.current}] RENDER`, {
    mealId,
    currentTab,
    userId: user?.id,
    userName: user?.name,
    authorId: author?.id,
    authorName: author?.name,
    authorFriends,
    hasPermission,
    decision: !author ? "HIDDEN (no author found)" : hasPermission ? "SHOWN" : "HIDDEN (no permission)",
  });

  if (!author) {
    return null;
  }

  if (!hasPermission) {
    return null;
  }

  return <EditMangiIcon mealId={mealId} currentTab={currentTab} />;
}
