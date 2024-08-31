import express from "express"
import cors from "cors"
import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import fs from "fs"
import {exec} from "child_process" // watch out
import { stderr, stdout } from "process"

const app = express()

//multer middleware

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "./uploads")
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
  }
})

// multer configuration
const upload = multer({storage: storage})


app.use(
  cors({
    origin: ["http://localhost:8000", "http://localhost:5173"],
    credentials: true
  })
)

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*") // watch it
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next()
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/uploads", express.static("uploads"))

app.get('/', function(req, res){
  res.json({message: "Hello chai aur code"})
})

app.post("/upload", upload.single('file'), function(req, res){
  const lessonId = uuidv4()
  const videoPath = req.file.path
  const outputPath = `./uploads/courses/${lessonId}`
  const hlsPath = `${outputPath}/index.m3u8`
  console.log("hlsPath", hlsPath)

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, {recursive: true})
  }

  // ffmpeg
  //const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}
  const ffmpegCommand = `ffmpeg -i ${videoPath} \
-map 0:v -map 0:a -filter:v:0 scale=w=1920:h=1080 -b:v:0 5000k -maxrate:v:0 5350k -bufsize:v:0 7500k -preset veryfast -hls_segment_filename "${outputPath}/1080p_%03d.ts" -hls_playlist_type vod -hls_time 10 -start_number 0 ${outputPath}/1080p.m3u8 \
-map 0:v -map 0:a -filter:v:1 scale=w=1280:h=720 -b:v:1 3000k -maxrate:v:1 3210k -bufsize:v:1 4500k -preset veryfast -hls_segment_filename "${outputPath}/720p_%03d.ts" -hls_playlist_type vod -hls_time 10 -start_number 0 ${outputPath}/720p.m3u8 \
-map 0:v -map 0:a -filter:v:2 scale=w=854:h=480 -b:v:2 1500k -maxrate:v:2 1605k -bufsize:v:2 2250k -preset veryfast -hls_segment_filename "${outputPath}/480p_%03d.ts" -hls_playlist_type vod -hls_time 10 -start_number 0 ${outputPath}/480p.m3u8 \
-master_pl_name ${outputPath}/master.m3u8


`;

  // no queue because of POC, not to be used in production
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`)
    }
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
    const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/master.m3u8`;

    res.json({
      message: "Video converted to HLS format",
      videoUrl: videoUrl,
      lessonId: lessonId
    })
  })

})

app.listen(8000, function(){
  console.log("App is listening at port 8000...")
})