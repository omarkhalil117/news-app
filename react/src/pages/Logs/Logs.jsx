import { useEffect, useState } from "react"
import axiosInstance from "../../axios/axios";

function Logs() {
    const [logs,setLogs] = useState([]);

    useEffect(()=> {
        axiosInstance.get('/users/logs')
        .then( res => setLogs(res.data.logs))
        .catch( err => console.log(err));
    },[])

  return (
    <>
<div className="container m-5">
    <h1 className="mb-4">Logs</h1>
    <table className="table table-bordered">
      <thead className="thead-dark">
        <tr>
          <th>Status</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {logs.map( (el) => {
            const date = new Date(el.timestamp);
            
            return <>
            <tr>
                <th className={el.status === 'success' ? "text-success" : "text-danger"}>{el.status}</th>
                <th>{date.toLocaleString('en-GB')}</th>
            </tr>   
            </> 
        })}
       
      </tbody>
    </table>
  </div>
  </>
)
}

export default Logs