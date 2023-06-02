import NewsItem from "@/components/news-item";
import { useSession } from "next-auth/react";
import { http } from '@/utils/http';
import useSWR from 'swr';
import { useEffect, useState } from "react";

const fetcher = (url: any, accessToken: any) => {
  return http.get(url[0], { headers: { 'Authorization': `Bearer ${url[1]}`}}).then(res => res.data)
};

export default function Home() {
  const { data: session } = useSession();
  const [searchItem, setSearchItem] = useState('');
  const [dataFilter, setDataFilter] = useState([]);
  const [articlePage, setArticlePage] = useState(`/api/articles?page=1`);
  const [articleCategory, setArticleCategory] = useState(`&newsCategory=1`);
  const [dateFilter, setDateFilter] = useState('');
  const [sourceFilter, setSource] = useState('none');

  const categories = ['SPORTS', 'GAMING', 'POLITICS', 'SCIENCE', 'FINANCE', 'CAREERS'];

  let { data, error } = useSWR(
    session
      ? [
          articlePage+articleCategory,
          (session?.user as any).accessToken,
        ]
      : null,
    fetcher
  );

  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearchItem(e.target.value);
    setDateFilter('');
    setSource('none');
  }

  const handleCategoryButton = (e: any) => {
    e.preventDefault();
    const name = e.target.name;
    categories.forEach((category: string, index) => {
      if (category.toLocaleLowerCase() === name) {
        setArticlePage(`/api/articles?page=1`);
        setArticleCategory(`&newsCategory=${index+1}`);
      }
    })
    setDateFilter('');
    setSource('none');
  }

  const handleDateFilter = (e: any) => {
    e.preventDefault();
    setDateFilter(e.target.value);
    setSource('none');
    setDataFilter(data?.data.filter((item: any) => {
      const date = new  Date(item.created_at);
      const dateFormat = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));

      return dateFormat === e.target.value;
    }));
  }

  const handleSelectFilter = (e: any) => {
    e.preventDefault();
    setDateFilter('');
    setSource(e.target.value);
    setDataFilter(data?.data.filter((item: any) =>  {
      if (item.source !== undefined && item.source !== null) {
      return item.source.toLowerCase() === e.target.value.toLowerCase();
      }
      
      return item;
    }));
  }

  useEffect(() => {
      setDataFilter(data?.data);
  
    if (searchItem !== '') {
      setDataFilter(data.data.filter((item: any) => JSON.stringify(item).toLowerCase().indexOf(searchItem.toLowerCase()) > 0));
    } 

  }, [data, searchItem])


  return (
    <>
    <div className="flex flex-col w-full max-w-5xl space-y-5">

    <input type="text" className="search-size" placeholder="Search article from the current category.." onChange={handleSearch} name="search" />
    <input type='date' className="search-size" value={dateFilter} onChange={handleDateFilter} />
    <select className="search-size" onChange={handleSelectFilter} value={sourceFilter}>
      <option value='none' disabled>Select a desired artice source...</option>
      <option value='Ny Times'>NY Times</option>
      <option value='The Guardian'>The Guardian</option>
      <option value='News API'>News API</option>
    </select>

      <div className="btn-group">
        {categories.map((item: any, index: number) => {
                return (
                  <>
                    <button onClick={handleCategoryButton} name={item.toLowerCase()} key={item + '-' + index} className="btn btn-blue active">
                      {item}
                    </button>
                  </>
                )
              })}
      </div>

      <div className="pagination">
        {dataFilter && dataFilter.length > 0 && data && data.links !== undefined && data.links.length > 0 ? data.links.map((pageItem: any, index: number) => {
            if (index === 0) {
                pageItem.label = 'PREVIOUS';
            }

            if (index === (data.links.length - 1)) {
              pageItem.label = 'NEXT';
            }

           return ( 
                <> 
                  <a key={'link-' + index} href="#" onClick={() => { pageItem.url !== null ? setArticlePage(pageItem.url) : '' }} className={pageItem.active === true ? 'active' : ''}>{pageItem.label}</a> 
                </> 
                );
          }) : ''}
    </div>
      { dataFilter !== null && dataFilter?.length > 0 ? dataFilter.map((item: any) => {

        return (
          // eslint-disable-next-line react/jsx-key
          <>
            <NewsItem key={'news' + item.id} 
                      id={item.id || 0} 
                      category_id={item.category_id || 0} 
                      title={item.title || ""} 
                      description={item.description || ""} 
                      source={item.source || ""} 
                      source_link={item.source_link || ""}
                      image_url={ item.image_url || null} 
                      published_at={item.published_at || null} 
                      author={item.author || null} 
                      created_at={item.created_at || null} 
                      updated_at={item.updated_at || null} />
          </>
          );
        }) : 'No News'
      }

    </div>
    </>
  )
}
