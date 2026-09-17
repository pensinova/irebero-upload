import { useState, useEffect } from "react";


export default function App() {

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


  async function getData() {
    try {

      setLoadingData(true);

      const [
        movRes,
        genRes,
        transRes,
        recRes,
        trendRes,
        seriesRes
      ] = await Promise.all([
        fetch("https://irebero.pensinova.workers.dev/movies"),
        fetch("https://irebero.pensinova.workers.dev/genres"),
        fetch("https://irebero.pensinova.workers.dev/translators"),
        fetch("https://irebero.pensinova.workers.dev/movies/recent"),
        fetch("https://irebero.pensinova.workers.dev/movies/trending"),
        fetch("https://irebero.pensinova.workers.dev/series")
      ]);

      const [
        movies,
        genres,
        translators,
        recentMovies,
        trendingMovies,
        series
      ] = await Promise.all([
        movRes.json(),
        genRes.json(),
        transRes.json(),
        recRes.json(),
        trendRes.json(),
        seriesRes.json()
      ]);




      setMovies(movies);
      setGenres(genres);
      setTranslators(translators);
      setRecentMovies(recentMovies);
      setTrendingMovies(trendingMovies);
      setSeries(series);

    } catch (err) {
      console.error("Fetching Error:", err);
    }

    setLoadingData(false);
  }
  useEffect(() => {

    getData();
  }, []);


  useEffect(() => {
    return () => {
      if (movieUrl) {
        URL.revokeObjectURL(movieUrl);
      }
    };
  }, [movieUrl]);











  const submitGenre = async (e) => {

    e.preventDefault();

    setSendingNewGenre(true)

    const res = await fetch(`https://irebero.pensinova.workers.dev/newgenre?name=${newGenreName}`);


    const result = await res.json();



    if (result.success === true) {
      setNewGenreName("");
      setNewGenreAlert("Genre added successfully!");
      getData();
    }
    else {
      setNewGenreAlert(result.message);
    }

    setSendingNewGenre(false);
  }


  // upload movie file to B2

  async function uploadMovie(file) {

    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

    const videoUrl = URL.createObjectURL(file);

    setMovieName(file.name);
    setMovieSize(sizeMB);
    setMovieUrl(videoUrl);
    setMovieType(file.type);

    setUploadingMovieFile(true);
    setUploadingMovieFileSuccess({});
    setUploadProgress(0);


    // =====================================
    // CREATE UNIQUE UPLOAD ID
    // =====================================

    const uploadId = crypto.randomUUID();


    // =====================================
    // LISTEN TO SERVER → B2 PROGRESS
    // =====================================

    const eventSource = new EventSource(
      `http://localhost:5000/upload-progress/${uploadId}`
    );


    eventSource.onmessage = (event) => {

      try {

        const data = JSON.parse(event.data);

        console.log("Server progress:", data);

        if (typeof data.progress === "number") {
          setUploadProgress(data.progress);
        }

        if (
          data.status === "completed" ||
          data.status === "error"
        ) {
          eventSource.close();
        }

      } catch (error) {
        console.error("Progress parsing error:", error);
      }
    };


    eventSource.onerror = () => {
      console.log("Progress connection closed");
      eventSource.close();
    };


    // =====================================
    // FORM DATA
    // =====================================

    const formData = new FormData();

    formData.append("file", file);


    // =====================================
    // XHR
    // =====================================

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      "http://localhost:5000/upload",
      true
    );

    xhr.setRequestHeader(
      "X-Upload-ID",
      uploadId
    );


    // =====================================
    // REACT → EXPRESS
    // =====================================

    xhr.upload.onprogress = (event) => {

      if (event.lengthComputable) {

        const clientPercent =
          Math.round(
            (event.loaded / event.total) * 100
          );

        // React → Express = first 50%
        const overallProgress =
          Math.round(clientPercent / 2);

        setUploadProgress(overallProgress);
      }
    };


    // =====================================
    // COMPLETE
    // =====================================

    xhr.onload = () => {

      eventSource.close();

      setUploadingMovieFile(false);

      if (xhr.status >= 200 && xhr.status < 300) {

        try {

          const data = JSON.parse(xhr.responseText);

          setUploadProgress(100);

          setUploadingMovieFileSuccess(data);

          console.log("Upload completed:", data);

        } catch {

          setUploadingMovieFileSuccess({
            success: false,
            message: "Invalid server response"
          });
        }

      } else {

        try {

          const data = JSON.parse(xhr.responseText);

          setUploadingMovieFileSuccess({
            success: false,
            message: data.error || "Upload failed"
          });

        } catch {

          setUploadingMovieFileSuccess({
            success: false,
            message: `Upload failed (${xhr.status})`
          });
        }
      }
    };


    // =====================================
    // NETWORK ERROR
    // =====================================

    xhr.onerror = () => {

      eventSource.close();

      setUploadingMovieFile(false);

      setUploadingMovieFileSuccess({
        success: false,
        message: "Network Error! Try again."
      });
    };


    // =====================================
    // CANCEL
    // =====================================

    xhr.onabort = () => {

      eventSource.close();

      setUploadingMovieFile(false);

      setUploadingMovieFileSuccess({
        success: false,
        message: "Upload cancelled."
      });
    };


    // =====================================
    // START
    // =====================================

    xhr.send(formData);
  }



  // UPLOAD THUMBNAIL TO R2

  async function uploadThumbnail(file) {


    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setThumbnailUrl(imageUrl);


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

  const uploadDB = async (e) => {
    // e.preventDefault;
  }








  return (
    <div className="">
      <div className="d-flex">




        <div className="content w-100">





          <div className="p-4">

            <div className="card border-secondary text-dark rounded-4 p-2 shadow">

              <div className="card-body">
                <div className="mb-2">

                  <div className="mb-1 d-flex justify-content-between">
                    <h4>Publish New Movie</h4>

                    <div className="spinner-grow spinner-grow-sm text-danger" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>

                  </div>

                  <small className="text-info">Fill all required fields before uploading</small>
                </div>

                <form className="row g-4" onSubmit={(event) => uploadDB(event)}>

                  <div id="error" className="col-12"></div>


                  <div className="col-md-6">

                    <label className="form-label">Movie File<span className="text-danger">*</span></label>
                    <input id="movie" type="file" className="form-control" required accept="video/*"
                      onChange={(e) => uploadMovie(e.target.files[0])} />

                    <div className="row mt-2 g-2">
                      <div className="col-md-7" id="uploading">


                        {uploadingMovieFile && (
                          <div className="alert alert-info">

                            <div className="d-flex justify-content-between mb-2">
                              <span>Uploading Movie...</span>
                              <strong>{uploadProgress}%</strong>
                            </div>

                            <div className="progress" style={{ height: "22px" }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                style={{
                                  width: `${uploadProgress}%`
                                }}
                              >
                                {uploadProgress}%
                              </div>
                            </div>

                          </div>
                        )}
                        {/* success */}

                        {uploadingMovieFileSuccess.success === true &&
                          <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <i className="bi bi-check-circle"></i> Movie Uploaded Successfully.
                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                          </div>}

                        {/* error */}
                        {uploadingMovieFileSuccess.success === false &&
                          <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <i className="bi bi-x-circle text-danger"></i>{uploadingMovieFileSuccess.message}
                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                          </div>}



                      </div>

                      <div className="col-md-5 preview-box" id="previewMovie">

                        {movieUrl && (
                          <div className="card bg-dark text-light p-2 small">
                            <p className="mb-1"><strong>Name:</strong>{movieName}</p>
                            <p className="mb-1"><strong>Size:</strong> {movieSize} MB</p>


                            <div style={{ width: "100%", border: "2px solid red" }}>
                              <video
                                key={movieUrl}
                                src={movieUrl}
                                controls
                                autoPlay
                                style={{
                                  width: "100%",
                                  display: "block",
                                  backgroundColor: "black",
                                  objectFit: "contain"
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    <label className="form-label mt-3">Thumbnail<span className="text-danger">*</span></label>
                    <input id="thumbnail" type="file" className="form-control" required accept="image/*"
                      onChange={(e) => uploadThumbnail(e.target.files[0])} />

                    <div className="row mt-2 g-2">
                      <div className="col-md-7" id="uploadingThumbnail">



                        {uploadingThumbnail === true && (
                          <div className="alert alert-info">
                            <div className="spinner-border spinner-border-sm me-1" role="status">
                              <span className="visually-hidden small">Loading...</span>
                            </div>
                            Uploading Thumbnail...
                          </div>

                        )}


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
                      <div className="col-md-5 preview-box" id="previewThumbnail">

                        {thumbnailUrl &&
                          (<img src={thumbnailUrl} className="img-fluid rounded shadow" style={{
                            maxHeight: 200,
                            width: "100%",
                            // height: "300px",
                            background: "black",
                            objectFit: "cover"
                          }} />
                          )}
                      </div>
                    </div>

                    <label className="form-label mt-3">Title<span className="text-danger">*</span></label>
                    <input id="title" type="text" className="form-control" placeholder="Movie title" />

                    <label className="form-label mt-3">Category</label>
                    <select id="category" className="form-select">
                      <option value={null} selected={true} disabled>Select</option>
                      {
                        genres?.map((genre) => (
                          <option value={genre.id} key={genre.id}>{genre.name}</option>
                        ))
                      }
                    </select>

                    <div className="text-end">
                      <button type="button" className="btn btn-sm small text-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#newGenre">
                        + Add New
                      </button>
                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label">Translator<span className="text-danger">*</span></label>
                    <select id="translator" className="form-select">
                      <option selected={true} disabled value={null}>Select</option>
                      {
                        translators?.map((trans) => (
                          <option value={trans.id} key={trans.id}>{trans.name}</option>
                        ))
                      }

                    </select>

                    <label className="form-label mt-3">Year<span className="text-danger">*</span></label>
                    <input id="year" type="number" className="form-control" placeholder="Ex: 2026" />

                    <label className="form-label mt-3">Country<span className="text-danger">*</span></label>
                    <input id="country" type="text" className="form-control" placeholder="Country" />

                    <label className="form-label mt-3">Language<span className="text-danger">*</span></label>
                    <input id="language" type="text" className="form-control" placeholder="Ex: English" />

                    <label className="form-label mt-3">Serie<span className="text-danger">*</span></label>
                    <select id="seriesSelecion" className="form-select">
                      <option value="null">Not Series</option>
                      {
                        series?.map((serie) => (
                          <option value={serie.id} key={serie.id}>{serie.title}</option>
                        ))
                      }
                    </select>


                    <div className="text-end">
                      <button type="button" className="btn btn-sm small text-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#newSerie">
                        + Add New
                      </button>
                    </div>

                    <label className="form-label mt-3">Description<span className="text-danger">*</span></label>
                    <textarea id="description" className="form-control" rows="4"
                      placeholder="Enter Movie Description"></textarea>

                  </div>



                  <div className="col-12 mt-4">
                    <button id="submitMovie" className="btn btn-primary w-100 py-2 fw-bold" type="submit" disabled={uploadingMovieFile || uploadingThumbnail}>
                      <i className="bi bi-cloud-upload me-2"></i>UPLOAD MOVIE
                    </button>
                  </div>

                </form>
              </div>
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




      {/* -----NEW SERIE ----- */}
      <div className="modal fade bg-dark" id="newSerie" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="newSerieLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-secondary text-light">

            <div className="p-3">

              <div className="d-flex justify-content-between">
                <h1 className="modal-title fs-5" id="newSerieLabel">New Serie</h1>
                <button type="button" className="btn-close text-danger" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <form action="" className="mt-3 form">
                <div className="modal-body">

                  <label htmlFor="serieTitle">Title:</label>
                  <input type="text" className="form-control" id="serieTitle" required placeholder="Serie Title" />

                  <label htmlFor="serieTrans" className="mt-2">Translator:</label>
                  <select name="translator" id="serieTrans" className="form-select" required placeholder="Translator">
                    <option value={null} selected={true} disabled>Select</option>
                    {
                      translators?.map((item) => (
                        <option value={item.id} key={item.id}>{item.name}</option>
                      ))
                    }
                  </select>

                  <label htmlFor="serieGenre" className="mt-2">Genre:</label>
                  <select name="genre" id="serieGenre" className="form-select" required>
                    <option value={null} selected={true} disabled>Select</option>
                    {
                      genres?.map((item) => (
                        <option value={item.id} key={item.id}>{item.name}</option>
                      ))
                    }
                  </select>

                </div>
                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-warning btn-sm m-1" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary btn-sm m-1">Submit</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>

  )
}