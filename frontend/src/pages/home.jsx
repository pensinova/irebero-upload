import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from '../components/header';

const workerUrl = "https://irebero.pensinova.workers.dev/";
const thumbnailBase = "https://pub-4ebd8b355f6048948a58511af22de131.r2.dev/";

export default function Home() {

     const [movies, setMovies] = useState([]);
     const [genres, setGenres] = useState([]);
     const [translators, setTranslators] = useState([]);
     const [recentMovies, setRecentMovies] = useState([]);
     const [trendingMovies, setTrendingMovies] = useState([]);
     const [users, setUsers] = useState([]);
     const [series, setSeries] = useState([]);

     const [loadingData, setLoadingData] = useState(false);


     const [mostViewed, setMostViewed] = useState({});
     const [mostDownloaded, setMostDownloaded] = useState({});
     const [mostRecent, setMostRecent] = useState({});

     const [totalViewed, setTotalViewed] = useState(0);
     const [totalDownloads, setTotalDownloads] = useState(0);
     const [totalMovies, setTotalMovies] = useState(0);
     const [totalUsers, setTotalUsers] = useState(0);





     useEffect(() => {
          async function getData() {
               try {

                    setLoadingData(true);

                    const [
                         movRes,
                         genRes,
                         transRes,
                         recRes,
                         trendRes,
                         seriesRes,
                         usersRes
                    ] = await Promise.all([
                         fetch("https://irebero.pensinova.workers.dev/movies"),
                         fetch("https://irebero.pensinova.workers.dev/genres"),
                         fetch("https://irebero.pensinova.workers.dev/translators"),
                         fetch("https://irebero.pensinova.workers.dev/movies/recent"),
                         fetch("https://irebero.pensinova.workers.dev/movies/trending"),
                         fetch("https://irebero.pensinova.workers.dev/series"),
                         fetch("https://irebero.pensinova.workers.dev/users")
                    ]);

                    const [
                         movies,
                         genres,
                         translators,
                         recentMovies,
                         trendingMovies,
                         series,
                         usrs
                    ] = await Promise.all([
                         movRes.json(),
                         genRes.json(),
                         transRes.json(),
                         recRes.json(),
                         trendRes.json(),
                         seriesRes.json(),
                         usersRes.json(),
                    ]);

                    setMovies(movies);
                    setGenres(genres);
                    setTranslators(translators);
                    setRecentMovies(recentMovies);
                    setTrendingMovies(trendingMovies);
                    setSeries(series);
                    setUsers(usrs);



                    const totalMovies = movies.length;

                    const totalViews = movies.reduce(
                         (sum, movie) => sum + (Number(movie.views) || 0),
                         0
                    );

                    const totalDownloads = movies.reduce(
                         (sum, movie) => sum + (Number(movie.downloads) || 0),
                         0
                    );

                    const mostViewed = [...movies].sort(
                         (a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)
                    )[0];

                    const mostDownloaded = [...movies].sort(
                         (a, b) => (Number(b.downloads) || 0) - (Number(a.downloads) || 0)
                    )[0];

                    const mostRecent = [...movies].sort(
                         (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )[0];


                    setTotalDownloads(totalDownloads);
                    setTotalMovies(totalMovies);
                    setTotalUsers(usrs.length);
                    setTotalViewed(totalViews);

                    setMostDownloaded(mostDownloaded);
                    setMostViewed(mostViewed);
                    setMostRecent(mostRecent);



               } catch (err) {
                    console.error("Fetching Error:", err);
               }


               setLoadingData(false);
          }

          getData();
     }, []);





     return (
          <div className="container">

               <Header />




               <div className="">




                    <div className="p-4">


                         <div className="row g-3 mb-4">
                              <div className="col-md-3">
                                   <div className="card bg-info bg-gradientshadow rounded-4 p-3">
                                        <h6>Total Movies</h6>
                                        <h3 id="totalMovies">{totalMovies}</h3>
                                   </div>
                              </div>

                              <div className="col-md-3">
                                   <div className="card bg-dark bg-gradient shadow rounded-4 p-3 text-light">
                                        <h6>Users</h6>
                                        <h3 id="totalUsers">{totalUsers}</h3>
                                   </div>
                              </div>

                              <div className="col-md-3">
                                   <div className="card bg-success bg-gradient shadow rounded-4 p-3 text-light">
                                        <h6>Views</h6>
                                        <h3 id="totalViews">{totalViewed}</h3>
                                   </div>
                              </div>

                              <div className="col-md-3">
                                   <div className="card bg-secondary bg-gradient shadow rounded-4 p-3 text-light">
                                        <h6>Downloads</h6>
                                        <h3 id="totalDownloads">{totalDownloads}</h3>
                                   </div>
                              </div>
                         </div>


                         <div className="row g-5 mb-4">


                              <div className="col-md-4">
                                   <div className="card bg-black bg-gradient shadow rounded-4 overflow-hidden">
                                        <img
                                             id="most-viewed"
                                             className="card-img-top movie-card-img"
                                             src={thumbnailBase + mostViewed.thumbnail}
                                             alt="Most Viewed"
                                             style={{
                                                  width: "100%",
                                                  height: 160,
                                                  objectFit: "cover",
                                                  objectPosition: "center",
                                             }}
                                        />
                                        <div className="card-body">
                                             <small className="text-secondary text-uppercase">Most Viewed</small>
                                             <h5 id="mostViewedTitle" className="text-light fw-bold mt-2">{mostViewed.title}</h5>

                                             <div className="d-flex align-items-center gap-2 text-info">
                                                  <i className="bi bi-eye-fill"></i>
                                                  <span id="mostViewedCount">{mostViewed.views}</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>


                              <div className="col-md-4">
                                   <div className="card bg-black bg-gradient shadow rounded-4 overflow-hidden">
                                        <img
                                             id="most-viewed"
                                             className="card-img-top movie-card-img"
                                             src={thumbnailBase + mostDownloaded.thumbnail}
                                             alt="Most Viewed"
                                             style={{
                                                  width: "100%",
                                                  height: 160,
                                                  objectFit: "cover",
                                                  objectPosition: "center",
                                             }}
                                        />
                                        <div className="card-body">
                                             <small className="text-secondary text-uppercase">Most Downloaded</small>
                                             <h5 id="mostDownloadedTitle" className="text-light fw-bold mt-2">{mostDownloaded.title}</h5>

                                             <div className="d-flex align-items-center gap-2 text-warning">
                                                  <i className="bi bi-download"></i>
                                                  <span id="mostDownloadedCount">{mostDownloaded.downloads}</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>


                              <div className="col-md-4">
                                   <div className="card bg-black bg-gradient shadow rounded-4 overflow-hidden">
                                        <img
                                             id="most-viewed"
                                             className="card-img-top movie-card-img"
                                             src={thumbnailBase + mostRecent.thumbnail}
                                             alt="Most Viewed"
                                             style={{
                                                  width: "100%",
                                                  height: 160,
                                                  objectFit: "cover",
                                                  objectPosition: "center",
                                             }}
                                        />
                                        <div className="card-body">
                                             <small className="text-secondary text-uppercase">Most Recent</small>
                                             <h5 id="mostRecentTitle" className="text-light fw-bold mt-2">{mostRecent.title}</h5>

                                             <div className="d-flex align-items-center gap-2 text-success">
                                                  <i className="bi bi-clock-history"></i>
                                                  <span id="mostRecentDate">{mostRecent?.created_at
                                                       ? new Date(mostRecent.created_at).toLocaleDateString()
                                                       : "-"}</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                         </div>



                         <div className="row g-3h mt-5">


                              <div className="col-md-6">
                                   <h4>Translators</h4>
                                   <div className="table-responsive rounded shadow">
                                        <table className="table">
                                             <thead>
                                                  <tr>
                                                       <th>#</th>
                                                       <th>Name</th>
                                                       <th>Action</th>

                                                  </tr>
                                             </thead>

                                             <tbody>
                                                  {
                                                       translators.map((items, i) => (
                                                            <tr key={i}>
                                                                 <td>{items.id}</td>
                                                                 <td>{items.name}</td>
                                                                 <td className="text-end">

                                                                      <div className="btn-group">



                                                                           <Link
                                                                                to={`/movies/${items.id}/edit`}
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
                                                                                               `Delete "${items.name}"?`
                                                                                          )
                                                                                     ) {
                                                                                          console.log(
                                                                                               "Delete genre:",
                                                                                               items.id
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
                                                  }
                                             </tbody>


                                        </table>
                                   </div>
                              </div>


                              <div className="col-md-6">
                                   <h4>Genres</h4>
                                   <div className="table-responsive rounded shadow">
                                        <table className="table">
                                             <thead>
                                                  <tr>
                                                       <th>#</th>
                                                       <th>Name</th>
                                                       <th>Actions</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {
                                                       genres.map((gen, i) => (
                                                            <tr key={i}>
                                                                 <td>{gen.id}</td>
                                                                 <td>{gen.name}</td>
                                                                 <td className="text-end">

                                                                      <div className="btn-group">



                                                                           <Link
                                                                                to={`/movies/${gen.id}/edit`}
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
                                                                                               `Delete "${gen.name}"?`
                                                                                          )
                                                                                     ) {
                                                                                          console.log(
                                                                                               "Delete genre:",
                                                                                               gen.id
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
                                                  }
                                             </tbody>


                                        </table>
                                   </div>
                              </div>


                         </div>


                         <div className="mt-4">

                              <div className="card shadow rounded table-responsive">
                                   <div className="card-header">
                                        Latest Movies
                                   </div>

                                   <table className="table table-secondary table-striped table-hover mb-4">
                                        <thead>
                                             <tr>
                                                  <th>#</th>
                                                  <th>Title</th>
                                                  <th>Genre</th>
                                                  <th>Translator</th>
                                                  <th>Views</th>
                                                  <th>Downloads</th>
                                                  <th>Action</th>
                                             </tr>
                                        </thead>

                                        <tbody id="table-data">
                                             {recentMovies.map((item) => (
                                                  <tr key={item.id}>
                                                       <td>{item.id}</td>
                                                       <td>{item.title}</td>
                                                       <td>{item.genre}</td>
                                                       <td>{item.translator}</td>
                                                       <td>{item.views}</td>
                                                       <td>{item.downloads}</td>
                                                       <td className="text-end">

                                                            <div className="btn-group">

                                                                 <Link
                                                                      to={`/movies/${item.id}`}
                                                                      className="btn btn-sm btn-outline-primary"
                                                                      title="View"
                                                                 >
                                                                      <i className="bi bi-eye"></i>
                                                                 </Link>

                                                                 <Link
                                                                      to={`/movies/${item.id}/edit`}
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
                                                                                     `Delete "${item.title}"?`
                                                                                )
                                                                           ) {
                                                                                console.log(
                                                                                     "Delete movie:",
                                                                                     item.id
                                                                                );
                                                                           }
                                                                      }}
                                                                 >
                                                                      <i className="bi bi-trash"></i>
                                                                 </button>

                                                            </div>

                                                       </td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>

                              </div>

                         </div>


                    </div>

               </div>

          </div>
     )
}