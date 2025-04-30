const express = require('express');
const bodyParser = require('body-parser'); // Middleware to parse JSON
const cors = require('cors'); // Allow requests from frontend

// Route handlers
const appendParameters = require('./routes/appendParameters');
const getLinks = require('./routes/getLinks');

const app = express();
const PORT = 3001; // Server port

// Enable Cross-Origin Resource Sharing (frontend <> backend communication)
app.use(cors());
// Parse incoming JSON requests
app.use(bodyParser.json());

// Attach routes
app.use('/append-parameters', appendParameters);
app.use('/links', getLinks);

// Start listening for requests
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});