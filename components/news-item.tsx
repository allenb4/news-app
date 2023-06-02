import Link from 'next/link';
import Image from 'next/image';

type Props = {
  id: number;
  category_id: number;
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

  const category=['NO CATEGORY', 'SPORTS', 'GAMING', 'POLITICS', 'SCIENCE', 'FINANCE', 'CAREERS'];

  return (
    <>
    <Link  href={news.source_link} className="card w-full md:w-3/4 rounded shadow p-5 bg-slate-100">
      <div className="flex flex-col w-full">
        <h6 className="font-weight-500 text-lg">{category[news.category_id]}</h6>
        <br />
        <h2 className="text-lg" style={{fontWeight: 800}}>{news.title}</h2>
        <br />
        <p className="text-neutral-900">{news.description}</p>
      </div>
    </Link>
    </>
  );
}
