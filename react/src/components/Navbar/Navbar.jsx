import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

import './navbar.css';
function Navbar() {

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const handleLogout = async () => {
    axiosInstance.post('/logout', {}, { withCredentials: true })
      .then(res => {
        setUser({
          fullName: '',
          email: '',
          subs: new Set()
        })
        console.log(user);
        navigate('/');
      })
      .catch(err => {
        toast.error(err.message, { autoClose: 3000 });
      });
  };

  return (
    <nav className="bg-primary border-bottom p-2">
      <div className="container-xl px-4">
        <div className="d-flex justify-content-between">

          <div className="d-flex gap-4">
            <div className="image-container mt-1">
              <img src="/Logo.png" alt="" />
            </div>
            <div className="d-flex align-items-center py-3 px-2 hover:text-dark text-decoration-none">
              <span className="fw-bold nav-link">World News</span>
            </div>

            <div className="d-none d-md-flex align-items-center">
              <Link className="mx-3 nav-link" to='/home'>Home</Link>
              <Link className="mx-3 nav-link" to='/sources'>Sources</Link>
              <Link className="mx-3 nav-link" to='/top-sources'>Top Sources</Link>
              <Link className="mx-3 nav-link" to='/logs'>Logs</Link>
            </div>
          </div>

          <div className="d-none d-md-flex align-items-center gap-1">
            <p className="my-auto mx-3 fs-5 nav-link">{user.fullName}</p>
            <button className="btn" onClick={handleLogout}>
              <img style={{ width: 30 + "px" }} src="logout.png" alt="" />
            </button>
          </div>

          <div className="d-md-none d-flex align-items-center">
            <button className="mobile-menu-button">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>

  )
}

export default Navbar
