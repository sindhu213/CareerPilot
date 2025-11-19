# python-extractor/app.py
from flask import Flask, request, jsonify
import tempfile, os
import shutil

app = Flask(__name__)

def extract_text_pymupdf(path):
    try:
        import fitz
        doc = fitz.open(path)
        pages = []
        for p in doc:
            pages.append(p.get_text())
        return "\n".join(pages).strip()
    except Exception as e:
        raise

def extract_text_pdfminer(path):
    try:
        from pdfminer.high_level import extract_text
        return extract_text(path)
    except Exception as e:
        raise

def extract_text_docx(path):
    try:
        import docx
        doc = docx.Document(path)
        return "\n".join([p.text for p in doc.paragraphs])
    except Exception:
        return ""

@app.route('/extract', methods=['POST'])
def extract():
    if 'file' not in request.files:
        return jsonify({'text': ''})
    f = request.files['file']
    if f.filename == '':
        return jsonify({'text': ''})
    tmpdir = tempfile.mkdtemp()
    try:
        p = os.path.join(tmpdir, f.filename)
        f.save(p)
        ext = os.path.splitext(p)[1].lower()
        text = ""
        if ext == '.pdf':
            try:
                text = extract_text_pymupdf(p)
            except Exception:
                text = extract_text_pdfminer(p)
        elif ext in ['.docx', '.doc']:
            text = extract_text_docx(p)
        elif ext == '.txt':
            with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                text = fh.read()
        else:
            text = ''
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        try:
            shutil.rmtree(tmpdir)
        except Exception:
            pass

# a noop endpoint if Node wants to call extractor without file (fallback)
@app.route('/noop', methods=['POST'])
def noop():
    # the backend may prefer the local sample path to be passed to Gemini instead
    return jsonify({'text': ''})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)
