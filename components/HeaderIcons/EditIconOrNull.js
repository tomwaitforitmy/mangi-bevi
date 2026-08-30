import { View } from "react-native";
import { useSelector } from "react-redux";
import EditMangiIcon from "./EditMangiIcon";
import { GetAuthorByMealId } from "../../common_functions/GetAuthorName";
import { HasEditPermission } from "../../common_functions/HasEditPermission";
import { GetFriends } from "../../common_functions/GetFriends";
import { HEADER_ICON_CONTAINER_STYLE } from "./HeaderIconConfig";

// Same-sized, non-interactive stand-in for the "no permission" case. Never
// returning `null` here matters: toggling headerRight between an element and
// `null` is what triggers native-stack's header-button transition snapshot
// (the empty-but-tappable/ghost icon bug this file exists to prevent).
const EmptyHeaderSlot = () => (
  <View testID="edit-meal-icon-empty-slot" style={HEADER_ICON_CONTAINER_STYLE} />
);

// Shared by the meal-detail and images routes: only render the header edit
// icon when the current user has permission to edit this meal (author or
// friend of the author) — the same check the old central navigation file
// made via `showEditIcon`, preserved verbatim per constitution Principle III.
export default function EditIconOrNull({ mealId, currentTab }) {
  const users = useSelector((state) => state.users.users);
  const user = useSelector((state) => state.users.user);

  const author = GetAuthorByMealId(mealId, users);
  if (!author) {
    return <EmptyHeaderSlot />;
  }

  const authorFriends = GetFriends(author.id, users);
  if (!HasEditPermission(user, author.id, authorFriends)) {
    return <EmptyHeaderSlot />;
  }

  return <EditMangiIcon mealId={mealId} currentTab={currentTab} />;
}
