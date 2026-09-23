
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";

const thumbnailBase = "https://pub-4ebd8b355f6048948a58511af22de131.r2.dev/";

const Movies = () => {
     const [movies, setMovies] = useState([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [b2Files, setB2Files] = useState([]);
     const [activeTab, setActiveTab] = useState("db");
     const [search, setSearch] = useState("");

     async function getB2Files() {
          setLoading(true);
          setError(null);

          try {
               const response = await fetch(
                    "https://irebero.pensinova.workers.dev/getb2movies"
               );

               if (!response.ok) {
                    throw new Error("Failed to fetch B2 files");
               }

               const data = await response.json();

               setB2Files(data.files || []);
          } catch (e) {
               console.log("Failed to fetch files from B2:", e);
               setError("Failed to fetch files from B2");
          } finally {
               setLoading(false);
          }
     }

     async function getMovies() {
          setLoading(true);
          setError(null);

          try {
               const response = await fetch(
                    "https://irebero.pensinova.workers.dev/movies"
               );

               if (!response.ok) {
                    throw new Error("Failed to fetch movies");
               }

               const data = await response.json();

               setMovies(Array.isArray(data) ? data : data.movies || []);
          } catch (e) {
               console.log("Failed to fetch all movies:", e);
               setError("Failed to fetch movies");
          } finally {
               setLoading(false);
          }
     }

     useEffect(() => {
          getMovies();
          getB2Files();
     }, []);

     function formatSize(bytes) {
          if (!bytes) return "0 B";

          const units = ["B", "KB", "MB", "GB", "TB"];
          const i = Math.floor(Math.log(bytes) / Math.log(1024));

          return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
     }

     function formatDate(date) {
          if (!date) return "-";

          return new Date(date).toLocaleString();
     }

     function copyToClipboard(text) {
          navigator.clipboard.writeText(text);
     }

     const filteredMovies = movies.filter((movie) =>
          `${movie.title || ""} ${movie.translator || ""} ${movie.genre || ""}`
               .toLowerCase()
               .includes(search.toLowerCase())
     );

     const filteredB2Files = b2Files.filter((file) =>
          (file.name || "").toLowerCase().includes(search.toLowerCase())
     );

     return (
          <div className="container">

               <Header />

               <div className="mt-5">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                         <h1 className="mb-0">Movies</h1>

                         <Link
                              to="/upload"
                              className="btn btn-primary"
                         >
                              <i className="bi bi-plus-lg me-1"></i>
                              Add Movie
                         </Link>
                    </div>


                    {/* Tabs */}
                    <ul className="nav nav-tabs">

                         <li className="nav-item">
                              <button
                                   type="button"
                                   className={`nav-link ${activeTab === "db" ? "active" : ""}`}
                                   onClick={() => {
                                        setActiveTab("db");
                                        setSearch("");
                                   }}
                              >
                                   Database Movies
                                   <span className="badge text-bg-secondary ms-2">
                                        {movies.length}
                                   </span>
                              </button>
                         </li>

                         <li className="nav-item">
                              <button
                                   type="button"
                                   className={`nav-link ${activeTab === "b2" ? "active" : ""}`}
                                   onClick={() => {
                                        setActiveTab("b2");
                                        setSearch("");
                                   }}
                              >
                                   Raw B2 Files
                                   <span className="badge text-bg-secondary ms-2">
                                        {b2Files.length}
                                   </span>
                              </button>
                         </li>

                    </ul>


                    {/* Toolbar */}
                    <div className="d-flex justify-content-between align-items-center my-3">

                         <div className="input-group" style={{ maxWidth: "450px" }}>
                              <span className="input-group-text">
                                   <i className="bi bi-search"></i>
                              </span>

                              <input
                                   type="text"
                                   className="form-control"
                                   placeholder={
                                        activeTab === "db"
                                             ? "Search movies..."
                                             : "Search B2 files..."
                                   }
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                              />

                              {search && (
                                   <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setSearch("")}
                                   >
                                        <i className="bi bi-x-lg"></i>
                                   </button>
                              )}
                         </div>


                         <button
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                   getMovies();
                                   getB2Files();
                              }}
                              disabled={loading}
                         >
                              <i className="bi bi-arrow-clockwise me-1"></i>
                              Refresh
                         </button>

                    </div>


                    {/* Error */}
                    {error && (
                         <div className="alert alert-danger d-flex justify-content-between align-items-center">
                              <span>{error}</span>

                              <button
                                   className="btn btn-sm btn-danger"
                                   onClick={() => {
                                        setError(null);
                                        getMovies();
                                        getB2Files();
                                   }}
                              >
                                   Retry
                              </button>
                         </div>
                    )}


                    {/* Loading */}
                    {loading && (
                         <div className="text-center py-5">
                              <div
                                   className="spinner-border"
                                   role="status"
                              >
                                   <span className="visually-hidden">
                                        Loading...
                                   </span>
                              </div>
                         </div>
                    )}


                    {/* DATABASE TAB */}
                    {activeTab === "db" && !loading && (

                         <div className="table-responsive">

                              <table className="table table-striped table-hover align-middle">

                                   <thead>
                                        <tr>
                                             <th>#</th>
                                             <th>Title</th>
                                             <th>Umusobanuzi</th>
                                             <th>Genre</th>
                                             <th>Views</th>
                                             <th>Downloads</th>
                                             <th>Year</th>
                                             <th className="text-end">Actions</th>
                                        </tr>
                                   </thead>

                                   <tbody>

                                        {filteredMovies.length === 0 ? (

                                             <tr>
                                                  <td
                                                       colSpan="8"
                                                       className="text-center py-5 text-muted"
                                                  >
                                                       No movies found.
                                                  </td>
                                             </tr>

                                        ) : (

                                             filteredMovies.map((movie, index) => (

                                                  <tr key={movie.id || index}>

                                                       <td>
                                                            <img src={`${thumbnailBase}${movie.thumbnail}`}
                                                                 alt="Thumbnail"
                                                                 className="img-thumbnail"
                                                                 width={60} />
                                                       </td>

                                                       <td>
                                                            <strong>
                                                                 {movie.title || "-"}
                                                            </strong>
                                                       </td>

                                                       <td>
                                                            {movie.translator ||
                                                                 movie.interpretors ||
                                                                 "-"}
                                                       </td>

                                                       <td>
                                                            {movie.genre || "-"}
                                                       </td>

                                                       <td>
                                                            {movie.views || 0}
                                                       </td>

                                                       <td>
                                                            {movie.downloads || 0}
                                                       </td>

                                                       <td>
                                                            {movie.year || "-"}
                                                       </td>

                                                       <td className="text-end">

                                                            <div className="btn-group">

                                                                 <Link
                                                                      to="/play"
                                                                      state={{ video:movie }}
                                                                      className="btn btn-sm btn-outline-primary"
                                                                      title="Play"
                                                                 >
                                                                      <i className="bi bi-play-btn"></i>
                                                                 </Link>

                                                                 <Link
                                                                      to={`/movies/${movie.id}`}
                                                                      className="btn btn-sm btn-outline-primary"
                                                                      title="Hide"
                                                                 >
                                                                      <i className="bi bi-eye-slash"></i>
                                                                 </Link>

                                                                 <Link
                                                                      to="/editmovie"
                                                                      state={{ movie }}
                                                                      className="btn btn-sm btn-outline-secondary"
                                                                      title="Edit"
                                                                 >
                                                                      <i className="bi bi-pencil"></i>
                                                                 </Link>

                                                                 <button
                                                                      className="btn btn-sm btn-outline-danger"
                                                                      title="Delete"
                                                                      onClick={() => {
                                                                           if (
                                                                                window.confirm(
                                                                                     `Delete "${movie.title}"?`
                                                                                )
                                                                           ) {
                                                                                console.log(
                                                                                     "Delete movie:",
                                                                                     movie.id
                                                                                );
                                                                           }
                                                                      }}
                                                                 >
                                                                      <i className="bi bi-trash"></i>
                                                                 </button>

                                                            </div>

                                                       </td>

                                                  </tr>

                                             ))

                                        )}

                                   </tbody>

                              </table>

                         </div>

                    )}


                    {/* B2 TAB */}
                    {activeTab === "b2" && !loading && (

                         <div className="table-responsive">

                              <table className="table table-striped table-hover align-middle">

                                   <thead>
                                        <tr>
                                             <th>#</th>
                                             <th>Name</th>
                                             <th>Size</th>
                                             <th>Date</th>
                                             <th>Type</th>
                                             <th className="text-end">Actions</th>
                                        </tr>
                                   </thead>

                                   <tbody>

                                        {filteredB2Files.length === 0 ? (

                                             <tr>
                                                  <td
                                                       colSpan="6"
                                                       className="text-center py-5 text-muted"
                                                  >
                                                       No B2 files found.
                                                  </td>
                                             </tr>

                                        ) : (

                                             filteredB2Files.map((file, index) => (

                                                  <tr key={file.name || index}>

                                                       <td>
                                                            {index + 1}
                                                       </td>

                                                       <td>
                                                            <i className="bi bi-file-earmark-play me-2"></i>
                                                            {file.name}
                                                       </td>

                                                       <td>
                                                            {formatSize(
                                                                 file.size ||
                                                                 file.contentLength
                                                            )}
                                                       </td>

                                                       <td>
                                                            {formatDate(
                                                                 file.uploadTimestamp ||
                                                                 file.date ||
                                                                 file.uploaded
                                                            )}
                                                       </td>

                                                       <td>
                                                            {file.name
                                                                 ?.split(".")
                                                                 .pop()
                                                                 ?.toUpperCase() || "-"}
                                                       </td>

                                                       <td className="text-end">

                                                            <div className="btn-group">

                                                                 <button
                                                                      className="btn btn-sm btn-outline-secondary"
                                                                      title="Copy filename"
                                                                      onClick={() =>
                                                                           copyToClipboard(
                                                                                file.name
                                                                           )
                                                                      }
                                                                 >
                                                                      <i className="bi bi-copy"></i>
                                                                 </button>

                                                                 <button
                                                                      className="btn btn-sm btn-outline-danger"
                                                                      title="Delete"
                                                                      onClick={() => {
                                                                           if (
                                                                                window.confirm(
                                                                                     `Delete "${file.name}" from B2?`
                                                                                )
                                                                           ) {
                                                                                console.log(
                                                                                     "Delete B2 file:",
                                                                                     file.name
                                                                                );
                                                                           }
                                                                      }}
                                                                 >
                                                                      <i className="bi bi-trash"></i>
                                                                 </button>

                                                            </div>

                                                       </td>

                                                  </tr>

                                             ))

                                        )}

                                   </tbody>

                              </table>

                         </div>

                    )}

               </div>

          </div>
     );
};

export default Movies;
