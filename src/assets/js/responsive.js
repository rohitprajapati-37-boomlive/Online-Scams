// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherToggle = otherItem.querySelector('.faq-toggle');
                
                if (otherItem !== item) {
                    otherQuestion.classList.remove('active');
                    otherAnswer.classList.remove('active');
                    otherToggle.textContent = '+';
                    otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            if (isActive) {
                question.classList.remove('active');
                answer.classList.remove('active');
                toggle.textContent = '+';
                question.setAttribute('aria-expanded', 'false');
            } else {
                question.classList.add('active');
                answer.classList.add('active');
                toggle.textContent = '−';
                question.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Keyboard support
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
    
    // Read More Button Functionality
    const readMoreBtn = document.querySelector('.read-more-btn');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', () => {
            // Scroll to next section or footer
            const nextSection = document.querySelector('#contact, .footer-section, footer');
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Smooth reveal animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    faqItems.forEach(item => {
        item.style.animationPlayState = 'paused';
        observer.observe(item);
    });
});
