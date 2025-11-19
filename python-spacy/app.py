# python-spacy/app.py
from flask import Flask, request, jsonify
import re

app = Flask(__name__)

# Minimal skill keywords list for demo — expand this in production
SIMPLE_SKILLS = [
    'react','javascript','typescript','node','node.js','express','mongodb','sql','docker','aws','ci/cd','jest','testing','python','flask','django','git','rest','rest api'
]

EDUCATION_PATTERNS = [
    r'(Bachelor|B\.Sc|B\.Tech|BE|Bachelor of Technology|Bachelor of Engineering).+',
    r'(Master|M\.Sc|M\.Tech|MS|MEng|Master of Science).+',
    r'(\d{4}).*(Graduat|Degree|Bachelor|Master)'
]

def extract_skills(text):
    t = text.lower()
    found = []
    for s in SIMPLE_SKILLS:
        if s in t and s not in found:
            found.append(s.title() if s.lower() != 'node.js' else 'Node.js')
    return found

def extract_education(text):
    out = []
    for pat in EDUCATION_PATTERNS:
        matches = re.findall(pat, text, flags=re.IGNORECASE)
        for m in matches:
            out.append(' '.join(m) if isinstance(m, tuple) else m)
    return list(set(out))

def extract_experience(text):
    # crude: capture lines containing company names? We'll extract sentences containing 'years' or 'experience'
    lines = re.split(r'\n+', text)
    ex = []
    for ln in lines:
        if re.search(r'\b(years|yrs|experience|worked|intern)\b', ln, re.IGNORECASE):
            ex.append(ln.strip())
    return ex[:10]

@app.route('/extract_entities', methods=['POST'])
def extract_entities():
    data = request.json
    text = data.get('text','') if data else ''
    skills = extract_skills(text)
    education = extract_education(text)
    experience = extract_experience(text)
    sections = {}  # could return segmented sections in future
    return jsonify({'skills': skills, 'education': education, 'experience': experience, 'sections': sections})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6002, debug=True)
