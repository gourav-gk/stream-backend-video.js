
# Stream

## Getting Started

### Clone the Repository
```bash
git clone <repository-url>
```

### Running the Server

1. Open your terminal.
2. Navigate to the root directory of the project.
3. Run the following command to start the server:
```bash
node index.js
```
The server will run on `http://localhost:8000`.

### Running the Frontend

1. In the terminal, navigate to the frontend directory:
```bash
cd frontend
```
2. Install the necessary dependencies and start the development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Uploading a Video

To upload a video:

1. Open Postman.
2. Set the request method to \`POST\`.
3. Use the following URL:
```
http://localhost:8000
```
4. In the form-data section, add a key for the video and select the file you want to upload.
5. Send the request. 

You will receive a URL in the response. Copy this URL.

### Embedding the Video

1. Open the `app.jsx` file in your frontend project.
2. Paste the received video URL into the \`videoLink\` variable.

```javascript
const videoLink = '<your-video-url>';
```

3. Save the file and your video should now be embedded in the application.

---

**Note:** Make sure to have Node.js and npm installed on your system before running the above commands.
