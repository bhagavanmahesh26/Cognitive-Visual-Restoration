// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Read saved theme from localStorage (default: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle event
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Image Upload Preview
const imageInput = document.getElementById('image-input');
const uploadArea = document.getElementById('upload-area');
const previewContainer = document.getElementById('preview-container');
const previewImage = document.getElementById('preview-image');

if (imageInput) {
    // File input change - single reliable handler
    imageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });
}

if (imageInput && uploadArea) {
    // Drag and drop on the upload area
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (16MB max)
        if (file.size > 16 * 1024 * 1024) {
            alert('File size must be less than 16MB');
            return;
        }

        // Preview image with neural scan effect
        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewImage) {
                previewImage.src = e.target.result;
                if (previewContainer) {
                    // Hide upload area
                    if (uploadArea) {
                        uploadArea.style.display = 'none';
                    }

                    // Hide the server-rendered "Process Image" block if present
                    const uploadSuccessBlock = document.getElementById('upload-success-block');
                    if (uploadSuccessBlock) {
                        uploadSuccessBlock.style.display = 'none';
                    }

                    // Also hide any existing colorized result
                    const colorizedContainer = document.getElementById('colorized-container');
                    if (colorizedContainer) {
                        colorizedContainer.style.display = 'none';
                    }

                    // Show preview container with Enhance Image button
                    previewContainer.style.display = 'block';

                    // Add neural scan effect
                    previewContainer.classList.add('neural-scan');

                    // Add chromatic bloom animation
                    previewImage.classList.add('chromatic-bloom');

                    // Remove neural scan after animation completes
                    setTimeout(() => {
                        previewContainer.classList.remove('neural-scan');
                    }, 2000);
                }
            }
        };
        reader.readAsDataURL(file);

    }
}

// Form Validation
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            e.preventDefault();
            alert('Please fill in all fields');
        }
    });
}

