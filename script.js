// --- Preloader Logic ---
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
    // Optional: Keeps it visible for at least 1.5 seconds so users see the cool animation
    setTimeout(() => {
        preloader.classList.add('preloader-hidden');
        // Remove it from the DOM entirely after fade out to save resources
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);
});

// Scroll Progress Bar (Updated to fix conflict)
window.addEventListener("scroll", () => {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";
});

// Custom Cursor Logic
const cursor = document.querySelector(".cursor");
const cursor2 = document.querySelector(".cursor2");

document.addEventListener("mousemove", function (e) {
    // Move the small dot instantly
    cursor2.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";

    // Move the large circle with a slight delay (handled by CSS transition)
    cursor.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
});

// 1. Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 2. Typing Effect for Hero Section
const typeWriterElement = document.querySelector('.typewriter');
const textArray = ["Full-Stack developer", "Web Developer", "BSCS Student", "Coding Enthusiast", "PHP Developer"];
let textIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textIndex].length) {
        typeWriterElement.textContent += textArray[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (charIndex > 0) {
        typeWriterElement.textContent = textArray[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        textIndex++;
        if (textIndex >= textArray.length) textIndex = 0;
        setTimeout(type, 1000);
    }
}

document.addEventListener("DOMContentLoaded", type); // Start typing on load

// 3. Scroll Reveal Animation (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// 3.5. Animated Statistics Counter
const statsSection = document.querySelector('#statistics');
const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            // Format numbers with + for thousands
            if (target >= 1000) {
                element.textContent = Math.floor(current) + '+';
            } else {
                element.textContent = Math.floor(current);
            }
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure we end at the exact target
            if (target >= 1000) {
                element.textContent = target + '+';
            } else {
                element.textContent = target;
            }
        }
    };

    updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            statNumbers.forEach((stat, index) => {
                setTimeout(() => {
                    animateCounter(stat);
                }, index * 100); // Stagger animation by 100ms per card
            });
        }
    });
}, {
    threshold: 0.3 // Trigger when 30% of section is visible
});

if (statsSection) {
    statsObserver.observe(statsSection);
}


const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBody = document.getElementById('chat-body');


