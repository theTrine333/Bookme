import { useAuth, useClerk, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Toast } from "toastify-react-native";

type AuthState = {
  isLoggedIn: boolean | undefined;
  userId: string;
  Login: ({ emailAddress, password }: emailLoginProps) => Promise<void>;
  Logout: () => void;
  isState: "idle" | "loading" | "login-error" | "signup-error";
};

type emailLoginProps = {
  emailAddress: string;
  password: string;
};
export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  userId: "",
  Login: async ({ emailAddress, password }) => {},
  Logout: () => {},
  isState: "idle",
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(false);
  const [userId, setUserId] = useState<string>("");
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isState, setState] = useState<
    "idle" | "loading" | "login-error" | "signup-error"
  >("idle");
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const onSignInPress = async ({ password, emailAddress }: emailLoginProps) => {
    if (!isLoaded) return;
    setState("loading");
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt.status === "complete") {
        setState("idle");
        Toast.success("Login was successfull", "top");
        setIsLoggedIn(true);
        await setActive({ session: signInAttempt.createdSessionId });
        setTimeout(() => {
          router.replace("/");
        }, 800);
      } else {
        setState("login-error");
        // console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      setState("login-error");
      const errorMessage =
        err.errors?.[0]?.message || "Failed to login with Google";
      Toast.error(errorMessage, "top");
      //   console.error(JSON.stringify(err, null, 2));
    }
    setState("idle");
  };

  useEffect(() => {
    setIsLoggedIn(isSignedIn);
  }, [isLoaded]);
  const Login = async ({ emailAddress, password }: emailLoginProps) => {
    await onSignInPress({ emailAddress: emailAddress, password: password });
  };
  const Logout = () => {
    Alert.alert("Signout", "Are you sure for this action", [
      { text: "Cancel", isPreferred: true, onPress: () => {} },
      {
        text: "Continue",
        onPress: async () => {
          await signOut();
          router.replace("/auth");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userId,
        Login,
        Logout,
        isState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
