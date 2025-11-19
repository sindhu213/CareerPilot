import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const EXTRACTOR_URL = process.env.PY_EXTRACTOR_URL;

export async function sendFileToExtractor(filePath) {
  if (!EXTRACTOR_URL) throw new Error("PY_EXTRACTOR_URL not configured");

  if (!filePath || !fs.existsSync(filePath)) {
    try {
      const r = await axios.post(EXTRACTOR_URL + "/noop", {});
      return r.data;
    } catch (err) {
      console.warn("Extractor noop failed:", err?.message || err);
      return { text: "" };
    }
  }

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const headers = form.getHeaders();

  const resp = await axios.post(EXTRACTOR_URL, form, {
    headers,
    timeout: 60000,
  });

  return resp.data; 
}
