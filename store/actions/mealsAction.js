import { HandleResponseError } from "../../common_functions/HandleResponseError";
import Meal from "../../models/Meal";
import { UPDATE_USER_STATS } from "./usersAction";
import * as usersAction from "./usersAction";
import * as authAction from "./authAction";
import { DEV_MODE } from "../../data/Environment";
import { UnlinkMeals } from "../../common_functions/UnlinkMeals";
import {
  getMealsUrl,
  getMealUrl,
  getPublicMealsUrl,
} from "../../firebase/urls";
import { runOptimisticTransaction } from "../../firebase/optimisticTransaction";
import deleteImages from "../../image_processing/deleteImages";

export const DELETE_MEAL = "DELETE_MEAL";
export const CREATE_MEAL = "CREATE_MEAL";
export const EDIT_MEAL = "EDIT_MEAL";
export const EDIT_LINKS = "EDIT_LINKS";
export const EDIT_REACTIONS = "EDIT_REACTIONS";
export const SET_MEALS = "SET_MEALS";

export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

export const toggleFavorite = (id) => {
  return { type: TOGGLE_FAVORITE, mealId: id };
};

export const fetchMeals = () => {
  return async (dispatch) => {
    console.log("Begin fetchMeals");
    try {
      const response = await fetch(getPublicMealsUrl());

      await HandleResponseError(response);

      const responseData = await response.json();
      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push(
          Meal(
            responseData[key].title,
            key,
            responseData[key].primaryImageUrl,
            responseData[key].ingredients,
            responseData[key].steps,
            responseData[key].imageUrls ? responseData[key].imageUrls : [],
            responseData[key].tags ? responseData[key].tags : [],
            responseData[key].rating ? responseData[key].rating : 0,
            responseData[key].authorId ? responseData[key].authorId : "error",
            responseData[key].creationDate
              ? new Date(responseData[key].creationDate).toISOString()
              : "error",
            responseData[key].editorId ? responseData[key].editorId : "error",
            responseData[key].editDate
              ? new Date(responseData[key].editDate).toISOString()
              : "error",
            responseData[key].links ? responseData[key].links : [],
            responseData[key].isTestMangi
              ? responseData[key].isTestMangi
              : false,
            responseData[key].reactions ? responseData[key].reactions : [],
          ),
        );
      }

      //Invert order to show newest
      loadedMeals.reverse();

      dispatch({
        type: SET_MEALS,
        meals: loadedMeals,
      });
      //Update the statistics and the user meals data.
      //This is possible the first time after we received all meals.
      dispatch({
        type: UPDATE_USER_STATS,
        meals: loadedMeals,
      });
    } catch (error) {
      throw error;
    }
  };
};

const replacer = (key, value) => {
  if (key === "id") {
    return undefined;
    //do not upload this to firebase
  } else if (key === "isSelected") {
    return undefined;
  } else {
    return value;
  }
};

export const mergeArrays = (current = [], next = []) => {
  if (!Array.isArray(current)) {
    current = [];
  }
  if (!Array.isArray(next)) {
    next = [];
  }

  const isPrimitiveValue = (v) =>
    v === null || (typeof v !== "object" && typeof v !== "function");

  if (current.length === 0 && next.length === 0) {
    return [];
  }
  if (
    (current.every(isPrimitiveValue) || current.length === 0) &&
    next.every(isPrimitiveValue)
  ) {
    return Array.from(new Set([...current, ...next]));
  }

  const keyFor = (item) => {
    if (item == null) {
      return "__null__";
    }
    if (isPrimitiveValue(item)) {
      return `prim:${String(item)}`;
    }
    if (item.id !== undefined) {
      return `id:${item.id}`;
    }
    if (item.authorId !== undefined) {
      return `author:${item.authorId}`;
    }
    try {
      return `json:${JSON.stringify(item)}`;
    } catch (e) {
      return `obj:${String(item)}`;
    }
  };

  const seen = new Set();
  const out = [];

  for (const it of current) {
    const k = keyFor(it);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }

  for (const it of next) {
    const k = keyFor(it);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }

  return out;
};

const isPrimitiveValue = (v) =>
  v === null || (typeof v !== "object" && typeof v !== "function");

const itemKey = (item) => {
  if (item == null) {
    return "__null__";
  }
  if (typeof item !== "object") {
    return `prim:${String(item)}`;
  }
  if (item.id !== undefined) {
    return `id:${item.id}`;
  }
  if (item.authorId !== undefined) {
    return `author:${item.authorId}`;
  }
  try {
    return `json:${JSON.stringify(item)}`;
  } catch (e) {
    return `obj:${String(item)}`;
  }
};

const itemEquals = (a, b) => {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (e) {
    return false;
  }
};

