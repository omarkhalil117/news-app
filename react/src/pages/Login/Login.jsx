import { useContext, useState } from 'react';
import axiosInstance from '../../axios/axios';
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { validEmail, validPassword } from '../../utils/Validations';
import { UserContext } from '../../../contexts/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const success = (message) => {
    toast.success(message, { autoClose: 3000 });
  }

  const failed = (message) => {
    toast.error(message, { autoClose: 3000 });
  }
  const handleLogin = async () => {
    try {

      if (!email || !password) {
        failed("Missing Email or Password");
        return;
      }

      if (!validEmail(email)) {
        failed("Email is not valid !!");
        return;
      }

      if (!validPassword(password)) {
        failed("Invalid Password !!");
        setMessage('Password must contain at least (8) charachters (1) upper case (1) special charachter (1) number');
        return;
      }

      const response = await axiosInstance.post('/login', {
        email,
        password
      }).catch(err => failed(err.response.data.message));
      const { fullName, subs } = response.data;
      setUser({
        fullName: fullName,
        email: email,
        subs: new Set(subs),
      })
      success('Logged in successfully');

      navigate('/home');
    } catch (error) {
      setMessage('');
      failed(error.response.data.message);
    }
  };

  return (
    <>

      <section className="vh-100" style={{ backgroundColor: '' }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: 1 + 'rem' }}>
                <div className="row g-0">
                  <div className="col-md-12 col-lg-12 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <div className="logo-container mt-1 m-auto">
                          <img src="/Logo.png" alt="" />
                        </div>
                      </div>

                      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: 1 + 'px' }}>Sign into your account</h5>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg w-50 m-auto"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="form-label">Email address</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example27"
                          className="form-control form-control-lg w-50 m-auto"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="form-label">Password</label>
                      </div>

                      <div className="pt-1 mb-4">
                        <button data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block" onClick={handleLogin} type="button">Login</button>
                      </div>

                      <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don&lsquo;t have an account?
                        <Link to="/register">Register</Link>
                      </p>
                      <p className='text-danger'>{message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer containerId={"loginRequest"} />
    </>
  );
}

export default Login;
