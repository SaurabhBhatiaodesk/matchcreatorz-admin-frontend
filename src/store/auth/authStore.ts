import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { LoginRequest, UserInterface } from "./authInterface";

interface AuthInterface {
  isLogin: boolean;
  rememberMe: boolean;
  loginDetails: LoginRequest | null;
  token: string | null;
  userDetails: UserInterface | null;
  setLogin: (login: boolean) => void;
  setToken: (token: string) => void;
  setUserDetails: (user: UserInterface | undefined | any) => void;
  setRememberMe: (user: LoginRequest | null, rememberMe: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create(
  devtools(
    persist<AuthInterface>(
      (set) => ({
        isLogin: false,
        rememberMe: false,
        token: null,
        userDetails: null,
        loginDetails: {
          email: "",
          password: "",
        },
        setLogin: (login: boolean) =>
          set((state) => ({ ...state, isLogin: login })),
        setToken: (token: string) => set((state) => ({ ...state, token })),
        setUserDetails: (user: UserInterface | undefined) =>
          set((state) => ({ ...state, userDetails: user, isLogin: true })),
        setRememberMe: (user: LoginRequest | null, rememberMe: boolean) =>
          set((state) => ({ ...state, loginDetails: user, rememberMe })),
        logout: () =>
          set((state) => ({
            ...state,
            isLogin: false,
            userDetails: null,
            token: null,
          })),
      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )
);
