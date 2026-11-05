import { useState, useEffect, useCallback } from "react";
import jack from "../assets/jack.png";
import user_profile from "../assets/user_profile.jpg";
import { AuthContext } from "./AuthContextInstance";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("streamify_current_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed.subscriptions)) {
          parsed.subscriptions = [];
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("streamify_registered_users");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("streamify_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("streamify_current_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      "streamify_registered_users",
      JSON.stringify(registeredUsers)
    );
  }, [registeredUsers]);

  const login = (email, password) => {
    const trimmedEmail = (email || "").trim().toLowerCase();
    const found = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmedEmail &&
        u.password === password
    );

    if (found) {
      const userData = {
        name: found.name,
        email: found.email,
        avatar: found.avatar || jack,
        subscriptions: Array.isArray(found.subscriptions) ? found.subscriptions : [],
      };
      setUser(userData);
      return { success: true };
    } else {
      return {
        success: false,
        message: "Invalid email or password. Please check your credentials or create an account.",
      };
    }
  };

  const loginWithGoogle = () => {
    // Check if there is an existing google account stored
    const existing = registeredUsers.find((u) => u.email === "user@google.com");
    const googleUser = {
      name: "Google User",
      email: "user@google.com",
      avatar: user_profile,
      isGoogle: true,
      subscriptions: existing?.subscriptions || [],
    };
    setUser(googleUser);
    return { success: true };
  };

  const signup = (name, email, password, avatarSrc = jack) => {
    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedName = (name || "").trim();

    if (!trimmedName || !trimmedEmail || !password) {
      return { success: false, message: "Please fill out all fields." };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    if (registeredUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
      name: trimmedName,
      email: trimmedEmail,
      password,
      avatar: avatarSrc,
      subscriptions: [], // initially NO subscriptions!
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser({
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      subscriptions: [],
    });

    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  // Check if a channel is subscribed
  const isSubscribed = useCallback((channelId, channelTitle) => {
    if (!user || !Array.isArray(user.subscriptions)) return false;
    return user.subscriptions.some((sub) => {
      if (channelId && sub.channelId && sub.channelId === channelId) return true;
      if (channelTitle && sub.title && sub.title.toLowerCase() === channelTitle.toLowerCase()) return true;
      return false;
    });
  }, [user]);

  // Toggle channel subscription (subscribe or unsubscribe)
  const toggleSubscribe = useCallback((channel) => {
    if (!user) return false;
    const currentSubs = Array.isArray(user.subscriptions) ? user.subscriptions : [];
    
    const exists = currentSubs.some((sub) => {
      if (channel.channelId && sub.channelId && sub.channelId === channel.channelId) return true;
      if (channel.title && sub.title && sub.title.toLowerCase() === channel.title.toLowerCase()) return true;
      return false;
    });

    let updatedSubs;
    let nowSubscribed = false;

    if (exists) {
      // Unsubscribe
      updatedSubs = currentSubs.filter((sub) => {
        if (channel.channelId && sub.channelId && sub.channelId === channel.channelId) return false;
        if (channel.title && sub.title && sub.title.toLowerCase() === channel.title.toLowerCase()) return false;
        return true;
      });
      nowSubscribed = false;
    } else {
      // Subscribe
      const newSub = {
        channelId: channel.channelId || `sub-${Date.now()}`,
        title: channel.title || "Creator",
        thumbnail: channel.thumbnail || jack,
        subscribedAt: new Date().toISOString(),
      };
      updatedSubs = [...currentSubs, newSub];
      nowSubscribed = true;
    }

    const updatedUser = {
      ...user,
      subscriptions: updatedSubs,
    };

    setUser(updatedUser);

    // Sync with registeredUsers list
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.email === user.email ? { ...u, subscriptions: updatedSubs } : u
      )
    );

    return nowSubscribed;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        signup,
        logout,
        registeredUsers,
        isSubscribed,
        toggleSubscribe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
