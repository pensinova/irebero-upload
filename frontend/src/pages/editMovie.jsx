import { useLocation } from "react-router-dom";
import Header from "../components/header";
import { useEffect, useState } from "react";


const thumbnailBase = "https://pub-4ebd8b355f6048948a58511af22de131.r2.dev/";

const EditMovie = () => {
     const { state } = useLocation();
     const movie = state?.movie;


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

     const [title, setTitle] = useState(movie.title);
     const [serieDescription, setSerieDescription] = useState("");
     const [serieYear, setSerieYear] = useState("");
     const [serieCountry, setSerieCountry] = useState("");
     const [serieThumbnail, setSerieThumbnail] = useState("");

     const [newSerieAlert, setNewSerieAlert] = useState("");
     const [newSerieSending, setNewSerieSending] = useState(false);

     const [fillAll, setFillAll] = useState(false);



     const [serie, setSerie] = useState(movie.serie);
     const [genre, setGenre] = useState(movie.genre_id);
     const [translator, setTranslator] = useState(movie.translator_id);
     const [year, setYear] = useState(movie.year);
     const [country, setCountry] = useState(movie.country);
     const [description, setDescription] = useState(movie.description);
     const [language, setLanguage] = useState(movie.language);


// alert(genre);


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




     const updateMovie = async (e) => {
          e.preventDefault();


          const tit = title.trim();
          const descr = description.trim();
          const gen = genre.trim();
          const lang = language.trim();
          const yr = year;
          const video_path = movieName || movie.video_path;
          const thumbnail = thumbnailUrl || movie.thumbnail;
          const translator_id = translator || movie.translator;
          const ser = serie;
          const count = country.trim();

          // alert(movie.id); return
          try {
               const response = await fetch(
                    "https://irebero.pensinova.workers.dev/editmovie",
                    {
                         method: "POST",
                         headers: {
                              "Content-Type": "application/json",
                         },
                         body: JSON.stringify({
                              id: movie.id,
                              title: tit,
                              video_path,
                              thumbnail,
                              description: descr,
                              language: lang,
                              year: yr,
                              country: count,
                              translator_id,
                              serie: ser,
                              genre: gen
                         }),
                    }
               );

               const result = await response.json();

               if (!result.success) {
                    alert(result.message);
               }

               alert(result.message);



          } catch (error) {
               console.error("DB SAVE ERROR:", error);
               alert(error.message);
          }
     };



     // UPLOAD THUMBNAIL TO R2

     async function uploadThumbnail(file) {


          if (!file) return;

          const imageUrl = URL.createObjectURL(file);
          setThumbnailUrl(file.name);


          const formData = new FormData();

          formData.append("thumbnail", file);

          setUploadingThumbnail(true);

          try {

               const res = await fetch("https://irebero.pensinova.workers.dev/upload/thumbnail", {
                    method: "POST",
                    body: formData
               });


               const text = await res.text();


               let data;

               try {
                    data = JSON.parse(text);

                    setUploadingThumbnailSuccess(data);

               }
               catch {

                    throw new Error("Server returned invalid JSON");
               }

               setUploadingThumbnail(false);


          }
          catch (err) {
               setUploadingThumbnailSuccess({ success: false, message: 'Network Error! Try again.' });
               console.log(err);
          }
     }









     if (!movie) {
          return <div className="container">Movie not found.</div>;
     }





     return (
          <div className="container">

               <Header />



               <div className="d-flex justify-content-center">

                    <div className="card my-4 w-50 shadow">

                         <div className="card-header">
                              <h5>
                                   Edit Movie <b>{movie.title}</b>
                              </h5>
                         </div>
                         <div className="card-body">

                              <form onSubmit={updateMovie}>

                                   <div className="">
                                        <label htmlFor="url" className="form-label">
                                             Movie URL:
                                        </label>

                                        <select name=""
                                             className="form-select shadow-sm" id="url"
                                             required
                                             value={movie.video_path}>
                                             {b2Files.map((b2, i) => (
                                                  <option value={b2.name} key={i}>{b2.name}</option>
                                             ))}
                                        </select>

                                   </div>

                                   <div className="mt-2">
                                        <label htmlFor="thumbnail" className="form-label fw-bold">
                                             Thumbnail:
                                        </label>

                                        <input
                                             type="file"
                                             id="thumbnail"
                                             className="form-control shadow-sm"
                                             onChange={(e) => uploadThumbnail(e.target.files[0])}
                                        />

                                        <div className="row">
                                             <div className="col-md-5">

                                                  {uploadingThumbnail === true ? (
                                                       <div className="alert alert-info">
                                                            <div className="spinner-border spinner-border-sm me-1" role="status">
                                                                 <span className="visually-hidden small">Loading...</span>
                                                            </div>
                                                            Uploading Thumbnail...
                                                       </div>)

                                                       :


                                                       <img src={`${thumbnailBase}${movie.thumbnail}`}
                                                            alt="Thumbnail"
                                                            className="img-thumbnail"
                                                            width={150} />
                                                  }
                                             </div>
                                             <div className="col-md-7">
                                                  {/* success */}
                                                  {uploadingThumbnailSuccess.success === true &&
                                                       <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                            <i className="bi bi-check-circle"></i> Image Uploaded Successfully.
                                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                                       </div>}

                                                  {uploadingThumbnailSuccess.success === false &&
                                                       <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                                            <i className="bi bi-x-circle text-danger"></i> {uploadingThumbnailSuccess.message}
                                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                                       </div>
                                                  }

                                             </div>
                                        </div>

                                   </div>

                                   <div className="mt-4">
                                        <label htmlFor="title" className="form-label fw-bold">
                                             Title:
                                        </label>

                                        <input
                                             type="text"
                                             id="title"
                                             className="form-control shadow-sm"
                                             value={title}
                                             onChange={(e) => setTitle(e.target.value)}
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
                                             value={genre}
                                             onChange={(e) => setGenre(e.target.value)}
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
                                             value={translator}
                                             onChange={(e) => setTranslator(e.target.value)}
                                             required
                                        >
                                             {/* <option value={null}>- Select -</option> */}

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
                                             value={year}
                                             onChange={(e) => setYear(e.target.value)}
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
                                             value={country}
                                             onChange={e => setCountry(e.target.value)}
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
                                             defaultValue={language}
                                             onChange={e => setLanguage(e.target.value)}
                                             required
                                        />
                                   </div>

                                   <div className="mt-2">
                                        <label htmlFor="series" className="form-label fw-bold">
                                             Serie:
                                        </label>

                                        <select
                                             id="series"
                                             className="form-select shadow-sm"
                                             defaultValue={serie}
                                             onChange={e => setSerie(e.target.value)}
                                             required

                                        >
                                             <option value='null'>- Not serie -</option>
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
                                             defaultValue={description}
                                             onChange={e => setDescription(e.target.value)}
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

export default EditMovie;