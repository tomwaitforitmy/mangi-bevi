import { renderHook, act, waitFor } from "@testing-library/react-native";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "../../common_functions/useAuthState";

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock("../../firebase/firebase", () => ({
  firebaseAuth: {},
}));

describe("useAuthState", () => {
  it("starts as not authenticated", () => {
    onAuthStateChanged.mockImplementation(() => () => {});
    const { result } = renderHook(() => useAuthState());
    expect(result.current).toBe(false);
  });

  it("becomes true when Firebase reports a signed-in user", async () => {
    let callback;
    onAuthStateChanged.mockImplementation((auth, cb) => {
      callback = cb;
      return () => {};
    });

    const { result } = renderHook(() => useAuthState());

    act(() => {
      callback({ uid: "some-user-id" });
    });

    await waitFor(() => expect(result.current).toBe(true));
  });

  it("becomes false when Firebase reports sign-out", async () => {
    let callback;
    onAuthStateChanged.mockImplementation((auth, cb) => {
      callback = cb;
      return () => {};
    });

    const { result } = renderHook(() => useAuthState());

    act(() => {
      callback({ uid: "some-user-id" });
    });
    await waitFor(() => expect(result.current).toBe(true));

    act(() => {
      callback(null);
    });
    await waitFor(() => expect(result.current).toBe(false));
  });
});
