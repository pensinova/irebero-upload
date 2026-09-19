import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"

export default function SignIn() {


  const navigate = useNavigate();




  const checkLogin = async () => {

    try {

      const response = await fetch("http://localhost:5000/check-session",
        {
          credentials: "include"

        }
      );

      const data = await response.json();


      if (data.status) {
        navigate("/");
      }

    }
    catch (e) {
      console.error(e);
    }


  }

  useEffect(() => {
    checkLogin();
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("floatingPassword").value;

    try {
      const response = await fetch(`http://localhost:5000/getLogin?email=${email}&password=${password}`,
        {
          credentials: "include"
        }
      );

      const data = await response.json();


      if (data.status) {

        navigate("/");

      }
      else {
        alert(data.error);
      }

    }
    catch (e) {
      console.error(e);
    }

  }


  return (

    <div className="container bg-" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>



      <main className="form-signin w-50 m-auto align-items-center justify-content-center align-middle
      bg-dark-subtle rounded-3 p-4 shadow-lg">
        <form onSubmit={handleSubmit}>

          <h1 className="h3 mb-3 fw-bold mb-5">Please sign in</h1>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Email address"
            />
            <label for="floatingInput">Email address</label>
          </div>

          <div className="form-floating mt-2">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label for="floatingPassword">Password</label>
          </div>

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="checkDefault"
            />
            <label className="form-check-label" for="checkDefault">
              Remember me
            </label>
          </div>
          <Link className="btn btn-danger me-2 py-2" to="/">
            Back
          </Link>
          <button className="btn btn-primary py-2" type="submit">
            Sign in
          </button>
        </form>
      </main>

    </div>

  )
}