const chatSettingsBtn = document.getElementById('chat-settings-btn');
const apiSettingsPanel = document.getElementById('api-settings-panel');
const geminiKeyInput = document.getElementById('gemini-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const apiStatus = document.getElementById('api-status');

const quickSuggestions = [
    { text: "💻 Show Skills", query: "What are your skills?" },
    { text: "🚀 Featured Projects", query: "Show me your projects" },
    { text: "💼 Experience", query: "Tell me about your experience" },
    { text: "✉️ Contact Info", query: "How to contact you?" }
];

const dummyVar = [
    { text: "ðŸ’» Show Skills", query: "What are your skills?" },
    { text: "ðŸš€ Featured Projects", query: "Show me your projects" },
    { text: "ðŸ’¼ Experience", query: "Tell me about your experience" },
    { text: "âœ‰ï¸ Contact Info", query: "How to contact you?" }
];

// Load Gemini API Key if saved
if (localStorage.getItem('gemini_api_key')) {
    geminiKeyInput.value = localStorage.getItem('gemini_api_key');
}

// Toggle Chat Window
chatToggle.addEventListener('click', () => {
    const isShowing = chatWindow.style.display === 'flex';
    chatWindow.style.display = isShowing ? 'none' : 'flex';
    if (!isShowing) {
        showSuggestions();
    }
});

closeChat.addEventListener('click', () => {
    chatWindow.style.display = 'none';
    apiSettingsPanel.style.display = 'none';
});

// Toggle Settings Panel
chatSettingsBtn.addEventListener('click', () => {
    const isPanelHidden = apiSettingsPanel.style.display !== 'flex';
    apiSettingsPanel.style.display = isPanelHidden ? 'flex' : 'none';
    if (isPanelHidden) {
        apiStatus.textContent = '';
    }
});

// Save or Clear API Key
saveKeyBtn.addEventListener('click', () => {
    const keyValue = geminiKeyInput.value.trim();
    if (keyValue === '') {
        localStorage.removeItem('gemini_api_key');
        apiStatus.className = 'api-status error';
        apiStatus.textContent = 'API Key cleared. Fallback to offline chatbot.';
    } else {
        localStorage.setItem('gemini_api_key', keyValue);
        apiStatus.className = 'api-status success';
        apiStatus.textContent = 'API Key saved successfully!';
        setTimeout(() => {
            apiSettingsPanel.style.display = 'none';
        }, 1200);
    }
});

// Show Suggestion Bubbles
function showSuggestions() {
    const oldContainer = chatBody.querySelector('.chat-suggestions');
    if (oldContainer) oldContainer.remove();

    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.classList.add('chat-suggestions');

    quickSuggestions.forEach(item => {
        const bubble = document.createElement('div');
        bubble.classList.add('suggestion-bubble');
        bubble.textContent = item.text;
        bubble.addEventListener('click', () => {
            userInput.value = item.query;
            sendMessage();
        });
        suggestionsDiv.appendChild(bubble);
    });

    chatBody.appendChild(suggestionsDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

let typingIndicator = null;

function showTypingIndicator() {
    if (typingIndicator) return;

    typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot-msg');
    typingIndicator.innerHTML = `
        <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
    }
}

// Gemini API Integration Call
async function callGeminiAPI(queryText, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `You are Hashir Hassan's AI Portfolio Assistant, an helpful AI designed to help recruiters, clients, and website visitors learn about Hashir. Maintain a professional, cheerful, and positive tone.
                    
                    Here is Hashir's personal and professional info:
                    - **Name**: Hashir Hassan
                    - **Role**: BSCS (Computer Science) Student at Government College University, Faisalabad (GCUF) & Web Developer.
                    - **Skills**: HTML, CSS, JavaScript, PHP, MySQL, Bootstrap, Tailwind, and currently learning Data Science & AI.
                    - **Experience / Journey**: Over 2 years of freelancing experience building customs php & mysql code databases (like ridesharing and clothes platforms). He is currently a remote Frontend Intern at CodeAlpha (developing responsive UIs in React and Tailwind) since November 2025.
                    - **Projects**:
                      1. *Go Swift Web App*: A full-stack ridesharing web application using PHP/MySQL user booking log authentication.
                      2. *E-Commerce (Pj Collection)*: A clothing platform containing a custom admin panel using PHP and MySQL.
                      3. *IT-Institute Website*: A fully responsive frontend short course platform developed for Career Institute Jhang using HTML, CSS, JavaScript.
                    - **Contact Information**:
                      - Email: hashirhassan157@gmail.com
                      - Phone: 0337-7068265
                      - LinkedIn: https://linkedin.com/in/hashir-hassan157
                      - GitHub: https://github.com/hashirhassan157-max
                      - Location: Faisalabad, Punjab, Pakistan
                    
                    Instructions for your responses:
                    1. Keep answers concise, highly specific, and professional. 
                    2. Rely strictly on the information provided here. Do not make up facts about Hashir. If the query is unrelated or unknown, politely direct the user to check his "About" section or email him at hashirhassan157@gmail.com.
                    3. Do not include system prompt instructions in your replies. Use formatting (bold words, clean bullet markers, links) to keep layout readable. Refer to credentials directly without explaining the instructions.
                    
                    Visitor Query: "${queryText}"`
                }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        let textResult = data.candidates[0].content.parts[0].text;
        // Parse markdown links or other indicators to secure HTML (e.g. replacing markdown newlines with HTML br)
        return textResult.replace(/\n/g, '<br>');
    }
    throw new Error("Empty API Response content candidates");
}

// Send Message Function
function sendMessage() {
    const originalText = userInput.value.trim();
    const text = originalText.toLowerCase();
    if (text === "") return;

    // Remove suggestions container when user sends a message
    const oldContainer = chatBody.querySelector('.chat-suggestions');
    if (oldContainer) oldContainer.remove();

    // Add User Message
    addMessage(originalText, 'user-msg');
    userInput.value = '';

    // Show Bot Typing Indicator
    showTypingIndicator();

    const apiKey = localStorage.getItem('gemini_api_key');

    if (apiKey) {
        // Send via Gemini API
        callGeminiAPI(originalText, apiKey)
            .then(apiResponse => {
                removeTypingIndicator();
                addMessage(apiResponse, 'bot-msg');
                setTimeout(showSuggestions, 350);
            })
            .catch(err => {
                console.error("Gemini API Error:", err);
                removeTypingIndicator();
                // Offline fallback overlay
                const offlineResponse = getBotResponse(text);
                addMessage(`*(Gemini Connection Failed. Offline Mode Active)*<br>${offlineResponse}`, 'bot-msg');
                setTimeout(showSuggestions, 350);
            });
    } else {
        // Offline Fallback Mode
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(text);
            addMessage(response, 'bot-msg');
            setTimeout(showSuggestions, 350);
        }, 1000);
    }
}

function addMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', className);
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto scroll to bottom
}

function getBotResponse(input) {
    // 1. Greetings
    if (input.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
        return "Hello! I'm Hashir's AI assistant. Feel free to ask me about his skills, experience, projects, or how to hire him!";
    }

    // 2. Skills
    if (input.includes('skill') || input.includes('tech') || input.includes('competency') || input.includes('languages') || input.includes('what can you do') || input.includes('what do you do')) {
        return "Hashir is a skilled full-stack developer. His core skills include:<br>â€¢ <strong>Frontend:</strong> HTML, CSS, JavaScript, Bootstrap, Tailwind<br>â€¢ <strong>Backend:</strong> PHP, MySQL<br>â€¢ <strong>Extra:</strong> Exploring Data Science & AI concepts.";
    }

    // 3. Projects
    if (input.includes('project') || input.includes('work') || input.includes('portfolio') || input.includes('goswift') || input.includes('ecommerce') || input.includes('e-commerce') || input.includes('website')) {
        return "Hashir has built several impressive projects:<br>1. <strong>Go Swift:</strong> A full-stack ride-sharing web app (PHP & MySQL).<br>2. <strong>E-Commerce (Pj Collection):</strong> Clothes web app with Admin Panel.<br>3. <strong>IT-Institute website:</strong> Clean frontend site for Career Institute.";
    }

    // 4. Contact / Hire
    if (input.includes('contact') || input.includes('email') || input.includes('phone') || input.includes('hire') || input.includes('call') || input.includes('reach') || input.includes('linkedin') || input.includes('github') || input.includes('number')) {
        return "You can get in touch with Hashir in the following ways:<br>â€¢ âœ‰ï¸ <strong>Email:</strong> hashirhassan157@gmail.com<br>â€¢ ðŸ“ž <strong>Phone:</strong> 0337-7068265<br>â€¢ ðŸ’¼ <a href='https://linkedin.com/in/hashir-hassan157' target='_blank' style='color: var(--primary);'>LinkedIn Profile</a><br>â€¢ ðŸ™ <a href='https://github.com/hashirhassan157-max' target='_blank' style='color: var(--primary);'>GitHub Profile</a>";
    }

    // 5. Experience / Internship
    if (input.includes('experience') || input.includes('job') || input.includes('intern') || input.includes('journey') || input.includes('codealpha')) {
        return "Hashir has over 2 years of freelancing experience building custom PHP/MySQL websites. He is also currently a **Frontend Intern at CodeAlpha (Remote)** working with React & Tailwind.";
    }

    // 6. Education
    if (input.includes('education') || input.includes('degree') || input.includes('university') || input.includes('study') || input.includes('gcu') || input.includes('college')) {
        return "Hashir is a **BSCS (Bachelor of Science in Computer Science)** student at **Government College University, Faisalabad (GCUF)**.";
    }

    // 7. Location
    if (input.includes('location') || input.includes('live') || input.includes('where') || input.includes('pakistan') || input.includes('faisalabad')) {
        return "Hashir is based in **Faisalabad, Punjab, Pakistan**.";
    }

    // 8. Compliments / Feedback
    if (input.match(/\b(thanks|thank you|great|nice|cool|awesome|good|perfect)\b/)) {
        return "You are very welcome! Let me know if there's anything else I can tell you about Hashir.";
    }

    // Fallback
    return "I'm not sure about that specific detail, but you can learn more by checking his **About** section or contacting him directly via email (hashirhassan157@gmail.com)!";
}

// Event Listeners for Chat
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 5. 3D Tilt Effect Initialization Animation with Dynamic Shadows
const tiltElements = document.querySelectorAll(".service-card, .project-showcase, .showcase-img, .about-card, .tech-item, .step-card, .timeline-content, .stat-card");
VanillaTilt.init(tiltElements, {
    max: 15,            // Max tilt rotation (degrees)
    speed: 400,         // Speed of the tilt
    glare: true,        // Add a light glare effect
    "max-glare": 0.35,  // Opacity of the glare
});

// Dynamic Shadow Shift Event Listener
tiltElements.forEach(card => {
    card.addEventListener("tiltChange", (event) => {
        const tiltX = event.detail.tiltX; // Horizontal tilt angle
        const tiltY = event.detail.tiltY; // Vertical tilt angle

        // Shadow moves in the opposite direction of the tilt to simulate real depth lighting
        const shadowX = -tiltX * 1.8;
        const shadowY = tiltY * 1.8;

        card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.2)`;
    });

    // Reset shadow when mouse leaves card
    card.style.transition = "transform 0.1s ease, box-shadow 0.3s ease";
    card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "";
    });
});

