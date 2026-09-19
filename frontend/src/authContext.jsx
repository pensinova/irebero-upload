import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [status, setStatus] = useState(false);

     useEffect(() => {
          const checkLogin = async () => {
               try {
                    const response = await fetch(
                         "http://localhost:5000/check-session",
                         {
                              credentials: "include"
                         }
                    );

                    const data = await response.json();

                    setStatus(data.status);
                    setUser(data.status ? data.user : null);

               } catch (e) {
                    console.error(e);
                    setStatus(false);
                    setUser(null);
               } finally {
                    setLoading(false);
               }
          };

          checkLogin();
     }, []);

     return (
          <AuthContext.Provider
               value={{ user, setUser, loading, status }}
          >
               {children}
          </AuthContext.Provider>
     );
}

export function useAuth() {
     return useContext(AuthContext);
}