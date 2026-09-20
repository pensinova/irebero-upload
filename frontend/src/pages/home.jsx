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

     const [transToEdit, setTransToEdit] = useState(null);
     const [genToEdit, setGenToEdit] = useState(null);

     const [loading, setLoading] = useState(false);
     const [newSerieAlert, setNewSerieAlert] = useState("");
     const [newSerieSending, setNewSerieSending] = useState(false);

     const [fillAll, setFillAll] = useState(false);



     const [newGenreName, setNewGenreName] = useState("");
     const [sendingNewGenre, setSendingNewGenre] = useState(false);
     const [newGenreAlert, setNewGenreAlert] = useState("");

     const [newTranslatorName, setNewTranslatorName] = useState("");
     const [sendingNewTranslator, setSendingNewTranslator] = useState(false);
     const [newTranslatorAlert, setNewTranslatorAlert] = useState("");








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

     useEffect(() => {


          getData();
     }, []);



     const saveTrans = async () => {

          if (transToEdit) {

               setLoading(true)

               const update = await fetch(`https://irebero.pensinova.workers.dev/edittranslator?id=${transToEdit.id}&name=${transToEdit.name}`);

               const result = await update.json();

               if (result.success) {

                    getData();
                    setTransToEdit(null);

               }
               else {
                    alert(result.message || "Failed to update translator");
               }
               setLoading(false);

          }
          else {
               alert("Select translator to edit");
          }
     }



     // NEW GENRE
     const submitGenre = async (e) => {

          e.preventDefault();

          setSendingNewGenre(true)
          setNewGenreAlert("");
          const res = await fetch(`https://irebero.pensinova.workers.dev/newgenre?name=${newGenreName}`);


          const result = await res.json();



          if (result.success === true) {
               setNewGenreName("");
               setNewGenreAlert("Genre added successfully!");


          }
          else {
               setNewGenreAlert(result.message);
          }

          setSendingNewGenre(false);
          setTimeout(() => {

               setNewGenreAlert("");

          }, 5000);
     }



     // NEW TRANSLATOR
     const submitTranslator = async (e) => {

          e.preventDefault();

          setSendingNewTranslator(true)
          setNewTranslatorAlert("");
          const res = await fetch(`https://irebero.pensinova.workers.dev/newtranslator?name=${newTranslatorName}`);


          const result = await res.json();



          if (result.success === true) {
               setNewTranslatorName("");
               setNewTranslatorAlert("Translator added successfully!");

               getData();

          }
          else {
               setNewTranslatorAlert(result.message);
          }

          setSendingNewTranslator(false);
          setTimeout(() => {

               setNewTranslatorAlert("");

          }, 5000);
     }


     const deleteTranslator = async (id, name) => {

          if (
               window.confirm(
                    `Delete "${name}"?`
               )
          ) {

               setLoading(true);

               try {
                    const res = await fetch(`https://irebero.pensinova.workers.dev/deletetranslator?id=${id}&name=${name}`);


                    const result = await res.json();



                    if (result.success === true) {

                         getData();

                    }
                    else {
                         alert(result.message);
                    }
               }
               catch (e) {
                    alert("Error while deleting Translator")
               }

               setLoading(false);

          }


     }



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
                                   <div className="table-responsive rounded shadow" style={{ height: 400 }}>
                                        <table className="table">
                                             <thead>
                                                  <tr>
                                                       <th>#</th>
                                                       <th>Name</th>
                                                       <th className="text-end">
                                                            <button className="btn btn-outline-primary rounded-5" type="button" data-bs-toggle="modal" data-bs-target="#newTranslator">
                                                                 <i class="bi bi-plus-circle"></i>
                                                            </button>
                                                       </th>

                                                  </tr>
                                             </thead>

                                             <tbody>
                                                  {
                                                       translators.map((items, i) => (
                                                            <tr key={i}>
                                                                 <td>{i + 1}</td>



                                                                 <td>
                                                                      {transToEdit && transToEdit.id === items.id ? (
                                                                           <input
                                                                                autoFocus
                                                                                type="text"
                                                                                className="form-control border-primary shadow-sm"
                                                                                value={transToEdit.name}
                                                                                onChange={(e) => {
                                                                                     setTransToEdit({ ...items, name: e.target.value });
                                                                                }}

                                                                           />) :
                                                                           <> {items.name}</>
                                                                      }
                                                                 </td>
                                                                 <td className="text-end">

                                                                      <div className="btn-group">


                                                                           {transToEdit && transToEdit.id === items.id ?

                                                                                !loading ?
                                                                                     (<button
                                                                                          onClick={() => saveTrans()}
                                                                                          className="btn btn-sm btn-primary"
                                                                                          type="submit"
                                                                                     >
                                                                                          <i className="bi bi-floppy"></i>
                                                                                     </button>) :
                                                                                     (
                                                                                          <button
                                                                                               className="btn btn-sm btn-primary"
                                                                                               disabled={loading}
                                                                                          >
                                                                                               <div className="spinner-border spinner-border-sm" role="status">
                                                                                                    <span className="visually-hidden">Loading...</span>
                                                                                               </div>
                                                                                          </button>
                                                                                     )
                                                                                :

                                                                                <button
                                                                                     onClick={() => setTransToEdit(items)}
                                                                                     className="btn btn-sm btn-outline-secondary"
                                                                                >
                                                                                     <i className="bi bi-pencil"></i>
                                                                                </button>}


                                                                           {
                                                                                !loading ?

                                                                                     <button
                                                                                          className="btn btn-sm btn-outline-danger"
                                                                                          title="Delete"
                                                                                          onClick={() => deleteTranslator(items.id, items.name)}
                                                                                     >
                                                                                          <i className="bi bi-trash"></i>
                                                                                     </button> :
                                                                                     <button
                                                                                          className="btn btn-sm btn-outline-danger"
                                                                                          title="Delete"
                                                                                          disabled={loading}
                                                                                     >
                                                                                          <div className="spinner-border spinner-border-sm" role="status">
                                                                                               <span className="visually-hidden">Loading...</span>
                                                                                          </div>
                                                                                     </button>
                                                                           }

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
                                   <div className="table-responsive rounded shadow" style={{ height: 400 }}>
                                        <table className="table">
                                             <thead>
                                                  <tr>
                                                       <th>#</th>
                                                       <th>Name</th>
                                                       <th className="text-end">
                                                            <button className="btn btn-outline-success rounded-5" type="button" data-bs-toggle="modal" data-bs-target="#newGenre">
                                                                 <i class="bi bi-plus-circle"></i>
                                                            </button>
                                                       </th>
                                                  </tr>
                                             </thead>


                                             <tbody>
                                                  {
                                                       genres.map((gen, i) => (
                                                            <tr key={i}>
                                                                 <td>{i+1}</td>
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





               {/* ------ NEW GENRE ----- */}
               <div className="modal fade bg-dark" id="newGenre" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="newGenreLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                         <div className="modal-content bg-secondary text-light p-3">
                              <div className="d-flex justify-content-between">
                                   <h1 className="modal-title fs-5" id="newGenreLabel">New Genre</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              {
                                   newGenreAlert && (
                                        <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                                             {newGenreAlert}
                                             <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>
                                   )
                              }

                              <form action="" className="form" onSubmit={submitGenre}>
                                   <div className="modal-body my-3">


                                        <label htmlFor="name">Genre:</label>
                                        <input type="text"
                                             className="form-control mt-2"
                                             placeholder="Enter Genre Name"
                                             value={newGenreName}
                                             onChange={(e) => setNewGenreName(e.target.value)}
                                             required />


                                   </div>
                                   <div className="d-flex justify-content-center">
                                        <button type="button" className="btn btn-sm btn-danger m-1" data-bs-dismiss="modal">Close</button>
                                        {sendingNewGenre ?
                                             <button type="submit" className="btn btn-sm btn-info m-1" disabled>Sending...</button> :
                                             <button type="submit" className="btn btn-sm btn-primary m-1">Submit</button>
                                        }
                                   </div>
                              </form>
                         </div>
                    </div>
               </div>




               {/* ------ NEW TRANSLATOR ----- */}
               <div className="modal fade bg-dark" id="newTranslator" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="newGenreLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                         <div className="modal-content bg-secondary text-light p-3">
                              <div className="d-flex justify-content-between">
                                   <h1 className="modal-title fs-5" id="newTranslatorLabel">New Translator</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              {
                                   newTranslatorAlert && (
                                        <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                                             {newTranslatorAlert}
                                             <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>
                                   )
                              }

                              <form action="" className="form" onSubmit={submitTranslator}>
                                   <div className="modal-body my-3">


                                        <label htmlFor="name">Translator:</label>
                                        <input type="text"
                                             className="form-control mt-2"
                                             placeholder="Translator's Name"
                                             value={newTranslatorName}
                                             onChange={(e) => setNewTranslatorName(e.target.value)}
                                             required />


                                   </div>
                                   <div className="d-flex justify-content-center">
                                        <button type="button" className="btn btn-sm btn-danger m-1" data-bs-dismiss="modal">Close</button>
                                        {sendingNewTranslator ?
                                             <button type="submit" className="btn btn-sm btn-info m-1" disabled>Sending...</button> :
                                             <button type="submit" className="btn btn-sm btn-primary m-1">Submit</button>
                                        }
                                   </div>
                              </form>
                         </div>
                    </div>
               </div>






          </div>
     )
}