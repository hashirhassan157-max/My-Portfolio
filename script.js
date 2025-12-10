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

document.addEventListener("mousemove", function(e) {
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
const textArray = ["Full-Stack developer","Web Developer", "BSCS Student", "Coding Enthusiast", "PHP Developer"];
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


// 4. AI Assistant Chatbot Logic
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBody = document.getElementById('chat-body');

// Toggle Chat Window
chatToggle.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
});

closeChat.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

// Knowledge Base
const knowledgeBase = {
    "hello": "Hi there! How can I help you learn more about Hashir?",
    "hi": "Hello! Ask me about Hashir's skills or projects.",
    "name": "His name is Hashir Hassan, a web developer from Pakistan.",
    "skills": "Hashir is skilled in HTML, CSS, JavaScript, PHP, MySQL, and currently learning Data Science.",
    "projects": "He has built an E-Commerce Platform with an Admin Panel and various frontend interfaces.",
    "contact": "You can email him at hashirhassan157@gmail.com or call 0337-7068265.",
    "education": "He is currently pursuing a BSCS degree at Government College University, Faisalabad.",
    "location": "He is based in Faisalabad, Punjab, Pakistan.",
    "experience": "He works as a Frontend Developer at CodeAlpha (Nov 2025 - Present)."
};

// Send Message Function
function sendMessage() {
    const text = userInput.value.trim().toLowerCase();
    if (text === "") return;

    // Add User Message
    addMessage(userInput.value, 'user-msg');
    userInput.value = '';

    // Simulate Bot Typing/Thinking
    setTimeout(() => {
        const response = getBotResponse(text);
        addMessage(response, 'bot-msg');
    }, 600);
}

function addMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', className);
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto scroll to bottom
}

function getBotResponse(input) {
    // Simple keyword matching
    for (let key in knowledgeBase) {
        if (input.includes(key)) {
            return knowledgeBase[key];
        }
    }
    return "I'm not sure about that, but you can contact Hashir directly via email!";
}

// Event Listeners for Chat
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 5. 3D Tilt Effect Initialization Animation
VanillaTilt.init(document.querySelectorAll(".service-card, .project-showcase, .about-card, .tech-item, .step-card, .timeline-content "), {
    max: 15,            // Max tilt rotation (degrees)
    speed: 400,         // Speed of the tilt
    glare: true,        // Add a light glare effect
    "max-glare": 0.5,   // Opacity of the glare
});

// 9. Theme Switcher
function setTheme(primary, secondary) {
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--secondary', secondary);
}

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