import { WasMarkedThisWeek } from "../../common_functions/WasMarkedThisWeek.js";
import MealCookedByUser from "../../models/MealCookedByUser.js";

describe("WasMarkedThisWeek", () => {
  it("returns false if user is not present", () => {
    const data = [MealCookedByUser("1", "m1", "u1", new Date("01/01/2024"))];

    const result = WasMarkedThisWeek(data, "m1", "u2", new Date("01/01/2024"));

    expect(result).toEqual(false);
  });
  it("returns false if user did not mark this week", () => {
    const data = [MealCookedByUser("1", "m1", "u1", new Date("01/01/2024"))];

    const result = WasMarkedThisWeek(data, "m1", "u1", new Date("01/30/2024"));

    expect(result).toEqual(false);
  });
  it("returns true if user did mark this week", () => {
    const data = [MealCookedByUser("1", "m1", "u1", new Date("01/01/2024"))];

    const result = WasMarkedThisWeek(data, "m1", "u1", new Date("01/05/2024"));

    expect(result).toEqual(true);
  });
  it("returns true if user did mark this week and before that", () => {
    const data = [
      MealCookedByUser("1", "m1", "u1", new Date("01/01/2024")),
      MealCookedByUser("1", "m1", "u1", new Date("01/08/2024")),
      MealCookedByUser("1", "m1", "u1", new Date("01/01/2023")),
    ];

    const result = WasMarkedThisWeek(data, "m1", "u1", new Date("01/10/2024"));

    expect(result).toEqual(true);
  });
  it("returns false if user did mark this week and before that", () => {
    const data = [
      MealCookedByUser("1", "m1", "u1", new Date("01/01/2024")),
      MealCookedByUser("1", "m1", "u1", new Date("01/08/2024")),
      MealCookedByUser("1", "m1", "u1", new Date("01/01/2023")),
    ];

    const result = WasMarkedThisWeek(data, "m1", "u1", new Date("01/30/2024"));

    expect(result).toEqual(false);
  });
  it("returns false if meal was never marked", () => {
    const data = [];

    const result = WasMarkedThisWeek(data, "m1", "u1", new Date("01/30/2024"));

    expect(result).toEqual(false);
  });

  it("returns false for this example", () => {
    const data = [
      {
        date: "2024-04-09T15:05:33.528Z",
        id: "-NxSsq3gG5qKejd_eYko",
        mealId: "-NxBZLQp3PLRUYxygc7C",
        userId: "-N7fTSUz_WVEjEruisQV",
      },
      {
        date: "2024-04-09T15:05:48.435Z",
        id: "-NxSsthYKNlmoIIxG1h7",
        mealId: "-NxBZLQp3PLRUYxygc7C",
        userId: "-N7fTSUz_WVEjEruisQV",
      },
      {
        date: "2024-04-09T15:05:48.749Z",
        id: "-NxSstls9-1llFKFd97x",
        mealId: "-NxBZLQp3PLRUYxygc7C",
        userId: "-N7fTSUz_WVEjEruisQV",
      },
    ];

    const result = WasMarkedThisWeek(
      data,
      "-NxBZLQp3PLRUYxygc7C",
      "-N7fTSUz_WVEjEruisQV",
      new Date("05/1/2024"),
    );

    expect(result).toEqual(false);
  });
});
