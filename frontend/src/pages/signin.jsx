import { Link } from "react-router-dom"

export default function SignIn() {


  return (

    <div className="container bg-" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>

      

      <main className="form-signin w-50 m-auto align-items-center justify-content-center align-middle
      bg-dark-subtle rounded-3 p-4 shadow-lg">
        <form>

          <h1 className="h3 mb-3 fw-bold mb-5">Please sign in</h1>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Username"
            />
            <label for="floatingInput">Username</label>
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