// Auto-hide flash messages
const flashMessages = document.querySelectorAll('.alert');
flashMessages.forEach(message => {
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 5000);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link
const currentPath = window.location.pathname;
const navLinksElements = document.querySelectorAll('.nav-links a');
navLinksElements.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Upload form reference (submit is handled by the async handler below)
const uploadForm = document.getElementById('upload-form');

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe glass cards
document.querySelectorAll('.glass-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ========== SCIENTIFIC MODERN ENHANCEMENTS ==========

// Text Scramble Effect
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect to main headings
const scrambleElements = document.querySelectorAll('.hero h1');
scrambleElements.forEach(el => {
    const fx = new TextScramble(el);
    const originalText = el.textContent;

    // Start with scrambled text
    setTimeout(() => {
        fx.setText(originalText);
    }, 500);
});

// Magnetic Button Effect
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 100;

        if (distance < maxDistance) {
            const strength = (maxDistance - distance) / maxDistance;
            const moveX = x * strength * 0.3;
            const moveY = y * strength * 0.3;

            button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        }
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

// Processing Log Simulation
function simulateProcessingLog(container) {
    const logs = [
        'Initializing ResNet-101...',
        'Loading model weights...',
        'Extracting luminance features...',
        'Analyzing semantic content...',
        'Predicting chrominance values...',
        'Applying color mapping...',
        'Enhancing saturation...',
        'Finalizing chroma mapping...',
        'Processing complete!'
    ];

    let index = 0;
    const interval = setInterval(() => {
        if (index < logs.length) {
            const logLine = document.createElement('div');
            logLine.className = 'log-line';
            logLine.textContent = logs[index];
            logLine.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(logLine);

            // Auto-scroll to bottom
            container.scrollTop = container.scrollHeight;
            index++;
        } else {
            clearInterval(interval);

            // Add success flash
            document.body.classList.add('success-flash');
            setTimeout(() => {
                document.body.classList.remove('success-flash');
            }, 500);
        }
    }, 300);
}

// Apply gradient shimmer to headings
document.querySelectorAll('.hero h1').forEach(heading => {
    heading.classList.add('gradient-shimmer');
});

// HUD Corners for image containers
document.querySelectorAll('.image-preview').forEach(container => {
    if (!container.classList.contains('hud-container')) {
        container.classList.add('hud-container');

        // Add bottom corners
        const bottomLeft = document.createElement('div');
        bottomLeft.className = 'hud-bottom-left';
        container.appendChild(bottomLeft);

        const bottomRight = document.createElement('div');
        bottomRight.className = 'hud-bottom-right';
        container.appendChild(bottomRight);
    }
});

// Add tech labels to form labels
document.querySelectorAll('.form-group label').forEach(label => {
    label.classList.add('tech-label');
});

// ========== HOME PAGE REDESIGN FUNCTIONALITY ==========

// Before/After Comparison Slider with Enhanced Smoothing
const comparisonHandle = document.getElementById('comparisonHandle');
const afterWrapper = document.getElementById('afterWrapper');
const comparisonSlider = document.querySelector('.comparison-slider');

if (comparisonHandle && afterWrapper && comparisonSlider) {
    let isDragging = false;
    let currentPosition = 50; // Start at 50%

    function updateSliderPosition(clientX, smooth = false) {
        const rect = comparisonSlider.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

        // Apply smooth easing when not dragging
        if (smooth && !isDragging) {
            const ease = 0.1;
            currentPosition += (percentage - currentPosition) * ease;
        } else {
            currentPosition = percentage;
        }

        afterWrapper.style.width = `${currentPosition}%`;
        comparisonHandle.style.left = `${currentPosition}%`;
    }

    // Mouse events
    comparisonHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        afterWrapper.style.transition = 'none';
        comparisonHandle.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateSliderPosition(e.clientX);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            afterWrapper.style.transition = 'width 0.05s ease';
            comparisonHandle.style.transition = 'left 0.05s ease';
        }
    });

    // Touch events for mobile
    comparisonHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        afterWrapper.style.transition = 'none';
        comparisonHandle.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length > 0) {
            updateSliderPosition(e.touches[0].clientX);
        }
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            afterWrapper.style.transition = 'width 0.05s ease';
            comparisonHandle.style.transition = 'left 0.05s ease';
        }
    });

    // Click anywhere on slider to move handle with smooth animation
    comparisonSlider.addEventListener('click', (e) => {
        if (e.target !== comparisonHandle && !isDragging) {
            afterWrapper.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            comparisonHandle.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            updateSliderPosition(e.clientX, true);

            // Reset transition after animation
            setTimeout(() => {
                afterWrapper.style.transition = 'width 0.05s ease';
                comparisonHandle.style.transition = 'left 0.05s ease';
            }, 300);
        }
    });
}

// Browse Button Handler
const browseBtn = document.getElementById('browseBtn');

if (browseBtn && imageInput) {
    browseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Reset value so 'change' event fires even if same file is picked again
        imageInput.value = '';
        imageInput.click();
    });
}

// RESET Button Handler
const resetBtn = document.getElementById('resetBtn');

// Shared reset logic (used by both resetBtn and Try Another Image)
function performReset() {
    fetch('/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear the file input
                if (imageInput) imageInput.value = '';

                // Hide the preview container
                if (previewContainer) previewContainer.style.display = 'none';

                // Clear the preview image
                if (previewImage) previewImage.src = '';

                // Hide colorized result if visible
                const colorizedContainer = document.getElementById('colorized-container');
                if (colorizedContainer) colorizedContainer.style.display = 'none';

                // Show the upload area again
                if (uploadArea) uploadArea.style.display = 'flex';

                // Scroll the upload card into view with offset for sticky nav
                const uploadCard = document.querySelector('.upload-card-v2');
                if (uploadCard) {
                    const navHeight = document.querySelector('nav')?.offsetHeight || 70;
                    const cardTop = uploadCard.getBoundingClientRect().top + window.scrollY - navHeight - 24;
                    window.scrollTo({ top: cardTop, behavior: 'smooth' });
                }
            }
        })
        .catch(error => console.error('Reset error:', error));
}

if (resetBtn && imageInput && previewContainer && uploadArea) {
    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Spin animation
        resetBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => { resetBtn.style.transform = ''; }, 300);
        performReset();
    });
}