/**
 * Aligns `side` against `original` using a longest-common-subsequence match
 * (by exact value equality). For each index in `original`, this tells us
 * whether that element survived unchanged in `side` — which lets deletions
 * be detected correctly even when later elements shift position because of
 * unrelated insertions/removals elsewhere in the array.
 *
 * Returns:
 *  - matchForOriginalIndex[i]: index into `side` that exactly matches
 *    original[i], or -1 if original[i] has no surviving match in `side`
 *    (i.e. it was removed or replaced).
 *  - gapsBeforeOriginalIndex[i]: items in `side` that sit in the gap
 *    immediately before original index i (or, at i === original.length,
 *    after the last original item) and aren't part of the LCS match —
 *    i.e. brand-new insertions at that position.
 */
const alignToOriginal = (original, side) => {
  const n = original.length;
  const m = side.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (original[i] === side[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const matchForOriginalIndex = new Array(n).fill(-1);
  const gapsBeforeOriginalIndex = Array.from({ length: n + 1 }, () => []);

  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (original[i] === side[j]) {
      matchForOriginalIndex[i] = j;
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      gapsBeforeOriginalIndex[i].push(side[j]);
      j += 1;
    }
  }
  while (j < m) {
    gapsBeforeOriginalIndex[n].push(side[j]);
    j += 1;
  }

  return { matchForOriginalIndex, gapsBeforeOriginalIndex };
};

/**
 * Resolve what happens to a single slot that existed in `original`, given
 * what (if anything) `edited` and `server` have for that slot now. Returns
 * an array of 0, 1, or 2 items to keep, in final order.
 *
 * - Both removed it -> gone.
 * - One side removed it, the other left it unchanged -> gone (removal wins
 *   over a no-op).
 * - One side removed it, the other actually changed it -> the edit
 *   survives (a real edit elsewhere shouldn't be lost to a stale removal).
 * - Neither removed it:
 *     unchanged/unchanged -> original
 *     changed/unchanged   -> the changed side's version
 *     changed/changed, same result      -> one copy
 *     changed/changed, different results -> both, server's edit first
 */
const resolveSlot = (
  originalItem,
  editedPresent,
  editedItem,
  serverPresent,
  serverItem,
) => {
  const editedChanged = editedPresent && !itemEquals(editedItem, originalItem);
  const serverChanged = serverPresent && !itemEquals(serverItem, originalItem);

  if (!editedPresent && !serverPresent) {
    return [];
  }
  if (!editedPresent) {
    return serverChanged ? [serverItem] : [];
  }
  if (!serverPresent) {
    return editedChanged ? [editedItem] : [];
  }
  if (!editedChanged && !serverChanged) {
    return [originalItem];
  }
  if (editedChanged && !serverChanged) {
    return [editedItem];
  }
  if (!editedChanged && serverChanged) {
    return [serverItem];
  }
  if (itemEquals(editedItem, serverItem)) {
    return [editedItem];
  }
  return [serverItem, editedItem];
};

/**
 * Three-way merge for arrays of plain values (steps, ingredients, tags,
 * links). Primitive values carry no identity beyond their content, so each
 * side is first aligned against `original` via LCS — this correctly tells
 * apart "removed", "edited in place", and "newly inserted" even when
 * unrelated insertions/removals elsewhere shift array positions.
 *
 * LCS (longest common subsequence) alone can't recognize "the same slot was
 * edited on both sides" when neither side's new text matches the old text
 * (no shared content to anchor on). When that happens, original[i] shows up
 * as unmatched (deleted) on both sides, with each side's replacement text
 * appearing as an insertion in the gap right after it. Since primitive arrays
 * can't hold duplicates, content alone can't disambiguate that from two
 * unrelated insertions — so a reconciliation pass falls back to position:
 * if both sides are missing exactly this one original item, and each
 * contributes exactly one insertion at this same gap, it's treated as one
 * in-place edit conflict rather than two independent new items.
 */
const mergeThreeWayPrimitiveArray = (baseOriginal, baseEdited, baseServer) => {
  const result = [];
  const seen = new Set();
  const addResultItem = (item) => {
    const key = `prim:${String(item)}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  };

  const editedAlign = alignToOriginal(baseOriginal, baseEdited);
  const serverAlign = alignToOriginal(baseOriginal, baseServer);

  const len = baseOriginal.length;

  const consumedFromEditedGap = new Set();
  const consumedFromServerGap = new Set();
  const reconciledKept = new Array(len).fill(null);

  for (let i = 0; i < len; i += 1) {
    if (editedAlign.matchForOriginalIndex[i] !== -1) continue;
    if (serverAlign.matchForOriginalIndex[i] !== -1) continue;

    const editedGap = editedAlign.gapsBeforeOriginalIndex[i + 1];
    const serverGap = serverAlign.gapsBeforeOriginalIndex[i + 1];
    if (editedGap.length === 1 && serverGap.length === 1) {
      reconciledKept[i] = resolveSlot(
        baseOriginal[i],
        true,
        editedGap[0],
        true,
        serverGap[0],
      );
      consumedFromEditedGap.add(i + 1);
      consumedFromServerGap.add(i + 1);
    }
  }

  for (let i = 0; i <= len; i += 1) {
    if (i < len) {
      if (reconciledKept[i] !== null) {
        for (const item of reconciledKept[i]) {
          addResultItem(item);
        }
      } else {
        const originalItem = baseOriginal[i];
        const editedIdx = editedAlign.matchForOriginalIndex[i];
        const serverIdx = serverAlign.matchForOriginalIndex[i];
        const editedPresent = editedIdx !== -1;
        const serverPresent = serverIdx !== -1;
        const kept = resolveSlot(
          originalItem,
          editedPresent,
          editedPresent ? baseEdited[editedIdx] : undefined,
          serverPresent,
          serverPresent ? baseServer[serverIdx] : undefined,
        );
        for (const item of kept) {
          addResultItem(item);
        }
      }
    }

    // Insertions that sit right before (or, at i === len, after) this slot
    // — edited's insertions first, then server's — skipping any gap already
    // consumed by the reconciliation pass above.
    if (!consumedFromEditedGap.has(i)) {
      for (const item of editedAlign.gapsBeforeOriginalIndex[i]) {
        addResultItem(item);
      }
    }
    if (!consumedFromServerGap.has(i)) {
      for (const item of serverAlign.gapsBeforeOriginalIndex[i]) {
        addResultItem(item);
      }
    }
  }

  return result;
};

/**
 * Three-way merge for arrays of identifiable objects (reactions, etc. keyed
 * by `id` or `authorId`). Identity survives edits here, so items are
 * matched by key rather than position/content.
 */
const mergeThreeWayKeyedArray = (baseOriginal, baseEdited, baseServer) => {
  const editedByKey = new Map(baseEdited.map((item) => [itemKey(item), item]));
  const serverByKey = new Map(baseServer.map((item) => [itemKey(item), item]));
  const originalByKey = new Map(
    baseOriginal.map((item) => [itemKey(item), item]),
  );

  const result = [];
  const seen = new Set();
  const addResultItem = (item) => {
    const key = itemKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  };

  for (const originalItem of baseOriginal) {
    const key = itemKey(originalItem);
    const editedPresent = editedByKey.has(key);
    const serverPresent = serverByKey.has(key);
    const kept = resolveSlot(
      originalItem,
      editedPresent,
      editedByKey.get(key),
      serverPresent,
      serverByKey.get(key),
    );
    for (const item of kept) {
      addResultItem(item);
    }
  }

  // Brand-new items (not present in original) — edited first, then server.
  for (const item of baseEdited) {
    if (!originalByKey.has(itemKey(item))) {
      addResultItem(item);
    }
  }
  for (const item of baseServer) {
    if (!originalByKey.has(itemKey(item))) {
      addResultItem(item);
    }
  }

  return result;
};

const mergeThreeWayArrays = (original = [], edited = [], server = []) => {
  const baseOriginal = Array.isArray(original) ? original : [];
  const baseEdited = Array.isArray(edited) ? edited : [];
  const baseServer = Array.isArray(server) ? server : [];

  if (baseOriginal.every(isPrimitiveValue)) {
    return mergeThreeWayPrimitiveArray(baseOriginal, baseEdited, baseServer);
  }

  return mergeThreeWayKeyedArray(baseOriginal, baseEdited, baseServer);
};

export const threeWayMerge = (
  originalMeal = {},
  editedMeal = {},
  serverMeal = {},
) => {
  const baseOriginal = originalMeal || {};
  const baseEdited = editedMeal || {};
  const baseServer = serverMeal || {};

  const result = {
    ...baseServer,
    ...baseEdited,
    title:
      baseEdited.title !== undefined && baseEdited.title !== baseOriginal.title
        ? baseEdited.title
        : baseServer.title,
    ingredients: mergeThreeWayArrays(
      baseOriginal.ingredients,
      baseEdited.ingredients,
      baseServer.ingredients,
    ),
    steps: mergeThreeWayArrays(
      baseOriginal.steps,
      baseEdited.steps,
      baseServer.steps,
    ),
    imageUrls: mergeThreeWayArrays(
      baseOriginal.imageUrls,
      baseEdited.imageUrls,
      baseServer.imageUrls,
    ),
    tags: mergeThreeWayArrays(
      baseOriginal.tags,
      baseEdited.tags,
      baseServer.tags,
    ),
    links: mergeThreeWayArrays(
      baseOriginal.links,
      baseEdited.links,
      baseServer.links,
    ),
    reactions: mergeThreeWayArrays(
      baseOriginal.reactions,
      baseEdited.reactions,
      baseServer.reactions,
    ),
  };

  return result;
};

export const buildMealUpdatePayload = (currentMeal, nextMealEdit) => {
  const payload = {
    ...currentMeal,
    ...nextMealEdit,
    ingredients: mergeArrays(currentMeal.ingredients, nextMealEdit.ingredients),
    steps: mergeArrays(currentMeal.steps, nextMealEdit.steps),
    imageUrls: mergeArrays(currentMeal.imageUrls, nextMealEdit.imageUrls),
    tags: mergeArrays(currentMeal.tags, nextMealEdit.tags),
    links: mergeArrays(currentMeal.links, nextMealEdit.links),
    reactions: mergeArrays(currentMeal.reactions, nextMealEdit.reactions),
  };
  return payload;
};

export const createMeal = (meal) => {
  return async (dispatch) => {
    console.log("Begin createMeal");
    const token = await authAction.getToken();

    if (DEV_MODE) {
      meal.isTestMangi = true;
    }

    const response = await fetch(getMealsUrl(token), {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(meal, replacer),
    });

    await HandleResponseError(response);

    const responseData = await response.json();

    meal = { ...meal, id: responseData.name };

    console.log("End createMeal");

    dispatch({ type: CREATE_MEAL, meal: meal });

    return responseData.name;
  };
};

export const editMeal = (meal) => {
  return async (dispatch) => {
    console.log("begin edit meal");
    const token = await authAction.getToken();
    const resourceUrl = getMealUrl(meal.id, token);

    const updatedMeal = await runOptimisticTransaction(resourceUrl, (current) =>
      buildMealUpdatePayload(current || {}, meal),
    );

    console.log("end edit meal");

    dispatch({
      type: EDIT_MEAL,
      meal: { ...meal, ...updatedMeal, id: meal.id },
    });
  };
};

export const editLinks = (meal) => {
  return async (dispatch) => {
    console.log("begin edit links");
    const token = await authAction.getToken();
    const resourceUrl = getMealUrl(meal.id, token);

    const updatedMeal = await runOptimisticTransaction(
      resourceUrl,
      (current) => {
        const currentLinks = current?.links || [];
        return {
          ...current,
          links: mergeArrays(currentLinks, meal.links),
        };
      },
    );

    console.log("end edit links");

    dispatch({
      type: EDIT_LINKS,
      meal: { ...updatedMeal, id: meal.id },
    });
  };
};

export const editReactions = (meal, userId, newReaction) => {
  return async (dispatch) => {
    console.log("begin edit reactions");
    const token = await authAction.getToken();
    const resourceUrl = getMealUrl(meal.id, token);

    try {
      const updatedMeal = await runOptimisticTransaction(
        resourceUrl,
        (current) => {
          const currentReactions = current?.reactions || [];
          const updatedReactions = currentReactions.filter(
            (r) => r.authorId !== userId,
          );
          if (newReaction.emoji !== "") {
            updatedReactions.push(newReaction);
          }

          return {
            ...current,
            reactions: updatedReactions,
          };
        },
      );

      console.log("updated reaction successfully");

      dispatch({
        type: EDIT_REACTIONS,
        meal: { ...updatedMeal, id: meal.id },
      });

      console.log("end of edit reactions");
    } catch (error) {
      console.error("Error editing reactions:", error);
      throw error;
    }
  };
};

export const deleteMeal = (meal, user, allMeals) => {
  return async (dispatch, getState) => {
    console.log("begin delete meal");

    if (!DEV_MODE && meal.authorId !== user.id) {
      console.error(
        `Attempting to delete ${meal.title} where ${user.name} is not the author`,
      );
      return;
    }

    //remove all links
    const mealsToRemoveLinks = UnlinkMeals(meal, [], allMeals);
    console.log("mealsToRemoveLinks", mealsToRemoveLinks);
    await Promise.all(
      mealsToRemoveLinks.map(async (item) => {
        await dispatch(editLinks(item));
      }),
    );

    const imageUploadTarget = getState().features.features.imageUpload;
    await deleteImages(meal.imageUrls, imageUploadTarget);

    const token = await authAction.getToken();
    const response = await fetch(getMealUrl(meal.id, token), {
      method: "DELETE",
    });
    await HandleResponseError(response);
    if (response.ok) {
      console.log("Successfully deleted meal");
    }

    dispatch({ type: DELETE_MEAL, meal: meal });

    //Remove the meal from the user's list as well
    const editedUser = { ...user };
    editedUser.meals = user.meals.filter((m) => m !== meal.id);
    await dispatch(usersAction.editUser(editedUser));

    //todo:
    //Remove mark as cooked entries
    console.log("end delete meal");
    return editedUser;
  };
};
