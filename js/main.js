// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000'
    });
    
    const bgColors = {
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db'
    };
    notification.style.background = bgColors[type] || bgColors.info;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ===== FIXED FAQ TOGGLE FUNCTION =====
function toggleFaq(faqElement) {
    console.log('Toggle FAQ called for:', faqElement);
    
    const currentAnswer = faqElement.nextElementSibling;
    const currentToggle = faqElement.querySelector('.faq-toggle');
    
    if (!currentAnswer || !currentToggle) {
        console.error('FAQ elements not found');
        return;
    }
    
    const isCurrentlyOpen = currentAnswer.classList.contains('active');
    console.log('Currently open:', isCurrentlyOpen);
    
    if (isCurrentlyOpen) {
        // Close current FAQ
        currentAnswer.style.maxHeight = '0';
        currentAnswer.style.overflow = 'hidden';
        currentAnswer.classList.remove('active');
        faqElement.classList.remove('active');
        faqElement.setAttribute('aria-expanded', 'false');
        currentToggle.textContent = '+';
        currentToggle.classList.remove('active');
        console.log('Closed FAQ');
    } else {
        // Close all other FAQs first
        document.querySelectorAll('.faq-answer.active').forEach(answer => {
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.classList.remove('active');
        });
        
        document.querySelectorAll('.faq-question.active').forEach(question => {
            question.classList.remove('active');
            question.setAttribute('aria-expanded', 'false');
        });
        
        document.querySelectorAll('.faq-toggle.active').forEach(toggle => {
            toggle.textContent = '+';
            toggle.classList.remove('active');
        });
        
        // Open current FAQ with proper height calculation
        // First remove any existing height restrictions
        currentAnswer.style.maxHeight = 'none';
        currentAnswer.style.overflow = 'visible';
        currentAnswer.style.height = 'auto';
        
        // Get the actual content height
        const actualHeight = currentAnswer.scrollHeight;
        console.log('Actual height:', actualHeight);
        
        // Set the calculated height
        currentAnswer.style.maxHeight = actualHeight + 'px';
        currentAnswer.classList.add('active');
        faqElement.classList.add('active');
        faqElement.setAttribute('aria-expanded', 'true');
        currentToggle.textContent = '−';
        currentToggle.classList.add('active');
        
        // After animation completes, remove height restriction
        setTimeout(() => {
            if (currentAnswer.classList.contains('active')) {
                currentAnswer.style.maxHeight = 'none';
                currentAnswer.style.overflow = 'visible';
            }
        }, 500);
        
        console.log('Opened FAQ with height:', actualHeight);
        
        // Smooth scroll
        setTimeout(() => {
            faqElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }
}

// ===== FAQ SEARCH FUNCTIONALITY =====
function initializeFAQSearch() {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.querySelector('#faq-search');
    const searchBtn = document.querySelector('.search-btn');
    
    console.log('Initializing FAQ search...', { faqItems: faqItems.length, searchInput, searchBtn });
    
    if (searchInput && faqItems.length > 0) {
        searchInput.addEventListener('input', debounce(function() {
            performSearch(this.value, faqItems);
        }, 300));
        
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                performSearch(searchInput.value, faqItems);
            });
        }
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value, faqItems);
            }
        });
        
        console.log('FAQ search initialized successfully');
    }
}

function performSearch(searchTerm, faqItems) {
    searchTerm = searchTerm.toLowerCase().trim();
    console.log('Performing search for:', searchTerm);
    
    if (searchTerm.length >= 2) {
        let foundResults = false;
        
        faqItems.forEach(item => {
            const questionText = item.querySelector('.faq-question span')?.textContent.toLowerCase() || '';
            const answerText = item.querySelector('.answer-intro')?.textContent.toLowerCase() || '';
            const listItems = item.querySelectorAll('.simple-list li, .column-list li');
            let listText = '';
            
            listItems.forEach(li => {
                listText += li.textContent.toLowerCase() + ' ';
            });
            
            const allText = questionText + ' ' + answerText + ' ' + listText;
            
            if (allText.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.add('search-highlight');
                foundResults = true;
            } else {
                item.style.display = 'none';
                item.classList.remove('search-highlight');
            }
        });
        
        showSearchResults(foundResults, searchTerm);
    } else {
        faqItems.forEach(item => {
            item.style.display = 'block';
            item.classList.remove('search-highlight');
        });
        hideSearchResults();
    }
}

