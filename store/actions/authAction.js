import { firebaseAuth } from "../../firebase/firebase";
import User from "../../models/User";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

//---------------------------------------------
// Authentication is for the firebase accounts
// official docs https://firebase.google.com/docs/auth/web/manage-users
//---------------------------------------------

export const getToken = async () => {
  try {
    const token = await firebaseAuth.currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error(
      "Error getIdToken:" + error + " User:" + firebaseAuth.currentUser,
    );
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(firebaseAuth);
  } catch (error) {
    console.error("Error logout:" + error);
  }
};

export const signup = async (email, password, username) => {
  try {
    const response = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    const user = User("error", username, email, [], response.user.uid);
    return user;
  } catch (error) {
    console.error("Error signup:" + error);
  }
};

export const resetPass = async (email) => {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
    console.log("Password reset successful for " + email);
  } catch (error) {
    console.error("Error reset password:" + error);
  }
};

export const deleteAccount = async () => {
  try {
    const firebaseUser = firebaseAuth.currentUser;
    console.log("begin delete account " + firebaseUser.email);

    if (firebaseUser.uid === "JfrGXVhcsNY78LnqQSie0GTcj692") {
      console.error("Stop deleting your account tommy!");
    } else {
      deleteUser(firebaseUser);
    }
  } catch (error) {
    console.error("Error delete user:" + error);
  }
};

export const login = async (email, password) => {
  console.log("begin login");

  try {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
    console.log("logged in as", email);
  } catch (error) {
    console.error("error login:" + error);
  }
};
