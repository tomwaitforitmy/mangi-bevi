#!/usr/bin/env node
/*
  Repro script for concurrent edit overwrites against Firebase Realtime DB REST API.
  Usage:
    FIREBASE_BASE="https://.../" FIREBASE_TOKEN="<token>" node tests/concurrent-edit-repro.js

  If no token is provided the script will try unauthenticated access.

  Run with: node tests/concurrent-edit-repro.js
*/

(async () => {
  // small fetch shim for Node versions without global fetch
  let fetchFn;
  if (typeof fetch === "function") {
    fetchFn = fetch;
  } else {
    try {
      // node-fetch v2/v3 interop
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nf = require("node-fetch");
      fetchFn = nf.default || nf;
    } catch (err) {
      console.error(
        "Please run on Node 18+ or install node-fetch: npm install node-fetch",
      );
      process.exit(1);
    }
  }

  const BASE = (
    process.env.FIREBASE_BASE ||
    "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/"
  ).replace(/\/+$/g, "/");
  const TOKEN = process.env.FIREBASE_TOKEN;
  const auth = TOKEN ? `?auth=${TOKEN}` : "";

  function url(path) {
    return `${BASE}${path}.json${auth}`;
  }

  async function safeJson(res) {
    try {
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  try {
    console.log("Fetching meals list...");
    const listRes = await fetchFn(url("meals"));
    const list = (await safeJson(listRes)) || {};
    let mealId = Object.keys(list)[0];

    if (!mealId) {
      console.log(
        "No meal found, creating a test meal (requires write access)...",
      );
      const createRes = await fetchFn(url("meals"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "concurrent-repro",
          links: [],
          imageUrls: [],
          reactions: [],
        }),
      });
      const createData = await safeJson(createRes);
      mealId = createData && createData.name;
      if (!mealId) {
        console.error(
          "Failed to create a meal. Check permissions or provide FIREBASE_TOKEN.",
        );
        process.exit(2);
      }
      console.log("Created meal", mealId);
    } else {
      console.log("Using existing meal", mealId);
    }

    const mealUrl = url(`meals/${mealId}`);

    console.log("Fetching current meal snapshot...");
    const snapRes = await fetchFn(mealUrl);
    const snap = await safeJson(snapRes);
    if (!snap) {
      console.error("Failed to read meal snapshot");
      process.exit(2);
    }

    const payloadA = { ...snap, links: [...(snap.links || []), "link-from-A"] };
    const payloadB = {
      ...snap,
      title: (snap.title || "untitled") + " - B",
      imageUrls: [...(snap.imageUrls || []), "img-from-B"],
    };

    console.log("Sending two concurrent PATCHes (A and B)...");
    const [rA, rB] = await Promise.all([
      fetchFn(mealUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadA),
      }),
      fetchFn(mealUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadB),
      }),
    ]);

    console.log("PATCH responses:", rA.status, rB.status);

    const finalRes = await fetchFn(mealUrl);
    const finalObj = await safeJson(finalRes);

    console.log("Final meal:", JSON.stringify(finalObj, null, 2));

    const hasLinkA = (finalObj.links || []).includes("link-from-A");
    const hasImgB = (finalObj.imageUrls || []).includes("img-from-B");
    const titleMatched = finalObj.title && finalObj.title.includes("- B");

    if (hasLinkA && hasImgB && titleMatched) {
      console.log("SUCCESS: both concurrent updates preserved.");
      process.exit(0);
    } else {
      console.error("FAIL: concurrent updates were lost or overwritten.");
      console.error(
        `hasLinkA=${hasLinkA} hasImgB=${hasImgB} titleMatched=${titleMatched}`,
      );
      process.exit(2);
    }
  } catch (err) {
    console.error("Error running repro:", err);
    process.exit(2);
  }
})();
