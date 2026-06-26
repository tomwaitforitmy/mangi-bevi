---
name: tdd-utility-function
description: Write a utility function in mangi-bevi following red-green-refactor TDD
---

# Write a TDD Utility Function

Use this when you need to add a new helper function to `common_functions/` in the mangi-bevi repo, following the red-green-refactor cycle and naming conventions.

## When to Use

- Adding a new Get*, Is*, Count\* or similar named utility function
- Want to ensure the function is tested from the start
- Want to follow the repo's functional programming style (pure functions, clear input/output)

## Process

### Phase 1: Red (Write a failing test)

1. In `tests/unit-tests/`, create a test file named `[FunctionName].test.js`
2. Import the function (it doesn't exist yet)
3. Write 2-3 test cases covering the happy path and edge cases
4. Run the test and watch it fail (this is expected)

### Phase 2: Green (Implement to pass)

1. Create `common_functions/[FunctionName].js`
2. Write the minimal implementation to make the test pass
3. Follow the repo's naming convention if possible:
   - `Get*` for transformers/getters that return computed values
   - `Is*` for validators that return boolean
   - `Count*` for aggregators that return numbers
4. Ensure the function is a pure function (no side effects)
5. Export it as a named export
6. Run the test again and watch it pass

### Phase 3: Refactor

1. Review the implementation for clarity and performance
2. Update the test if you found a better way to validate behavior

## Success Looks Like

- ✅ Test file exists and passes
- ✅ Function is pure (no external state mutations)
- ✅ Function is exported from `common_functions/`
- ✅ Edge cases are handled

## Notes

- Keep functions small and focused (single responsibility)
- If a function needs more than 10 lines, consider splitting it
- Reuse existing utility functions when possible
