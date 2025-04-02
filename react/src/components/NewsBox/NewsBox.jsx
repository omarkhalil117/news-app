/* eslint-disable react/prop-types */
import './newsBox.css'

export default function NewsBox(props) {
  return (
            <div className="col-md-3 my-3 d-flex justify-content-between">
                <div className="card news-card">
                    <img src={props.image} className="card-img-top" alt="News Image"/>
                    <div className="card-body">
                        <p>{props.source}</p>
                        <p>Author: <span className='fw-bold'>{props.author}</span></p>
                        <p className="">{props.title}</p>
                        <p className="">{props.description}</p>
                        <a href={props.url} target="_blank" className="btn btn-primary">Read More</a>
                    </div>
                </div>
            </div>
  )
}