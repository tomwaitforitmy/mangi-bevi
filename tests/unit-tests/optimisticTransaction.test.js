import { runFirebaseTransaction } from "../../firebase/optimisticTransaction";

describe("runFirebaseTransaction", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = undefined;
    jest.resetAllMocks();
  });

  it("retries when the first write returns 412 and succeeds on retry", async () => {
    const resourceUrl = "https://example.com/meals/test.json";
    const existing = { title: "old", links: ["a"] };
    const etag = '"123abc"';

    const makeHeaders = (etagValue) => ({
      get: (name) => (name.toLowerCase() === "etag" ? etagValue : null),
    });

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => existing,
        headers: makeHeaders(etag),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 412,
        json: async () => ({ error: { message: "Precondition Failed" } }),
        headers: makeHeaders(etag),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => existing,
        headers: makeHeaders(etag),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ title: "new", links: ["a", "b"] }),
        headers: makeHeaders(etag),
      });

    const result = await runFirebaseTransaction(
      resourceUrl,
      (current) => ({
        ...current,
        links: ["a", "b"],
      }),
      { maxRetries: 3, backoffBase: 1 },
    );

    expect(result.links).toEqual(["a", "b"]);
    expect(global.fetch).toHaveBeenCalledTimes(4);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      resourceUrl,
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ "X-Firebase-ETag": "true" }),
      }),
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      resourceUrl,
      expect.objectContaining({
        method: "PATCH",
        headers: expect.objectContaining({ "If-Match": etag }),
      }),
    );
  });
});
