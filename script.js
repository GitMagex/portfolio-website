// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .skill-category, .about-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Cyberpunk typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            if (text.charAt(i) === '<') {
                // Handle HTML tags
                let tagEnd = text.indexOf('>', i);
                element.innerHTML += text.substring(i, tagEnd + 1);
                i = tagEnd + 1;
            } else {
                element.innerHTML += text.charAt(i);
                i++;
            }
            setTimeout(type, speed);
        } else {
            // Add blinking cursor effect
            element.innerHTML += '<span class="cursor">|</span>';
        }
    }
    
    type();
}

// Matrix-style digital rain effect
function createDigitalRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'digital-rain';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}

// Glitch effect for text
function addGlitchEffect() {
    const glitchElements = document.querySelectorAll('.hero-title, .section-title');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'glitch 0.3s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 300);
        });
    });
}

// Add CSS for glitch effect
const glitchStyles = `
    @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }
    
    .cursor {
        animation: blink 1s infinite;
        color: #00ffff;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;

const glitchStyleSheet = document.createElement('style');
glitchStyleSheet.textContent = glitchStyles;
document.head.appendChild(glitchStyleSheet);

// Initialize cyberpunk effects when page loads
window.addEventListener('load', () => {
    // Create digital rain effect
    createDigitalRain();
    
    // Add glitch effects
    addGlitchEffect();
    
    // Enhanced typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 100);
    }
    
    // Add cyberpunk sound effects (optional)
    // addSoundEffects();
});

// Cyberpunk cursor trail with neon effect
let cursorX = 0;
let cursorY = 0;
let trail = [];

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    // Add current position to trail
    trail.push({ x: cursorX, y: cursorY, life: 30 });
    
    // Limit trail length
    if (trail.length > 20) {
        trail.shift();
    }
});

function drawCyberTrail() {
    // Remove old trail elements
    document.querySelectorAll('.cyber-trail').forEach(el => el.remove());
    
    trail.forEach((point, index) => {
        const trailElement = document.createElement('div');
        trailElement.className = 'cyber-trail';
        trailElement.style.cssText = `
            position: fixed;
            left: ${point.x}px;
            top: ${point.y}px;
            width: ${Math.max(1, index / 2)}px;
            height: ${Math.max(1, index / 2)}px;
            background: #00ffff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${index / trail.length};
            box-shadow: 0 0 ${index}px #00ffff;
        `;
        document.body.appendChild(trailElement);
    });
    
    // Decrease life of trail points
    trail = trail.map(point => ({ ...point, life: point.life - 1 }))
                 .filter(point => point.life > 0);
    
    requestAnimationFrame(drawCyberTrail);
}

// Start cyber trail
drawCyberTrail();

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Skills progress animation
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
}

// Trigger skills animation when skills section is in view
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                skillsObserver.unobserve(entry.target);
            }
        });
    });
    
    skillsObserver.observe(skillsSection);
}

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading screen
function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    const loaderStyles = `
        #loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .loader-content {
            text-align: center;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loaderStyles;
    document.head.appendChild(styleSheet);
    document.body.appendChild(loader);
    
    // Remove loader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                styleSheet.remove();
            }, 300);
        }, 500);
    });
}

// Initialize loader
showLoader();

// Add smooth reveal animation for sections
function revealSection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}

const revealObserver = new IntersectionObserver(revealSection, {
    threshold: 0.15
});

document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-hidden');
    revealObserver.observe(section);
});

// Add CSS for section reveal animation
const revealStyles = `
    .section-hidden {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-hidden.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;

const revealStyleSheet = document.createElement('style');
revealStyleSheet.textContent = revealStyles;
document.head.appendChild(revealStyleSheet);

// Add cursor trail effect
document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function createCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = cursorX + 'px';
    trail.style.top = cursorY + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 1000);
}

// Add cursor trail styles
const cursorStyles = `
    .cursor-trail {
        position: fixed;
        width: 10px;
        height: 10px;
        background: rgba(37, 99, 235, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: trailFade 1s ease-out forwards;
    }
    
    @keyframes trailFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;

const cursorStyleSheet = document.createElement('style');
cursorStyleSheet.textContent = cursorStyles;
document.head.appendChild(cursorStyleSheet);

// Create trail effect on mouse move (throttled)
let trailTimeout;
document.addEventListener('mousemove', () => {
    clearTimeout(trailTimeout);
    trailTimeout = setTimeout(createCursorTrail, 50);
});

// Add click ripple effect
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Add ripple effect styles
const rippleStyles = `
    .click-ripple {
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(37, 99, 235, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: rippleExpand 0.6s ease-out forwards;
        transform: translate(-50%, -50%);
    }
    
    @keyframes rippleExpand {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(4);
        }
    }
`;

const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyles;
document.head.appendChild(rippleStyleSheet);
