import os
import json
from  pathlib import Path
from flask import Flask, render_template, request
from werkzeug import secure_filename

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['image']
    result = {}
    if file:
        filename = secure_filename(file.name) + '.png'
        file.save(os.path.join('uploads', filename))
        result.update({"saved": True})
        result.update({"file": filename})
    else:
        result.update({"saved": False})
    return json.dumps(result)

if __name__ == '__main__':
    if not Path('./uploads').exists():
        Path('./uploads/').mkdir()
    app.run()
