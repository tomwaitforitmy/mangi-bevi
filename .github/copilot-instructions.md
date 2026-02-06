# Copilot Instructions for mangi-bevi

## Project Overview
**mangi-bevi** is a React Native food recipe app built with Expo, Redux for state management, and appwrite/Firebase for backend services. The app allows users to store, share, and collaborate on recipes with social features (reactions, links, friends).

## Architecture

### Core Stack
- **Framework**: Expo (React Native) - run with `npm start` or `npx expo start --tunnel`
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`) via `store/actions` and `store/reducers`
- **Navigation**: React Navigation with bottom tabs + native stack navigators
- **Backend Auth**: Firebase Authentication (`firebase/firebase.js`)
- **Database**: Firebase (`firebase/firebase.js`)
- **Image Storage**: Appwrite (`appwrite/`)
- **Experimental Supabase integration**: `supabase/` (not used, not planned to use currently)

### Directory Structure
- **screens/**: 18+ screen components (MealsScreen, MealDetailScreen, LoginScreen, etc.)
- **components/**: 40+ reusable UI components (MealItem, MealList, MultiSelectList, etc.)
- **common_functions/**: 30+ utility functions (GetMealSummary, FastFilterMeals, CountReactions, etc.)
- **models/**: Data models (Meal, User, Tag, Reaction, Report, Reward, etc.)
- **store/**: Redux state (reducers: meals, tags, users, search, features; actions for each)
- **data/**: Constants (AllowedReactions, AllowedSortingOptions, AvailableSettings, DummyMeals)
- **navigation/**: MyNavigationContainer.js defines tab structure and screens
- **firebase/**, **appwrite/**: Backend integrations

## Key Data Models
Use constructors from `models/` directory:
- **Meal**: title, id, primaryImageUrl, ingredients, steps, imageUrls, tags, rating, authorId, creationDate, reactions, links
- **User**: username, id, email, friends, level, stats
- **Tag**: id, title, color
- **Reaction**: type (from AllowedReactions), userId, mealId
- **Reward**: points earned for ingredients, recipes, steps, tags

## Redux State Management
Each reducer manages a domain:
- `mealsReducer`: SET_MEALS, TOGGLE_FAVORITE, CREATE_MEAL, EDIT_MEAL, EDIT_LINKS, EDIT_REACTIONS, DELETE_MEAL
- `usersReducer`: user authentication and statistics data
- `tagsReducer`: tag operations to filter meals
- `searchReducer`: search terms
- `featuresReducer`: feature flags (e.g., DEV_MODE)

**Convention**: Actions are named constants in `store/actions/*.js`, reducers handle switch cases with immutable updates.

## Critical Developer Workflows

### Local Development
```bash
npx expo login                   # Authenticate with Expo (once per machine)
npx expo start --tunnel          # Start dev server
# Press 'a' in terminal to open Android emulator
```

### Testing
- **Run tests**: `npm test` (Jest configured)
- **Test location**: `tests/` with subdirs: `unit-tests/`, `component-tests/`, `integration/`
- **Framework**: Jest + React Native Testing Library
- **Example**: See tests/component-tests/ for component test patterns

### Linting & Code Quality
- **Lint**: `npm run lint` (ESLint)
- **Extensions recommended in README.md**: ESLint, React Native extensions, Jest runner, Prettier

## Project-Specific Patterns

### Utility Functions Pattern
Helper functions use pure, functional style with clear naming:
- **Filters**: `FastFilterMeals`, `FastFilterUsers` (case-insensitive, efficient)
- **Transformers**: `GetMealSummary`, `ConvertArrayToArrayOfObjects`
- **Validators**: `IsEmailValid`, `IsMealInvalid`, `IsUserNameValid`
- **Getters**: `GetAuthorName`, `GetFriends`, `GetUserMeals`, `GetUserStats`, `GetLevelPercent`, `GetReward`

### Authentication & Permissions
- **Credential storage**: Use `CredentialStorage.js` for secure token storage (AsyncStorage or Secure Store)
- **Edit permissions**: `HasEditPermission(meal, currentUserId)` checks if user is author or editor
- **Auth flow**: LoginScreen → Redux auth action → MyNavigationContainer redirects based on `useSelector(state => state.features.isAuthenticated)`

### Component Conventions
- **Screen components** render full pages with Redux selectors and dispatch
- **Reusable components** accept props and rarely connect directly to Redux
- **Multi-select patterns**: MultiSelectList, MultiSelectMealsList, MultiSelectUsersList handle selection state locally
- **Image handling**: SwipeableImage, ImageSwipe for galleries; PickImage utility for selection

### Error Handling
- **Response errors**: `HandleResponseError.js` centralizes error parsing from backend
- **Validation**: Use Is* functions before form submission (IsEmailValid, IsUserNameValid, IsMealInvalid)
- **Logging**: App.js ignores expected warnings (see LogBox.ignoreLogs array)

## External Dependencies & Integrations
- **Expo modules**: notifications, image-picker, image-manipulator, secure-store, updates, localization
- **Vector icons**: Feather, FontAwesome, Ionicons, Material Design Icons via `@react-native-vector-icons`
- **UI Library**: RNEUI (React Native UI) for themed components
- **Async storage**: For local data caching
- **Image processing**: expo-image-manipulator for resizing/editing
- **Notifications**: expo-notifications with custom handler

## Environment & Configuration
- **Dev mode flag**: `DEV_MODE` from `data/Environment.js` controls debug screens (DevScreen)
- **Firebase config**: Loaded from Constants.expoConfig.extra (Expo secrets)
- **Localization**: expo-localization available for i18n
- **Rewards system**: IngredientRewards, RecipeRewards, StepRewards, TagRewards in `data/`

## Notes for AI Agents
- **Immutability**: Redux reducers must not mutate state directly; use spread operator
- **Navigation params**: Screens receive route.params for inter-screen communication
- **Image URLs**: Prefer CDN references; appwrite integration handles uploads
- **Meal linking**: `LinkMeals.js` and `UnlinkMeals.js` manage meal-to-meal relationships
- **Test coverage**: focus on unit & component tests
