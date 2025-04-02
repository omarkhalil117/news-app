/* eslint-disable react/prop-types */
import { toast } from 'react-toastify';
import axiosInstance from '../../axios/axios';
import './sourceCard.css'
import { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';


function SourceCard(props) {
  const source = props.id;
  const [isSubed,setIsSubbed] = useState(props.subed)
  const { addSource, removeSource } = useContext(UserContext);

  const handelSubscribe = async () => {

    await axiosInstance.post('/users/subscribe', { source })
    .then(res => {
        addSource(source);
        setIsSubbed(true);
        toast.success(res.data?.message, { autoClose:3000 });
    })
    .catch(err => console.log(err))
  };
  const handelUnsubscribe = async () => {
    await axiosInstance.post('/users/unsubscribe', { source })
    .then(res => {
        removeSource(source);
        setIsSubbed(false);
        toast.success(res.data?.message, { autoClose:3000 })
    })
    .catch(err => console.log(err))
  };
  return (
    <>
    <div className="col-md-4 col-sm-12">
    <div className="source-card my-3">
        <div className="p-3">
            <h3 className='mb-3'>{props.name}</h3>
            <p>Language: <span className='text-uppercase'>{props.language}</span> </p>
            <p>Country: <span className='text-uppercase'>{props.country}</span> </p>
        </div>

        <a className='d-block btn btn-info border w-50 m-auto bg-light' target="_blank" href={props.url}>Visit Website</a>
        {isSubed ? 
        <button className="btn btn-danger my-2" onClick={handelUnsubscribe}>Unsubscribe</button> : 
        <button className="btn btn-primary my-2" onClick={handelSubscribe}>Subscribe</button>
        }

    </div>
    </div>
    </>
  )
}

export default SourceCard;