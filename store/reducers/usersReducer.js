import { SET_USERS, CREATE_USER, EDIT_USER } from "../actions/usersAction";

const initialState = {
  users: [],
  user: null,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS: {
      return {
        ...state,
        users: action.users,
      };
    }
    case CREATE_USER: {
      return {
        ...state,
        users: [action.user].concat(state.users),
      };
    }
    case EDIT_USER: {
      const userId = state.users.findIndex((u) => u.id === action.user.id);
      const updatedUsers = [...state.users];
      updatedUsers[userId] = action.user;

      return {
        ...state,
        users: updatedUsers,
      };
    }

    default:
      return state;
  }
};

export default usersReducer;
