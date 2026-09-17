import { useNavigate } from "react-router-dom"
import Header from "../components/header";



export default function Lost() {
     const navigate = useNavigate();

     return (
          <div className="container">

               <Header />

               <div className="text-center mt-5">

                    <h3>Page not found</h3>
                    <button onClick={() => navigate(-1)} className="btn btn-primary">Go back</button>

               </div>

          </div>
     )
}