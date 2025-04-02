import { useContext, useEffect, useState } from "react"
import SourceCard from "../../components/SourceCard/SourceCard";
import axiosInstance from "../../axios/axios";
import { UserContext } from "../../../contexts/UserContext";
import Spinner from "../../components/Spinner/Spinner";


function TopSources() {
    
  const [sources,setSources] = useState([]);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const subs = new Set(user.subs);

  useEffect(() => {
    axiosInstance.get('/sources/top-sources')
    .then( res => {
        setSources(res.data.sources);
        setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    })
  },[]);

  return (
    <>
    <div className="container">

    <h1 className="text-center mt-3">TopSources</h1>

      {isLoading ? <Spinner/> : ""}

    <div className="row my-5">

    {sources.map((el) => {
        return <SourceCard
        key= {el.id}
        id= {el.id}
        name= {el.name}
        language= {el.language}
        country= {el.country}
        url= {el.url}
        subed= {subs.has(el.id)}
        />
    })}
    </div>
    </div>
    </>
  )
}

export default TopSources