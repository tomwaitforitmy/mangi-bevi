#!/usr/bin/env node
/*
  Repro script using Firebase Authentication (email/password) and the Realtime
  Database REST API to demonstrate concurrent update overwrites.

  The script signs in using EXPO_FIREBASE_API_KEY, FIREBASE_AUTH_EMAIL, and
  FIREBASE_AUTH_PASSWORD from .env and then performs two overlapping PATCH writes
  to the same meal.

  Run: node tests/concurrent-edit-repro.js
*/

require("dotenv").config();

const API_KEY = process.env.EXPO_FIREBASE_API_KEY;
const EMAIL = process.env.FIREBASE_AUTH_EMAIL;
const PASSWORD = process.env.FIREBASE_AUTH_PASSWORD;
const DATABASE_URL = (
  process.env.FIREBASE_BASE ||
  "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app"
).replace(/\/+$/g, "");

if (!API_KEY || !EMAIL || !PASSWORD) {
  console.error(
    "Missing EXPO_FIREBASE_API_KEY, FIREBASE_AUTH_EMAIL, or FIREBASE_AUTH_PASSWORD in .env",
  );
  process.exit(2);
}

const BASE_URL = `${DATABASE_URL}/`;

async function signIn() {
  const resp = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
        returnSecureToken: true,
      }),
    },
  );

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Sign-in failed: ${resp.status} ${body}`);
  }

  const data = await resp.json();
  return data.idToken;
}

function dbUrl(path, token) {
  return `${BASE_URL}${path}.json?auth=${encodeURIComponent(token)}`;
}

async function fetchJson(url, options = {}) {
  const resp = await fetch(url, options);
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

(async () => {
  try {
    const token = await signIn();
    console.log("Signed in, token length:", token.length);

    const mealsUrl = dbUrl("meals", token);
    const createRes = await fetchJson(mealsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `concurrent-repro-${Date.now()}`,
        links: [],
        imageUrls: [],
        reactions: [],
        isTestMangi: true,
        ingredients: ["Test ingredient"],
        steps: ["Test step"],
      }),
    });
    const mealId = createRes.name;
    console.log("Created fresh test meal", mealId);

    const mealUrl = dbUrl(`meals/${mealId}`, token);
    const meal = await fetchJson(mealUrl);
    if (!meal) {
      throw new Error("Failed to read fresh meal");
    }
    console.log("Fresh meal links before updates:", meal.links);

    // Simulate the actual bug: one user updates links while another user saves a
    // stale full meal payload that does not include the new link.
    const linkUpdate = { links: [...(meal.links || []), "link-from-A"] };
    const staleFullMeal = {
      ...meal,
      links: meal.links || [],
      title: (meal.title || "untitled") + " - stale",
    };

    console.log("Applying a link update, then a stale full-meal edit...");
    await fetchJson(mealUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(linkUpdate),
    });

    await fetchJson(mealUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staleFullMeal),
    });

    const final = await fetchJson(mealUrl);
    console.log("Final meal:", JSON.stringify(final, null, 2));

    const hasLinkA = (final.links || []).includes("link-from-A");
    const hasImgB = (final.imageUrls || []).includes("img-from-B");
    const titleMatched = final.title && final.title.includes("- B");

    if (hasLinkA && hasImgB && titleMatched) {
      console.log("SUCCESS: both concurrent updates preserved.");
      process.exit(0);
    }

    console.error("FAIL: concurrent updates were lost or overwritten.");
    console.error(
      `hasLinkA=${hasLinkA} hasImgB=${hasImgB} titleMatched=${titleMatched}`,
    );
    process.exit(2);
  } catch (err) {
    console.error("Error running repro:", err);
    process.exit(2);
  }
})();
