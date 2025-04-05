import { useContext, useEffect, useState } from "react";
import SourceCard from "../../components/SourceCard/SourceCard";
import axiosInstance from "../../axios/axios";
import { ToastContainer } from "react-toastify";
import { UserContext } from "../../../contexts/UserContext";
import Spinner from "../../components/Spinner/Spinner";



function Sources() {
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const { user } = useContext(UserContext);

  const subs = new Set(user.subs);

  useEffect(() => {
    fetchSources(currentPage);
  }, [currentPage]);

  const fetchSources = (page) => {
    setIsLoading(true);
    axiosInstance.get(`/sources?page=${page}&limit=${itemsPerPage}`)
      .then((res) => {
        setSources(res.data.sources);
        setTotalPages(Math.ceil(res.data.total / itemsPerPage));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

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

      <div className="text-center mt-3">
        <h1>Sources</h1>
      </div>

      {isLoading ? <Spinner /> : ""}
      <div className="container">

        <div className="row">

          {sources.map((el) => {
            return (
              <SourceCard
                key={el.id}
                id={el.id}
                name={el.name}
                language={el.language}
                country={el.country}
                url={el.url}
                subed={subs.has(el.id)}
              />
            )
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

            {renderPageNumbers()}

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
      <ToastContainer />
    </>
  )
}

export default Sources;
