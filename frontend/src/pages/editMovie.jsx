import { useLocation } from "react-router-dom";
import Header from "../components/header";

const EditMovie = () => {
     const { state } = useLocation();
     const movie = state?.movie;

     if (!movie) {
          return <div className="container">Movie not found.</div>;
     }

     return (
          <div className="container">

               <Header />

               <h1>
                    Edit Movie <b>{movie.title}</b>
               </h1>

               <div className="row">

                    <div className="col-md-3"></div>

                    <div className="col-md-8">

                         <form>

                              <div className="mt-2">
                                   <label htmlFor="url" className="form-label">
                                        Movie URL
                                   </label>

                                   <input
                                        type="text"
                                        id="url"
                                        className="form-control"
                                        defaultValue={movie.video_path}
                                   />
                              </div>

                              <div className="mt-2">
                                   <label htmlFor="thumbnail" className="form-label">
                                        Thumbnail
                                   </label>

                                   <input
                                        type="text"
                                        id="thumbnail"
                                        className="form-control"
                                        defaultValue={movie.thumbnail}
                                   />
                              </div>

                              <div className="mt-2">
                                   <label htmlFor="title" className="form-label">
                                        Title
                                   </label>

                                   <input
                                        type="text"
                                        id="title"
                                        className="form-control"
                                        defaultValue={movie.title}
                                   />
                              </div>

                              <div className="mt-2">
                                   <label htmlFor="genre" className="form-label">
                                        Genre
                                   </label>

                                   <input
                                        type="text"
                                        id="genre"
                                        className="form-control"
                                        defaultValue={movie.genre}
                                   />
                              </div>

                              <div className="mt-2">
                                   <label htmlFor="translator" className="form-label">
                                        Translator
                                   </label>

                                   <input
                                        type="text"
                                        id="translator"
                                        className="form-control"
                                        defaultValue={movie.translator}
                                   />
                              </div>

                              <div className="mt-2">
                                   <label htmlFor="year" className="form-label">
                                        Year
                                   </label>

                                   <input
                                        type="number"
                                        id="year"
                                        className="form-control"
                                        defaultValue={movie.year}
                                   />
                              </div>

                              <div className="mt-2">
                                   <label htmlFor="country" className="form-label">
                                        Country
                                   </label>

                                   <input
                                        type="text"
                                        id="country"
                                        className="form-control"
                                        defaultValue={movie.country}
                                   />
                              </div>

                              <div className="mt-2">
                                   <label htmlFor="language" className="form-label">
                                        Language
                                   </label>

                                   <input
                                        type="text"
                                        id="language"
                                        className="form-control"
                                        defaultValue={movie.language}
                                   />
                              </div>

                              <div className="mt-2">
                                   <label htmlFor="series" className="form-label">
                                        Series
                                   </label>

                                   <input
                                        type="text"
                                        id="series"
                                        className="form-control"
                                        defaultValue={movie.series}
                                   />
                              </div>

                              <div className="mt-2">
                                   <label htmlFor="description" className="form-label">
                                        Description
                                   </label>

                                   <textarea
                                        id="description"
                                        className="form-control"
                                        rows="5"
                                        defaultValue={movie.description}
                                   ></textarea>
                              </div>

                              <div className="mt-3 mb-4">
                                   <button type="submit" className="btn btn-primary">
                                        <i className="bi bi-save"></i> Save Changes
                                   </button>
                              </div>

                         </form>

                    </div>

                    <div className="col-md-3"></div>

               </div>
          </div>
     );
};

export default EditMovie;