// 9. Theme Switcher & Light/Dark System Sync
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = themeToggleBtn.querySelector('.theme-toggle-icon');

function setTheme(primary, secondary) {
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--secondary', secondary);
}

// Function to set dark / light mode style
function toggleLightDarkMode(isLight) {
    const iconHolder = themeToggleIcon;

    // Add dynamic morphing rotate/spin class
    iconHolder.classList.add('spin');

    setTimeout(() => {
        if (isLight) {
            document.documentElement.classList.add('light-theme');
            iconHolder.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme_preference', 'light');
        } else {
            document.documentElement.classList.remove('light-theme');
            iconHolder.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme_preference', 'dark');
        }

        // Remove morphing rotate/spin class
        setTimeout(() => {
            iconHolder.classList.remove('spin');
        }, 100);
    }, 250);
}

// Event Listener for click theme toggle
themeToggleBtn.addEventListener('click', () => {
    const isCurrentLight = document.documentElement.classList.contains('light-theme');
    toggleLightDarkMode(!isCurrentLight);
});

// Load Theme Setting
function initThemeSync() {
    const savedTheme = localStorage.getItem('theme_preference');

    if (savedTheme === 'light') {
        toggleLightDarkMode(true);
    } else if (savedTheme === 'dark') {
        toggleLightDarkMode(false);
    } else {
        // Fallback to System Preference Detection on load
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        toggleLightDarkMode(systemPrefersLight);
    }

    // Listen for OS environment change events
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme_preference')) {
            toggleLightDarkMode(e.matches);
        }
    });
}

