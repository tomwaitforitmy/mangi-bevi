import { HandleResponseError } from "../common_functions/HandleResponseError";

const defaultOptions = {
  maxRetries: 3,
  backoffBase: 100,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getETag = (response) => {
  if (
    !response ||
    !response.headers ||
    typeof response.headers.get !== "function"
  ) {
    return null;
  }
  return response.headers.get("ETag") || response.headers.get("etag") || null;
};

export const runFirebaseTransaction = async (
  resourceUrl,
  mergeFn,
  options = {},
) => {
  const config = { ...defaultOptions, ...options };

  for (let attempt = 1; attempt <= config.maxRetries; attempt += 1) {
    const readResponse = await fetch(resourceUrl, {
      method: "GET",
      headers: {
        "X-Firebase-ETag": "true",
      },
    });
    await HandleResponseError(readResponse);

    const currentData = await readResponse.json();
    const etag = getETag(readResponse);
    const newPayload = mergeFn(currentData || {});

    if (newPayload === undefined || newPayload === null) {
      throw new Error("runFirebaseTransaction: mergeFn must return a payload");
    }

    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(etag ? { "If-Match": etag } : {}),
      },
      body: JSON.stringify(newPayload),
    };

    const writeResponse = await fetch(resourceUrl, requestOptions);
    if (writeResponse.ok) {
      try {
        return await writeResponse.json();
      } catch (err) {
        return newPayload;
      }
    }

    if (writeResponse.status === 412 && attempt < config.maxRetries) {
      const delay = Math.random() * config.backoffBase * attempt;
      await sleep(config.backoffBase + delay);
      continue;
    }

    await HandleResponseError(writeResponse);
  }

  throw new Error(
    `runFirebaseTransaction: failed after ${config.maxRetries} attempts`,
  );
};
