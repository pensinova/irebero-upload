import { useLocation } from "react-router-dom";
import Header from "../components/header";
import { useEffect, useState } from "react";


const thumbnailBase = "https://pub-4ebd8b355f6048948a58511af22de131.r2.dev/";

const EditSerie = () => {
     const { state } = useLocation();
     const serie = state?.serie;


     const [uploadProgress, setUploadProgress] = useState(0);
     const [movies, setMovies] = useState([]);
     const [genres, setGenres] = useState([]);
     const [translators, setTranslators] = useState([]);
     const [recentMovies, setRecentMovies] = useState([]);
     const [trendingMovies, setTrendingMovies] = useState([]);
     const [series, setSeries] = useState([]);
     const [loadingData, setLoadingData] = useState(false);

     const [newGenreName, setNewGenreName] = useState("");
     const [newSerieTitle, setNewSerieTitle] = useState("");
     const [newSerieTranslator, setNewSerieTranslator] = useState("");
     const [newSerieGenre, setNewSerieGenre] = useState("");
     const [sendingNewGenre, setSendingNewGenre] = useState(false);
     const [newGenreAlert, setNewGenreAlert] = useState("");

     const [movieUrl, setMovieUrl] = useState("");
     const [movieType, setMovieType] = useState("");
     const [movieName, setMovieName] = useState("");
     const [movieSize, setMovieSize] = useState("");
     const [uploadingMovieFile, setUploadingMovieFile] = useState(false);
     const [uploadingMovieFileSuccess, setUploadingMovieFileSuccess] = useState({});

     const [thumbnailUrl, setThumbnailUrl] = useState("");
     const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
     const [uploadingThumbnailSuccess, setUploadingThumbnailSuccess] = useState({});

     const [b2Files, setB2Files] = useState([]);

     const [selectFromAvailable, setSelectFromAvailable] = useState(false);

     const [title, setTitle] = useState("");
     const [serieDescription, setSerieDescription] = useState("");
     const [serieYear, setSerieYear] = useState("");
     const [serieCountry, setSerieCountry] = useState("");
     const [serieThumbnail, setSerieThumbnail] = useState("");

     const [newSerieAlert, setNewSerieAlert] = useState("");
     const [newSerieSending, setNewSerieSending] = useState(false);

     const [fillAll, setFillAll] = useState(false);



     // FETCHES



     async function getTranslators() {

          try {
               const translator = await fetch("https://irebero.pensinova.workers.dev/translators");

               const data = await translator.json();
               setTranslators(data);
               return null;
          }
          catch (e) {

               console.log("Failed to fetch translators ", e);
               return null;
          }

     };

     async function getGenres() {
          try {
               const genre = await fetch("https://irebero.pensinova.workers.dev/genres");

               const data = await genre.json();
               setGenres(data);
               return null;
          }
          catch (e) {

               console.log("Failed to fetch movie genres ", e);
               return null;
          }
     };



     async function getSeries() {
          try {
               const serie = await fetch("https://irebero.pensinova.workers.dev/series");

               const data = await serie.json();

               setSeries(data);

          }
          catch (e) {

               console.log("Failed to fetch season movies ", e);
               return null;
          }
     };


     async function getB2Files() {
          try {
               const response = await fetch(
                    "https://irebero.pensinova.workers.dev/getb2movies"
               );

               const data = await response.json();

               setB2Files(data.files);

               console.log("B2 Files fetched successfully:", data.files);

          } catch (e) {
               console.log("Failed to fetch files from B2:", e);
          }
     }



     useEffect(() => {
          getSeries();
          getB2Files();
          getTranslators();
          getGenres();
     }, []);




     if (!serie) {
          return <div className="container">Movie not found.</div>;
     }





     return (
          <div className="container">

               <Header />



               <div className="d-flex justify-content-center">

                    <div className="card my-4 w-50 shadow">

                         <div className="card-header">
                              <h5>
                                   Edit Serie <b>{serie.title}</b>
                              </h5>
                         </div>
                         <div className="card-body">

                              <form>

                                   

                                   <div className="mt-2">
                                        <label htmlFor="thumbnail" className="form-label fw-bold">
                                             Thumbnail:
                                        </label>

                                        <input
                                             type="file"
                                             id="thumbnail"
                                             className="form-control shadow-sm"
                                        />


                                        <img src={`${thumbnailBase}${serie.thumbnail}`}
                                             alt="Thumbnail"
                                             className="img-thumbnail"
                                             width={150} />
                                   </div>

                                   <div className="mt-4">
                                        <label htmlFor="title" className="form-label fw-bold">
                                             Title:
                                        </label>

                                        <input
                                             type="text"
                                             id="title"
                                             className="form-control shadow-sm"
                                             defaultValue={serie.title}
                                             required
                                        />
                                   </div>

                                   <div className="mt-2">
                                        <label htmlFor="genre" className="form-label fw-bold">
                                             Genre:
                                        </label>

                                        <select
                                             id="genre"
                                             className="form-select shadow-sm"
                                             defaultValue={serie.genre}
                                             required
                                        >

                                             {genres.map((gen) => (
                                                  <option value={gen.id} key={gen.id}>{gen.name}</option>
                                             ))}
                                        </select>
                                   </div>

                                   <div className="mt-2">
                                        <label htmlFor="translator" className="form-label fw-bold">
                                             Translator:
                                        </label>

                                        <select
                                             id="translator"
                                             className="form-select shadow-sm"
                                             defaultValue={serie.translator}
                                             required
                                        >
                                             {translators.map((trans, i) => (
                                                  <option value={trans.id} key={i}>{trans.name}</option>
                                             ))}
                                        </select>
                                   </div>

                                   <div className="mt-2">
                                        <label htmlFor="year" className="form-label fw-bold">
                                             Movie Year:
                                        </label>

                                        <input
                                             type="number"
                                             id="year"
                                             className="form-control shadow-sm"
                                             defaultValue={serie.year}
                                             required
                                        />
                                   </div>

                                   <div className="mt-2">
                                        <label htmlFor="country" className="form-label fw-bold">
                                             Origin Country:
                                        </label>

                                        <input
                                             type="text"
                                             id="country"
                                             className="form-control shadow-sm"
                                             defaultValue={serie.country}
                                             required
                                        />
                                   </div>

                                   <div className="mt-2">
                                        <label htmlFor="language" className="form-label fw-bold">
                                             Language:
                                        </label>

                                        <input
                                             type="text"
                                             id="language"
                                             className="form-control shadow-sm"
                                             defaultValue={serie.language}

                                        />
                                   </div>

                                   <div className="mt-2">
                                        <label htmlFor="series" className="form-label fw-bold">
                                             Serie:
                                        </label>

                                        <select
                                             id="series"
                                             className="form-select shadow-sm"
                                             defaultValue={serie.series}
                                             required

                                        >
                                             <option value="">Not serie</option>
                                             {
                                                  series.map((ser, i) => (
                                                       <option value={ser.id} key={i}>{ser.title}</option>
                                                  ))
                                             }
                                        </select>
                                   </div>

                                   <div className="mt-2">
                                        <label htmlFor="description" className="form-label fw-bold">
                                             Description:
                                        </label>

                                        <textarea
                                             id="description"
                                             className="form-control shadow-sm"
                                             rows="5"
                                             defaultValue={serie.description}
                                             required
                                        ></textarea>
                                   </div>

                                   <div className="mt-3 mb-4">
                                        <button type="submit" className="btn btn-primary shadow-sm">
                                             <i className="bi bi-floppy"></i> Save Changes
                                        </button>
                                   </div>

                              </form>

                         </div>

                    </div>



               </div>
          </div>
     );
};

export default EditSerie;