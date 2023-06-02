import NewsItem from "@/components/news-item";
import { useSession } from "next-auth/react";
import { http } from '@/utils/http';
import useSWR from 'swr';

const fetcher = (url: string, accessToken: any) => {
  return http.get(url, { headers: { 'Authorization': `Bearer ${accessToken}`}}).then(res => res.data)
};

export default function Home() {
  const { data: session } = useSession();

  const { data, error } = useSWR(
    session
      ? [
          `/api/articles`,
          (session.user as any).accessToken,
        ]
      : null,
    fetcher
  );

  return (
    <div className="flex flex-col w-full max-w-5xl space-y-5">

      {data}
    </div>
  )
}
