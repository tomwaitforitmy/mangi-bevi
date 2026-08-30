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
  if (!author) {
    return null;
  }

  const authorFriends = GetFriends(author.id, users);
  if (!HasEditPermission(user, author.id, authorFriends)) {
    return null;
  }

  return <EditMangiIcon mealId={mealId} currentTab={currentTab} />;
}
