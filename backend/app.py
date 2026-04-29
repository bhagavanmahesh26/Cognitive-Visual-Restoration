import os
import sys
import time
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.utils import secure_filename
from datetime import timedelta

# ── Resolve absolute paths for frontend assets ───────────────────────────────
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))   # .../backend
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')

# ── Add new backend colorizers to the Python path ──────────────────────────
NEW_BACKEND_PATH = os.path.join(os.path.dirname(__file__), 'BackEnd', 'colorization-master')
if NEW_BACKEND_PATH not in sys.path:
    sys.path.insert(0, NEW_BACKEND_PATH)

import torch
import matplotlib
matplotlib.use('Agg')   # Non-interactive backend (no GUI required)
import matplotlib.pyplot as plt
from colorizers import eccv16, siggraph17, load_img, preprocess_img, postprocess_tens

app = Flask(
    __name__,
    template_folder=os.path.join(FRONTEND_DIR, 'templates'),
    static_folder=os.path.join(FRONTEND_DIR, 'static'),
)
app.secret_key = 'your-secret-key-change-in-production'
app.config['UPLOAD_FOLDER']    = os.path.join(FRONTEND_DIR, 'static', 'uploads')
app.config['COLORIZED_FOLDER'] = os.path.join(FRONTEND_DIR, 'static', 'colorized')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

# ── Load colorization models once at startup ────────────────────────────────
print("Loading AI colorization models… please wait.")
use_gpu = torch.cuda.is_available()
try:
    colorizer_eccv16     = eccv16(pretrained=True).eval()
    colorizer_siggraph17 = siggraph17(pretrained=True).eval()
    if use_gpu:
        colorizer_eccv16.cuda()
        colorizer_siggraph17.cuda()
        print("GPU enabled.")
    else:
        print("Running on CPU.")
    MODELS_LOADED = True
    print("Models loaded successfully.")
except Exception as e:
    MODELS_LOADED = False
    print(f"Warning: Could not load colorization models: {e}")

# ── Demo credentials (replace with DB in production) ──────────────────────
USERS = {
    'admin': 'admin123',
    'user':  'user123',
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ── Routes ─────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('home'))
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username in USERS and USERS[username] == password:
            session.permanent = True
            session['username'] = username
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid username or password', 'error')
    return render_template('login.html')


@app.route('/home', methods=['GET', 'POST'])
def home():
    if 'username' not in session:
        return redirect(url_for('login'))

    uploaded_image = None
    if request.method == 'POST':
        if 'image' not in request.files:
            flash('No file selected', 'error')
        else:
            file = request.files['image']
            if file.filename == '':
                flash('No file selected', 'error')
            elif file and allowed_file(file.filename):
                filename = f"{int(time.time())}_{secure_filename(file.filename)}"
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                uploaded_image = filename
                flash('Image uploaded successfully!', 'success')
            else:
                flash('Invalid file type. Please upload an image.', 'error')

    return render_template('home.html', uploaded_image=uploaded_image)


@app.route('/scope')
def scope():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('scope.html')


@app.route('/team')
def team():
    if 'username' not in session:
        return redirect(url_for('login'))

    team_members = [
        {
            'name': 'Thotakura Manikantha Varma',
            'role': 'Team Leader & System Architect',
            'description': 'Overseeing the entire project lifecycle — defining system architecture, coordinating team efforts, and ensuring technical decisions align with project goals.',
            'expertise': 'System Design, Project Management, Architecture Planning'
        },
        {
            'name': 'Medisetti Bhagavan Mahesh',
            'role': 'ML Engineer',
            'description': 'Designing, training, and fine-tuning deep learning models for automatic image colorization using state-of-the-art neural network architectures.',
            'expertise': 'PyTorch, CNNs, GANs, Model Training & Optimization'
        },
        {
            'name': 'Vedurupaka Alokya',
            'role': 'Backend Developer',
            'description': 'Building robust server-side logic, REST APIs, and data pipelines that power the colorization engine and handle image processing workflows.',
            'expertise': 'Flask, Python, REST APIs, Database Management'
        },
        {
            'name': 'Doddi Sai Charan',
            'role': 'Frontend Developer',
            'description': 'Crafting intuitive and visually engaging user interfaces to ensure a seamless and delightful experience when interacting with the AI colorization engine.',
            'expertise': 'HTML, CSS, JavaScript, Responsive Design'
        },
        {
            'name': 'Immidi Aparna',
            'role': 'Quality Assurance Engineer',
            'description': 'Ensuring the reliability and quality of the application through systematic testing, bug tracking, and validation of all features before release.',
            'expertise': 'Test Planning, Manual & Automated Testing, Bug Reporting'
        },
    ]
    return render_template('team.html', team_members=team_members)


