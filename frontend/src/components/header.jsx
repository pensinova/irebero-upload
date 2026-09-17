import { useState, useEffect } from "react";
import { Link } from "react-router-dom";



export default function Header() {

     return (



          <div className="container">

               <nav className="navbar navbar-expand-lg bg-dark-subtle rounded-pill">

                    <div className="container px-3">
                         <Link className="navbar-brand badge bg-transparent" to="/">

                              <b className="text-dark text-lg">IREBERO</b><br />
                              <span className="text-danger">Films</span>

                         </Link>

                         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                              <span className="navbar-toggler-icon"></span>
                         </button>

                         <div className="collapse navbar-collapse" id="navbarSupportedContent">

                              <ul className="navbar-nav me-auto ms-auto mb-2 mb-lg-0">
                                   <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="/upload">
                                             Upload
                                        </Link>
                                   </li>
                                   <li className="nav-item">
                                        <Link className="nav-link" to="/movies">
                                             Movies
                                        </Link>
                                   </li>

                                   <li className="nav-item">
                                        <Link className="nav-link" to="/analytics">
                                             Analytics
                                        </Link>
                                   </li>

                              </ul>

                              <form className="d-flex">
                                   <span className="input-group-text bg-transparent" id="">
                                        <i>User</i>
                                   </span>
                                   <button className="btn btn-primary rounded-pill btn-sm" type="button">
                                        <Link to="/signin" className="btn ">Login</Link>
                                   </button>
                              </form>
                         </div>

                    </div>



               </nav>
          </div>
     )
}