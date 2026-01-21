const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// This gives the "keeper" something lightweight to ping
app.get('/health', (req, res) => {
  res.status(200).send('Server is awake');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/chat', require('./routes/chat'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Only runs if the 'RENDER_EXTERNAL_URL' environment variable exists (which Render provides automatically)
const backendUrl = process.env.RENDER_EXTERNAL_URL;

if (backendUrl) {
  const reloadWebsite = () => {
    https.get(`${backendUrl}/health`, (res) => {
      // We don't need to do anything with the response
      // console.log('Keep-alive ping sent.'); 
    }).on('error', (e) => {
      console.error(`Keep-alive error: ${e.message}`);
    });
  };

  // Run every 13 minutes (13 * 60 * 1000 milliseconds)
  setInterval(reloadWebsite, 13 * 60 * 1000);
  
  console.log(`Keep-alive interval set for: ${backendUrl}`);
} else {
  console.log('Not on Render (or RENDER_EXTERNAL_URL missing), skipping keep-alive.');
}