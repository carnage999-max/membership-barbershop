"use client";

import { useState, useEffect } from "react";
import { session } from "@/lib/api-client";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = session.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const isAdmin = user?.role === "ADMIN";

  return { user, isAdmin, loading };
}
