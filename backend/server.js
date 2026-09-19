

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const B2 = require("backblaze-b2");
const fs = require("fs");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());

app.use(
    session({
        secret: "irebero-secretyttrtr43435", //process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);



const upload = multer({ dest: "uploads/" });


const B2_KEY_ID = "005ee2294d9b2510000000002";
const B2_APPLICATION_KEY = "K005l9n3UbyCf20QFvNfsWPUIrOlJQs";
const B2_BUCKET_ID = "3eee023279247d299be20511";



const b2 = new B2({
    applicationKeyId: B2_KEY_ID, // process.env.B2_KEY_ID,
    applicationKey: B2_APPLICATION_KEY, // process.env.B2_APPLICATION_KEY,
});

// Store upload progress
const uploadProgress = new Map();


// ===============================
// PROGRESS STREAM
// ===============================

app.get("/upload-progress/:uploadId", (req, res) => {

    const { uploadId } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    // Send current progress immediately
    const current = uploadProgress.get(uploadId);

    if (current) {
        res.write(`data: ${JSON.stringify(current)}\n\n`);
    }

    const interval = setInterval(() => {

        const progress = uploadProgress.get(uploadId);

        if (progress) {
            res.write(`data: ${JSON.stringify(progress)}\n\n`);

            if (progress.status === "completed" || progress.status === "error") {
                clearInterval(interval);
                res.end();
            }
        }

    }, 300);

    req.on("close", () => {
        clearInterval(interval);
    });
});


// ===============================
// UPLOAD
// ===============================

app.post("/upload", upload.single("file"), async (req, res) => {

    const uploadId = req.headers["x-upload-id"];

    try {

        if (!uploadId) {
            return res.status(400).json({
                success: false,
                error: "Upload ID is required"
            });
        }

        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                error: "No file received"
            });
        }

        uploadProgress.set(uploadId, {
            status: "processing",
            progress: 50
        });


        // ===============================
        // AUTHORIZE B2
        // ===============================

        await b2.authorize();


        // ===============================
        // GET B2 UPLOAD URL
        // ===============================

        const bucketId = B2_BUCKET_ID; // process.env.B2_BUCKET_ID;

        const uploadUrlResponse = await b2.getUploadUrl({
            bucketId
        });

        const uploadUrl = uploadUrlResponse.data.uploadUrl;
        const uploadAuthToken =
            uploadUrlResponse.data.authorizationToken;


        // ===============================
        // READ FILE
        // ===============================

        const filePath = file.path;
        const fileName = file.originalname;

        const fileBuffer = fs.readFileSync(filePath);


        // ===============================
        // UPLOAD TO B2
        // ===============================

        const uploadResponse = await b2.uploadFile({

            uploadUrl,
            uploadAuthToken,

            fileName,

            data: fileBuffer,

            contentLength: fileBuffer.length,

            mime: file.mimetype,

            onUploadProgress: (event) => {

                if (!event.lengthComputable && !event.total) {
                    return;
                }

                const loaded = event.loaded;
                const total = event.total || fileBuffer.length;

                const b2Percent =
                    Math.round((loaded / total) * 100);

                // B2 = 50% → 100%
                const overallProgress =
                    50 + Math.round(b2Percent / 2);

                uploadProgress.set(uploadId, {
                    status: "uploading",
                    progress: Math.min(overallProgress, 99),
                    b2Progress: b2Percent
                });

            }

        });


        // ===============================
        // CLEAN TEMP FILE
        // ===============================

        fs.unlinkSync(filePath);


        // ===============================
        // COMPLETE
        // ===============================

        uploadProgress.set(uploadId, {
            status: "completed",
            progress: 100,
            b2Progress: 100
        });


        res.json({
            success: true,
            fileId: uploadResponse.data.fileId,
            fileName: fileName
        });


        // Remove progress after some time
        setTimeout(() => {
            uploadProgress.delete(uploadId);
        }, 60000);


    } catch (err) {

        console.error(err);

        if (uploadId) {
            uploadProgress.set(uploadId, {
                status: "error",
                progress: 0,
                error: err.message
            });
        }

        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});




// CHECK SESSION
app.get("/check-session", async (req, res) => {

    if (!req.session.user.status) {
        // return res.json({ status: false });
    }

    return res.json({
        status: true,
        user: req.session.user
    });

});


// LOGIN

app.get("/getLogin", async (req, res) => {

    const email = req.query.email;
    const password = req.query.password;

    try {
        const response = await fetch(
            `https://irebero.pensinova.workers.dev/login?email=${email}&password=${password}`
        );

        const result = await response.json();

        if (!result.success) {
            return res.status(401).json({
                status: result.success,
                error: result.message
            });
        }

        req.session.user = {
            status: result.success,
            id: result.user.id,
            email: result.user.email,
            name: result.user.name
        };

        return res.json({
            status: req.session.user.status,
            user: req.session.user
        });

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            status: false,
            error: "Internal server error: " + e.message
        });
    }
});



app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }

        res.clearCookie("connect.sid");
        res.json({ success: true });
    });
});




// ===============================
// SERVER
// ===============================

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});