@app.route('/about')
def about():
    if 'username' not in session:
        return redirect(url_for('login'))

    project_info = {
        'title': 'Cognitive Visual Restoration Engine for Chromatic Enhancement of Monochrome Imagery',
        'description': (
            'An advanced deep learning system that intelligently restores color to black-and-white images '
            'using state-of-the-art neural networks. Our cutting-edge AI model leverages the power of '
            'generative adversarial networks and convolutional neural networks to analyze grayscale images '
            'and predict realistic, contextually appropriate colors with unprecedented accuracy.'
        ),
        'tech_stack': [
            {'name': 'Flask',      'version': '3.0.0',  'category': 'Web Framework',        'logo': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg'},
            {'name': 'PyTorch',    'version': '2.x',    'category': 'Neural Networks',       'logo': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg'},
            {'name': 'NumPy',      'version': '1.26.x', 'category': 'Numerical Computing',   'logo': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg'},
            {'name': 'Python',     'version': '3.11',   'category': 'Programming Language',  'logo': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'},
            {'name': 'HTML5',      'version': '',       'category': 'Frontend',              'logo': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'},
            {'name': 'CSS3',       'version': '',       'category': 'Frontend',              'logo': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg'},
            {'name': 'JavaScript', 'version': '',       'category': 'Frontend',              'logo': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'},
        ],
        'models': [
            {'name': 'SIGGRAPH 17 (Zhang et al.)',         'description': 'User-guided colorization model that produces vibrant, plausible colors using a classification loss over quantized ab values.', 'icon': '🎨'},
            {'name': 'ECCV 16 (Zhang et al.)',             'description': 'Fully automatic colorization model trained on over a million ImageNet photographs; the original deep learning colorizer.', 'icon': '🧠'},
            {'name': 'Convolutional Neural Networks (CNNs)', 'description': 'Deep learning models specialized in extracting spatial features and patterns from images for accurate color prediction.', 'icon': '🔗'},
        ],
        'objectives': [
            {'title': 'AI-Powered Automatic Colorization',   'description': 'Develop an intelligent system that automatically colorizes black-and-white images without manual intervention.', 'icon': '🤖'},
            {'title': 'Accurate Color Prediction',           'description': 'Achieve realistic and natural color restoration using PyTorch deep learning models.',                            'icon': '🎯'},
            {'title': 'User-Friendly Interface',             'description': 'Create an intuitive web interface with drag-and-drop upload functionality and instant colorized output.',          'icon': '💻'},
            {'title': 'Fast Processing',                     'description': 'Optimize model inference to deliver colorized results within seconds on standard hardware.',                      'icon': '⚡'},
            {'title': 'Deep Learning Integration',           'description': 'Integrate trained eccv16 and siggraph17 models into a Flask web application for end-to-end colorization.',       'icon': '🧠'},
        ],
    }
    return render_template('about.html', project=project_info)


@app.route('/colorize', methods=['POST'])
def colorize():
    """Colorize an uploaded image using the new PyTorch-based models."""
    if 'username' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    if not MODELS_LOADED:
        return jsonify({'error': 'Colorization models are not loaded. Check server logs.'}), 500

    try:
        data = request.get_json()
        if not data or 'filename' not in data:
            return jsonify({'error': 'No filename provided'}), 400

        filename   = data['filename']
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if not os.path.exists(input_path):
            return jsonify({'error': 'Uploaded image not found on server'}), 404

        # Prepare output path
        name, ext = os.path.splitext(filename)
        output_filename = f"{name}_colorized.png"
        os.makedirs(app.config['COLORIZED_FOLDER'], exist_ok=True)
        output_path = os.path.join(app.config['COLORIZED_FOLDER'], output_filename)

        # ── Run colorization ──────────────────────────────────────
        img = load_img(input_path)
        (tens_l_orig, tens_l_rs) = preprocess_img(img, HW=(256, 256))

        if use_gpu:
            tens_l_rs = tens_l_rs.cuda()

        # Use SIGGRAPH17 (higher quality / more vibrant colors)
        with torch.no_grad():
            out_ab = colorizer_siggraph17(tens_l_rs).cpu()

        out_img = postprocess_tens(tens_l_orig, out_ab)
        plt.imsave(output_path, out_img)

        return jsonify({
            'success': True,
            'colorized_image': f"colorized/{output_filename}"
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/reset', methods=['POST'])
def reset():
    """Clear session image references."""
    if 'username' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    session.pop('uploaded_image', None)
    session.pop('colorized_image', None)
    return jsonify({'success': True})


@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))


if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'],    exist_ok=True)
    os.makedirs(app.config['COLORIZED_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5000)