// Run initializer
initThemeSync();

// 6. Particles Background
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#38bdf8" }, /* Matches your Cyan Primary Color */
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#38bdf8", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" } },
        "modes": { "repulse": { "distance": 100, "duration": 0.4 } }
    }
});

// --- Back to Top Button Logic ---
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = "flex";
    } else {
        backToTopBtn.style.display = "none";
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// --- Interactive Project Demo Modal ---
const demoModal = document.getElementById('demo-modal');
const closeModalBtn = document.getElementById('close-modal');
const demoBtns = document.querySelectorAll('.demo-btn');
const modalTitle = document.getElementById('modal-title');
const demoIframe = document.getElementById('demo-iframe');
const iframeLoading = document.querySelector('.iframe-loading');
const galleryMainImg = document.getElementById('gallery-main-img');
const galleryThumbnails = document.getElementById('gallery-thumbnails');
const prevImgBtn = document.getElementById('prev-img');
const nextImgBtn = document.getElementById('next-img');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const modalLiveLink = document.getElementById('modal-live-link');
const modalGithubLink = document.getElementById('modal-github-link');

// Project Data Configuration
const projectData = {
    goswift: {
        title: "GoSwift Web App",
        demoUrl: "https://hashirhassan157-max.github.io/Go-Swift/",
        liveUrl: "https://hashirhassan157-max.github.io/Go-Swift/",
        githubUrl: "https://github.com/hashirhassan157-max/Go-Swift",
        images: [
            "images/Go swift SS.png"
        ]
    },
    ecommerce: {
        title: "E-Commerce Platform",
        demoUrl: "#", // Add your demo URL here
        liveUrl: "#",
        githubUrl: "https://github.com",
        images: [
            "images/E commerce ss.png"
        ]
    },
    career: {
        title: "IT-Institute Website",
        demoUrl: "https://hashirhassan157-max.github.io/Career-institute-jhang/",
        liveUrl: "https://hashirhassan157-max.github.io/Career-institute-jhang/",
        githubUrl: "https://github.com/hashirhassan157-max/Career-institute-jhang",
        images: [
            "images/career sss.png"
        ]
    }
};

let currentProject = null;
let currentImageIndex = 0;

// Open Modal
function openModal(projectId) {
    currentProject = projectData[projectId];
    if (!currentProject) return;

    // Set modal title
    modalTitle.textContent = currentProject.title;

    // Set links
    modalLiveLink.href = currentProject.liveUrl;
    modalGithubLink.href = currentProject.githubUrl;

    // Reset to demo tab
    switchTab('demo');

    // Load demo iframe
    if (currentProject.demoUrl && currentProject.demoUrl !== '#') {
        iframeLoading.classList.remove('hidden');
        demoIframe.src = currentProject.demoUrl;
        demoIframe.onload = () => {
            iframeLoading.classList.add('hidden');
        };
    } else {
        iframeLoading.classList.remove('hidden');
        iframeLoading.innerHTML = '<p>Demo URL not available</p>';
    }

    // Load gallery
    loadGallery();

    // Show modal
    demoModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Modal
function closeModal() {
    demoModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    demoIframe.src = ''; // Stop iframe loading
    currentImageIndex = 0;
}

// Tab Switching
function switchTab(tabName) {
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Load Gallery
function loadGallery() {
    if (!currentProject || !currentProject.images) return;

    galleryThumbnails.innerHTML = '';
    currentImageIndex = 0;

    currentProject.images.forEach((imgSrc, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${imgSrc}" alt="Screenshot ${index + 1}">`;
        thumbnail.addEventListener('click', () => {
            showImage(index);
        });
        galleryThumbnails.appendChild(thumbnail);
    });

    if (currentProject.images.length > 0) {
        showImage(0);
    }
}

// Show Image in Gallery
function showImage(index) {
    if (!currentProject || !currentProject.images[index]) return;

    currentImageIndex = index;
    galleryMainImg.src = currentProject.images[index];

    // Update active thumbnail
    const thumbnails = galleryThumbnails.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Previous Image
function prevImage() {
    if (!currentProject || !currentProject.images) return;
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentProject.images.length - 1;
    showImage(newIndex);
}

// Next Image
function nextImage() {
    if (!currentProject || !currentProject.images) return;
    const newIndex = currentImageIndex < currentProject.images.length - 1 ? currentImageIndex + 1 : 0;
    showImage(newIndex);
}

// Event Listeners
demoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.dataset.project;
        if (projectId) {
            openModal(projectId);
        }
    });
});

