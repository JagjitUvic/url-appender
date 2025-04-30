const express = require('express');
const { URL } = require('url');
const { insertLink } = require('../db'); // Make sure this points to your DB logic
const router = express.Router();

/**
 * POST /append-parameters
 * Appends query parameters to a given URL while preserving existing ones.
 * Also saves the original and final URL to the database.
 */
router.post('/', async (req, res) => {
  const { url, parameters } = req.body;

  // Validate the URL is a string
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing URL.' });
  }

  // Validate that parameters is a plain object
  if (!parameters || typeof parameters !== 'object' || Array.isArray(parameters)) {
    return res.status(400).json({ error: 'Invalid parameters format. Expected a key-value object.' });
  }

  try {
    // Use Node.js URL parser to safely manipulate query parameters
    const originalUrl = new URL(url);

    // Append or overwrite query parameters safely
    Object.entries(parameters).forEach(([key, value]) => {
      originalUrl.searchParams.set(key, String(value));
    });

    const finalUrl = originalUrl.toString();

      // Use the helper function to insert
      await insertLink({ original_url: url, parameters, final_url: finalUrl });

    // Respond with the original and updated URLs
    return res.json({
      original_url: url,
      parameters,
      final_url: finalUrl
    });

  } catch (error) {
    console.error('Error appending parameters:', error);
    return res.status(500).json({ error: 'Failed to append parameters to URL.' });
  }
});

module.exports = router;