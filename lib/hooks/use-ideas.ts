import useSWR from "swr";
import type { IdeasResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useIdeas() {
  const { data, error, isLoading, mutate } = useSWR<IdeasResponse>(
    "/api/ideas",
    fetcher,
    { refreshInterval: 5 * 60 * 1000 }
  );

  return {
    ideas: data?.ideas || [],
    meta: data?.meta,
    lastUpdated: data?.lastUpdated,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