function showSearchResults(foundResults, searchTerm) {
    let resultsMessage = document.querySelector('.search-results-message');
    
    if (!resultsMessage) {
        resultsMessage = document.createElement('div');
        resultsMessage.className = 'search-results-message';
        resultsMessage.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
        `;
        
        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer && faqContainer.firstChild) {
            faqContainer.insertBefore(resultsMessage, faqContainer.firstChild);
        }
    }
    
    if (!foundResults) {
        resultsMessage.innerHTML = `
            <div class="no-results">
                <h3 style="color: #e74c3c; margin-bottom: 15px; font-size: 1.5rem;">No results found for "${searchTerm}"</h3>
                <p style="color: #666; font-size: 1.1rem;">Try searching with different keywords.</p>
            </div>
        `;
        resultsMessage.style.display = 'block';
    } else {
        resultsMessage.style.display = 'none';
    }
}

function hideSearchResults() {
    const resultsMessage = document.querySelector('.search-results-message');
    if (resultsMessage) {
        resultsMessage.style.display = 'none';
    }
}

// ===== MAIN INITIALIZATION =====
function initializeWebsite() {
    console.log('🚀 Initializing website...');
    
    try {
        // Initialize FAQ search
        initializeFAQSearch();
        
        // Initialize FAQ toggle functionality
        const faqQuestions = document.querySelectorAll('.faq-question');
        console.log('Found FAQ questions:', faqQuestions.length);
        
        faqQuestions.forEach((question, index) => {
            console.log(`Binding FAQ ${index + 1}:`, question);
            
            // Add click event
            question.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('FAQ clicked:', this);
                toggleFaq(this);
            });
            
            // Add keyboard accessibility
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFaq(this);
                }
            });
            
            // Make focusable
            question.setAttribute('tabindex', '0');
            question.style.cursor = 'pointer';
        });
        
        // Set initial state for active FAQ
        const activeAnswer = document.querySelector('.faq-answer.active');
        if (activeAnswer) {
            activeAnswer.style.maxHeight = 'none';
            activeAnswer.style.overflow = 'visible';
            activeAnswer.style.height = 'auto';
            console.log('Set initial state for active FAQ');
        }
        
        // Add enhanced CSS
        addEnhancedStyles();
        
        console.log('✅ Website initialized successfully!');
        
        // Welcome notification
        // setTimeout(() => {
        //     showNotification('FAQ system ready! 🚀', 'success');
        // }, 1000);
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showNotification('Error initializing. Please refresh.', 'error');
    }
}

// ===== ENHANCED STYLES TO PREVENT CONTENT CUT =====
function addEnhancedStyles() {
    if (document.getElementById('enhanced-faq-styles')) return; // Prevent duplicate styles
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'enhanced-faq-styles';
    styleSheet.textContent = `
        /* Enhanced FAQ Styles to Prevent Content Cut */
        .faq-answer {
            transition: max-height 0.4s ease-out, padding 0.3s ease !important;
            overflow: hidden !important;
        }
        
        .faq-answer.active {
            overflow: visible !important;
            padding: 30px !important;
        }
        
        .faq-toggle {
            transition: transform 0.3s ease, color 0.3s ease !important;
        }
        
        .faq-toggle.active {
            transform: rotate(180deg) !important;
        }
        
        .faq-question {
            transition: all 0.3s ease !important;
        }
        
        .faq-question:hover {
            background: #f8f9fa !important;
        }
        
        .faq-question:focus {
            outline: 2px solid #3498db;
            outline-offset: 2px;
        }
        
        .search-highlight {
            background: rgba(52, 152, 219, 0.1) !important;
            border-left: 4px solid #3498db !important;
        }
        
        /* Fix for content not being cut */
        .answer-columns {
            min-height: auto !important;
        }
        
        .answer-column {
            min-height: auto !important;
        }
        
        .column-list {
            min-height: auto !important;
        }
        
        .simple-list {
            min-height: auto !important;
        }
        
        /* Mobile responsive fixes */
        @media (max-width: 768px) {
            .faq-answer.active {
                padding: 20px !important;
            }
            
            .answer-columns {
                grid-template-columns: 1fr !important;
                gap: 15px !important;
            }
        }
    `;
    document.head.appendChild(styleSheet);
    console.log('Enhanced styles applied to prevent content cut');
}

// ===== AUTO-INITIALIZE =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}

// ===== GLOBAL TOGGLE FUNCTION FOR ONCLICK =====
window.toggleFaq = toggleFaq;

console.log('Enhanced FAQ script loaded successfully! 🎉');
