const express = require('express');
const { getAllLinks } = require('../db'); // Import the helper
const router = express.Router();

// GET /links
// Fetch all saved URL records from the database
router.get('/', async (req, res) => {
  try {
    const links = await getAllLinks(); // Use the async helper
    res.json({ links });
  } catch (err) {
    console.error('Error fetching links:', err);
    res.status(500).json({ error: 'Database fetch error.' });
  }
});

module.exports = router;