// ========== COLORIZATION FUNCTIONALITY ==========

// Handle form submission for upload and colorization
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(uploadForm);
        const submitBtn = uploadForm.querySelector('.btn-enhance');

        if (!imageInput.files || imageInput.files.length === 0) {
            alert('Please select an image first');
            return;
        }

        // Show loading state
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <svg class="spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
            </svg>
            Processing...
        `;
        submitBtn.disabled = true;

        try {
            // First, upload the image
            const uploadResponse = await fetch('/home', {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            // Get the response HTML and extract filename
            const uploadHtml = await uploadResponse.text();

            // Extract filename from the HTML response
            // Look for pattern: uploads/FILENAME
            const match = uploadHtml.match(/uploads\/([^"']+\.(jpg|jpeg|png|gif|bmp))/i);

            if (!match || !match[1]) {
                throw new Error('Could not extract uploaded filename');
            }

            const filename = match[1];
            const originalImageUrl = `/static/uploads/${filename}`;

            // Now colorize the image
            const colorizeResponse = await fetch('/colorize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename: filename })
            });

            const colorizeData = await colorizeResponse.json();

            if (colorizeData.success) {
                // Display the colorized image
                displayColorizedResult(originalImageUrl, `/static/${colorizeData.colorized_image}`);
            } else {
                throw new Error(colorizeData.error || 'Colorization failed');
            }

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred during processing');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        }
    });
}

function displayColorizedResult(originalSrc, colorizedSrc) {
    // Hide upload area and preview
    if (uploadArea) uploadArea.style.display = 'none';
    if (previewContainer) previewContainer.style.display = 'none';

    // Create or update colorized result container
    let colorizedContainer = document.getElementById('colorized-container');

    if (!colorizedContainer) {
        colorizedContainer = document.createElement('div');
        colorizedContainer.id = 'colorized-container';
        colorizedContainer.className = 'colorized-result';
        uploadForm.appendChild(colorizedContainer);
    }

    colorizedContainer.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 2rem; color: var(--text-primary);">
            ✨ Colorization Complete!
        </h3>
        <div class="result-comparison">
            <div class="result-image-container">
                <img src="${originalSrc}" alt="Original Image" class="result-image">
                <p class="result-label">Original</p>
            </div>
            <div class="result-arrow">→</div>
            <div class="result-image-container">
                <img src="${colorizedSrc}" alt="Colorized Image" class="result-image">
                <p class="result-label">Colorized</p>
            </div>
        </div>
        <div class="result-actions">
            <a href="${colorizedSrc}" download class="btn-download">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Colorized Image
            </a>
            <button type="button" class="btn-reset" onclick="performReset()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                Try Another Image
            </button>
        </div>
    `;

    colorizedContainer.style.display = 'block';

    // Add fade-in animation
    colorizedContainer.style.opacity = '0';
    setTimeout(() => {
        colorizedContainer.style.opacity = '1';
        colorizedContainer.style.transition = 'opacity 0.5s ease';
    }, 100);
}

// Add spinner animation styles
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
    .spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .colorized-result {
        margin-top: 2rem;
        padding: 2rem;
        background: var(--glass-bg);
        border-radius: 16px;
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
    }
    
    .result-comparison {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .result-image-container {
        text-align: center;
        flex: 1;
        min-width: 200px;
        max-width: 400px;
    }
    
    .result-image {
        width: 100%;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        margin-bottom: 0.5rem;
    }
    
    .result-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0.5rem 0 0 0;
    }
    
    .result-arrow {
        font-size: 2rem;
        color: var(--accent-purple);
        font-weight: bold;
    }
    
    .result-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .btn-download {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        background: linear-gradient(135deg, #a855f7, #ec4899) !important;
        color: #ffffff !important;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
    }
    
    .btn-download:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(168, 85, 247, 0.5) !important;
    }
    
    @media (max-width: 768px) {
        .result-comparison {
            flex-direction: column;
        }
        
        .result-arrow {
            transform: rotate(90deg);
        }
    }
`;
document.head.appendChild(spinnerStyle);
