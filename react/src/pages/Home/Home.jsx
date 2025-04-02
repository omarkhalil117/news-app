import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../contexts/UserContext"
import NewsBox from "../../components/NewsBox/NewsBox";
import axiosInstance from "../../axios/axios";
import './home.css';
import Spinner from "../../components/Spinner/Spinner";

export default function Home() {
  const { user } = useContext(UserContext);
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    axiosInstance.get(`/users/news?page=${currentPage}`)
    .then((res) => {
      setNews(res.data.data.articles);
      setIsLoading(false);
    })
    .catch(err => {
      console.log(err)
      setIsLoading(false);
    })
  },[currentPage])

    const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
    };

    const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <>
    <div className="container my-5">
      {isLoading ? <Spinner/> : ""}
      {!isLoading && user.subs.size == 0
      ? <>
          <p>There is no news</p> 
          <br/> 
          <p>Please subscribe to your favourite sources !</p>
        </> 
      : ''}
      <div className="row">
    {news.map( (el) => {
      return <NewsBox
      key={el.source.url}
      title={el.title}
      description=''
      source={el.source.name}
      image={el.urlToImage}
      url={el.url}
      author={el.author}
      />
    })}
    </div>
           <nav>
          <ul className="pagination justify-content-center my-5">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                First
              </button>
            </li>

            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
            </li>

            { renderPageNumbers()}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </li>
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                Last
              </button>
            </li>
          </ul>
        </nav>

    </div>
    </>
  )
}
