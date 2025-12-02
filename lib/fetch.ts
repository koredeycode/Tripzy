import { ExtraConfig } from "@/type";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

export const fetchAPI = async (url: string, options?: RequestInit) => {
  const { serverUrl } = Constants.expoConfig?.extra as ExtraConfig;
  try {
    const response = await fetch(`${serverUrl}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options ? options.headers : {}),
      },
    });
    if (!response.ok) {
      new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

import { useAuth } from "@clerk/clerk-expo";

export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      console.log({token})
      const result = await fetchAPI(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
