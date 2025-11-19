import axios from 'axios';
const SPACY_URL = process.env.PY_SPACY_URL;

async function extractEntities(text) {
  if (!text || text.trim().length < 5) {
    return res.status(400).json({
      ok: false,
      error: "Resume text could not be extracted. Upload a clearer file."
    });
  }

  if (!SPACY_URL) throw new Error('PY_SPACY_URL not configured');
  const resp = await axios.post(SPACY_URL, { text }, { timeout: 60000 });
  return resp.data;
}

export default extractEntities;