closeModalBtn.addEventListener('click', closeModal);

// Close on overlay click
demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal || e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal.classList.contains('active')) {
        closeModal();
    }
});

// Tab button listeners
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        switchTab(tabName);
    });
});

// Gallery navigation
prevImgBtn.addEventListener('click', prevImage);
nextImgBtn.addEventListener('click', nextImage);

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (demoModal.classList.contains('active')) {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === 'gallery-tab') {
            if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    }
});

// --- Animated Timeline with Scroll Triggers ---
const timelineSection = document.querySelector('#experience');
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineLine = document.querySelector('.timeline-line');

let timelineAnimated = false;

// Timeline Animation Observer
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !timelineAnimated) {
            timelineAnimated = true;

            // Animate timeline line fill
            if (timelineLine) {
                timelineLine.classList.add('animate');
            }

            // Stagger animation for timeline items
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('timeline-animate');

                    // Animate dot with delay
                    const dot = item.querySelector('.timeline-dot');
                    if (dot) {
                        setTimeout(() => {
                            dot.style.animation = 'dotPulse 2s ease-in-out infinite';
                        }, 300);
                    }
                }, index * 400); // 400ms delay between each item
            });
        }
    });
}, {
    threshold: 0.2, // Trigger when 20% of section is visible
    rootMargin: '0px 0px -100px 0px'
});

