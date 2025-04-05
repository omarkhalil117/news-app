import { useState } from 'react';
import axiosInstance from '../../axios/axios';
import { Link, useNavigate } from 'react-router-dom';
import { validEmail, validPassword, validFullName } from '../../utils/Validations';
import { ToastContainer, toast } from 'react-toastify';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fail = (message) => {
    toast.error(message, { autoClose: 3000 });
  }
  const handleRegister = async () => {
    if (!fullName || !email || !password || !confPassword) {
      fail("Missing field or fields");
      return;
    }

    if (!validFullName(fullName)) {
      fail("Invalid Full Name");
      setMessage("Your name must be spaced and each name contains max (20) charachters Ex: john doe");
      return
    }
    if (!validEmail(email)) {
      fail("Invalid Email");
      return;
    }

    if (!validPassword(password)) {
      fail("Invalid password");
      setMessage('Password must contain at least (8) charachters (1) upper case (1) special charachter (1) number');
      return;
    }

    if (password !== confPassword) {
      fail("Passwords doesn't match !");
      return;
    }

    const response = await axiosInstance.post('/register', {
      fullName: fullName.trim(),
      email,
      password
    })
      .then(res => {
        toast.success(res.data.message, { autoClose: 3000 });
        setMessage('');

        setTimeout(() => navigate('/'), 3000);
      })
      .catch(err => {
        console.log(err)
        toast.error(err.response.data.message)
      });
  };

  return (
    <>
      <ToastContainer />
      <section className="">
        <div className="px-4 py-5 px-md-5 text-center text-lg-start" style={{ backgroundColor: 'hsl(0, 0%, 96%)' }}>
          <div className="container">
            <div className="row gx-lg-5 align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <h1 className="my-5 display-3 fw-bold ls-tight">
                  The best news website <br />
                  <span className="text-primary">for You !</span>
                </h1>
                <p style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                  Always updated with the latest news with variety of global
                  news sources from all over the world !
                </p>
              </div>

              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="card">
                  <div className="card-body py-5 px-md-5">
                    <div className="row">
                      <div className="mb-4">
                        <div data-mdb-input-init className="form-outline">
                          <input
                            type="text"
                            className="form-control"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                          <label className="form-label">Full Name</label>
                        </div>
                      </div>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <label className="form-label">Email address</label>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label className="form-label">Password</label>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <input
                        type="password"
                        className="form-control"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                      />
                      <label className="form-label">Confirm Password</label>
                    </div>

                    <button onClick={handleRegister} className="btn btn-primary btn-block mb-4">
                      Sign up
                    </button>

                    <p>Have Account Already ? <span><Link to='/'>Login</Link></span></p>

                    {message && <p className="text-center text-danger mt-3">{message}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default Register;
