import React from 'react'
import { useState,useEffect } from 'react'
import { copy,linkIcon,loader,tick } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'

const Demo = () => {

const [article, setarticle] = useState({
    url:"",
    summary:"",
  });

const [allArticles, setallArticles] = useState([])


const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

const [copied, setCopied] = useState("")

useEffect(() => {
  const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    )
    if(articlesFromLocalStorage){
     setallArticles(articlesFromLocalStorage)
    }
  }, []);
 

  const handleSubmit = async(e) =>{
    e.preventDefault();
    const{data} = await getSummary({articleUrl: article.url});

    if(data?.summary){
      const newArticle = {...article,summary:data.summary};
      const updatedAllArticles = [newArticle,...allArticles];

      setarticle(newArticle)
      setallArticles(updatedAllArticles)

      localStorage.setItem('articles',JSON.stringify(updatedAllArticles))
    }
  }

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (
    <section className='mt-16 w-ful max-w-xl'>

      {/*search*/}
      <div className='flex flex-col gap-3 w-full'>
        <form className='relative flex justify-center items-center' onSubmit={handleSubmit}>
          <img src ={linkIcon} alt="link_icon" className='absolute left-0 ml-3 w-5'/>

          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange = {(e)=>setarticle({...article,url:e.target.value})}
            onKeyDown={handleKeyDown}
            required
            className='url_input peer'
          />
          <button type="submit" className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'>
            ↵
          </button>
        </form>

        {/*Browse URL Hitory*/}
        <div className='flex flex-col gap-1 max-h-60
          overflow-y-auto'>
          {allArticles.map((item,index)=>(

          <div key = {`link -${index}`}
              onClick={()=>setarticle(item)}
              className='link_card'
            >
              <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                <img 
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className='w-[40%] h-[40%] object-contain'/>
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
          </div>
          ))}
        </div>
      </div>
       {/*Display Result*/}
       <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Well, that wasn't supposed to happen...
            <br />
            <span className='font-satoshi font-normal text-gray-700'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default Demo
