import { useSelector } from "react-redux";
import EditMangiIcon from "./EditMangiIcon";
import EditMangiIconDisabled from "./EditMangiIconDisabled";
import { GetAuthorByMealId } from "../../common_functions/GetAuthorName";
import { HasEditPermission } from "../../common_functions/HasEditPermission";
import { GetFriends } from "../../common_functions/GetFriends";

// Shared by the meal-detail and images routes: shows the edit icon when the
// current user has permission to edit this meal (author or friend of the
// author) — the same check the old central navigation file made via
// `showEditIcon`, preserved verbatim per constitution Principle III — and a
// locked/disabled icon otherwise, so the header explicitly communicates "you
// can't edit this" rather than leaving the corner ambiguous.
export default function EditIconOrNull({ mealId, currentTab }) {
  const users = useSelector((state) => state.users.users);
  const user = useSelector((state) => state.users.user);

  const author = GetAuthorByMealId(mealId, users);
  if (!author) {
    // Author not resolved yet (e.g. still loading) — stay quiet rather than
    // flash a "locked" state that may immediately flip once data loads.
    return null;
  }

  const authorFriends = GetFriends(author.id, users);
  if (!HasEditPermission(user, author.id, authorFriends)) {
    return <EditMangiIconDisabled />;
  }

  return <EditMangiIcon mealId={mealId} currentTab={currentTab} />;
}
