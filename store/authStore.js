import { create } from "zustand";
import { supabase } from "../supabase/supabase";

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isLoading: true,

  signUp: async (email, password, nickname) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      const { error: profileError } = await supabase.from("profile").insert([
        {
          id: data.user.id, // auth.users.id랑 연결
          nickname,
          email: data.user.email,
        },
      ]);

      if (profileError) {
        console.error("닉네임 저장 실패:", profileError);
      }
      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          nickname,
        },
        session: data.session,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }

    return { error };
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from("profile")
        .select("nickname")
        .eq("id", data.user.id)
        .single();
      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          nickname: profile?.nickname || "",
        },
        session: data.session,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }

    return { error };
  },

  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, session: null, isLoading: false });
  },

  loadSession: async () => {
    set({ isLoading: true });
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (user) {
        const { data: profile } = await supabase
          .from("profile")
          .select("nickname")
          .eq("id", user.id)
          .single();

        set({
          user: {
            id: user.id,
            email: user.email,
            nickname: profile?.nickname || "", // 닉네임 적용
          },
          session: data.session,
          isLoading: false,
        });
      } else {
        set({ user: null, session: null, isLoading: false });
      }
    } else {
      set({ user: null, session: null, isLoading: false });
    }
  },
}));
