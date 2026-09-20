import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"

export default function SignIn() {


  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);




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


    setLoading(true);

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

    setLoading(false);

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
              required
            />
            <label for="floatingInput">Email address</label>
          </div>

          <div className="form-floating mt-2">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              required
            />
            <label for="floatingPassword">Password</label>
          </div>

          <div className="mt-2">

            {/* <Link className="btn btn-danger me-2 py-2" to="/">
              Ca
            </Link> */}
            <button className="btn btn-primary py-2" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Sign in"}
            </button>
          </div>


        </form>
      </main>

    </div>

  )
}

