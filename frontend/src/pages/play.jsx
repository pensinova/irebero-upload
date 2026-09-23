import { useLocation } from "react-router-dom";
import Header from "../components/header";

const workerUrl = "https://irebero.pensinova.workers.dev/";
const thumbnailBase = "https://pub-4ebd8b355f6048948a58511af22de131.r2.dev/";

const Play = () => {
     const { state } = useLocation();
     const video = state?.video;

     if (!video) {
          return (
               <div className="container">
                    <Header />
                    <div className="alert alert-danger mt-3">
                         Video not found.
                    </div>
               </div>
          );
     }

     return (
          <div className="container">

               <Header />

               <div className="row mt-4">

                    <div className="col-md-9">

                         <div className="ratio ratio-16x9 bg-black rounded overflow-hidden">

                              <video
                                   src={`${workerUrl}${video.video_path}`}
                                   poster={`${thumbnailBase}${video.thumbnail}`}
                                   controls
                                   playsInline
                                   preload="metadata"
                                   className="w-100 h-100"
                              />

                         </div>

                         <div className="mt-3">

                              <h3 className="mb-1">
                                   {video.title}
                              </h3>

                              <div className="text-muted">
                                   {video.genre} &nbsp;•&nbsp; {video.translator}
                              </div>

                         </div>

                    </div>

                    <div className="col-md-3">

                         <div className="card">

                              <div className="card-body">

                                   <h5 className="card-title">
                                        Movie Information
                                   </h5>

                                   <hr />

                                   <p className="mb-2">
                                        <strong>Year:</strong> {video.year || "-"}
                                   </p>

                                   <p className="mb-2">
                                        <strong>Country:</strong> {video.country || "-"}
                                   </p>

                                   <p className="mb-2">
                                        <strong>Language:</strong> {video.language || "-"}
                                   </p>

                                   <p className="mb-2">
                                        <strong>Views:</strong> {video.views || 0}
                                   </p>

                                   <p className="mb-0">
                                        <strong>Downloads:</strong> {video.downloads || 0}
                                   </p>

                              </div>

                         </div>

                    </div>

               </div>

          </div>
     );
};

export default Play;