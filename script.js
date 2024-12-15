// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Slide Management
class SlideManager {
    constructor() {
        this.currentSlide = 'home';
        this.slides = ['home', 'about', 'skills', 'projects', 'contact'];
        this.isAnimating = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Navigation dots
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const targetSlide = dot.getAttribute('data-slide');
                this.navigateToSlide(targetSlide);
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSlide = anchor.getAttribute('href').substring(1);
                this.navigateToSlide(targetSlide);
            });
        });

        // Mouse wheel navigation
        window.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;

            const direction = e.deltaY > 0 ? 1 : -1;
            const currentIndex = this.slides.indexOf(this.currentSlide);
            let targetIndex = currentIndex + direction;

            if (targetIndex >= 0 && targetIndex < this.slides.length) {
                this.navigateToSlide(this.slides[targetIndex]);
            }
        });

        // Touch events for mobile
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        window.addEventListener('touchmove', (e) => {
            if (this.isAnimating) return;

            const touchEndY = e.touches[0].clientY;
            const direction = touchStartY > touchEndY ? 1 : -1;
            const currentIndex = this.slides.indexOf(this.currentSlide);
            let targetIndex = currentIndex + direction;

            if (targetIndex >= 0 && targetIndex < this.slides.length) {
                this.navigateToSlide(this.slides[targetIndex]);
            }
        });
    }

    navigateToSlide(targetSlide) {
        if (this.isAnimating || targetSlide === this.currentSlide) return;

        this.isAnimating = true;
        const currentSlideElement = document.getElementById(this.currentSlide);
        const targetSlideElement = document.getElementById(targetSlide);

        // Update navigation dots
        document.querySelector(`.dot[data-slide="${this.currentSlide}"]`).classList.remove('active');
        document.querySelector(`.dot[data-slide="${targetSlide}"]`).classList.add('active');

        // Animate slides
        currentSlideElement.style.transform = 'translateX(-100%)';
        currentSlideElement.style.opacity = '0';
        currentSlideElement.classList.remove('active');

        targetSlideElement.style.transform = 'translateX(0)';
        targetSlideElement.style.opacity = '1';
        targetSlideElement.classList.add('active');

        this.currentSlide = targetSlide;

        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
}

// Initialize slide manager
const slideManager = new SlideManager();

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Get form data
    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        subject: e.target.subject.value,
        message: e.target.message.value
    };

    try {
        const response = await fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert('Message sent successfully! I will get back to you soon.');
            e.target.reset();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert('Failed to send message. Please try again later.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});
