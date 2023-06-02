import Link from 'next/link'

type Props = {
  id: number;
  title: string;
  description: string;
  source: string;
  source_link: string;
  image_url: string | null;
  published_at: string | null;
  author: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function NewsItem(news: Props) {
  return (
    <Link href={news.source_link} className="w-full md:w-3/4 rounded shadow p-5 bg-slate-100">
      <div className="flex flex-col w-full">
        <h2 className="font-weight-500 text-lg">{news.title}</h2>
        <p className="text-neutral-900">{news.description}</p>
      </div>
    </Link>
  );
}