if (timelineSection) {
    timelineObserver.observe(timelineSection);
}

// Add hover effects for timeline items
timelineItems.forEach((item) => {
    const content = item.querySelector('.timeline-content');
    const dot = item.querySelector('.timeline-dot');

    if (content && dot) {
        content.addEventListener('mouseenter', () => {
            dot.style.transform = 'scale(1.4)';
            dot.style.boxShadow = '0 0 40px var(--primary), 0 0 80px rgba(56, 189, 248, 1)';
        });

        content.addEventListener('mouseleave', () => {
            dot.style.transform = 'scale(1)';
            dot.style.boxShadow = '0 0 20px var(--primary), 0 0 40px rgba(56, 189, 248, 0.5)';
        });
    }
});

// 10. Magnet Effect Buttons Logic
const magnetButtons = document.querySelectorAll(".primary-btn, .secondary-btn, .gh-btn, .demo-btn, #chat-toggle, #chat-settings-btn, #close-chat, #send-btn, #save-key-btn, .menu-btn, .theme-toggle-btn, .audio-toggle-btn");
magnetButtons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();

        // Mouse coordinate offsets from the center of the button
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        // Set magnetic translation (pulling button closer to the pointer)
        btn.style.transform = `translate(${offsetX * 0.35}px, ${offsetY * 0.35}px)`;
        btn.style.transition = "transform 0.1s ease-out";
    });

    btn.addEventListener("mouseleave", () => {
        // Reset transformation state
        btn.style.transform = "";
        btn.style.transition = "transform 0.4s ease";
    });

    // Play tactile sound on clicks
    btn.addEventListener("click", () => {
        if (btn.id === 'theme-toggle' || btn.id === 'audio-toggle') {
            AudioSynth.playToggle();
        } else {
            AudioSynth.playClick();
        }
    });
});

// 11. Micro-Interactions: Synthesised Web Audio Cues
const AudioSynth = {
    enabled: localStorage.getItem('audio_feedback') !== 'disabled',
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playClick() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    },

    playSwish() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

        osc.start();
        osc.stop(ctx.currentTime + 0.19);
    },

    playToggle() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.setValueAtTime(780, ctx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }
};

// UI Sound Feedback controls
const audioToggleBtn = document.getElementById('audio-toggle');
const audioToggleIcon = audioToggleBtn.querySelector('.audio-toggle-icon');

// Sync volume toggle buttons icon state
function updateAudioIcon() {
    if (AudioSynth.enabled) {
        audioToggleIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
        audioToggleBtn.title = "Mute Sound Feedback";
    } else {
        audioToggleIcon.innerHTML = '<i class="fas fa-volume-mute"></i>';
        audioToggleBtn.title = "Unmute Sound Feedback";
    }
}

// Initialise audio buttons
updateAudioIcon();

audioToggleBtn.addEventListener('click', () => {
    AudioSynth.enabled = !AudioSynth.enabled;
    localStorage.setItem('audio_feedback', AudioSynth.enabled ? 'enabled' : 'disabled');
    updateAudioIcon();
    // Play check indicator sound
    if (AudioSynth.enabled) {
        AudioSynth.playClick();
    }
});

// Modal close button sound sync
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        AudioSynth.playSwish();
    });
}
if (closeChat) {
    closeChat.addEventListener('click', () => {
        AudioSynth.playSwish();
    });
}

// 12. Micro-Interactions: Cursor Click Burst & Ripples
document.body.addEventListener('click', (e) => {
    // Make sure we click somewhere, trigger ripple
    createClickRipple(e.clientX, e.clientY);
    createClickBurst(e.clientX, e.clientY);
});

function createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);

    // Clean up
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createClickBurst(x, y) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Random distance and direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 50; // Fly 30px to 80px
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);

        document.body.appendChild(particle);

        // Clean up
        setTimeout(() => {
            particle.remove();
        }, 500);
    }
}
