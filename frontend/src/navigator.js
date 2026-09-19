import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navigate({ to, children }) {
     const navigate = useNavigate();
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const checkLogin = async () => {
               try {
                    const response = await fetch("http://localhost:5000/check-session",
                         {
                              credentials: "include"
                         }
                    );
                    const data = await response.json();

                    if (!data.status) {
                         navigate("/signin", { replace: true });
                         return;
                    }

                    setLoading(false);
               } catch (e) {
                    console.error(e);
                    navigate("/signin", { replace: true });
               }
          };

          checkLogin();
     }, [navigate]);

     if (loading) return null;

     return children;
}