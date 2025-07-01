// Main JavaScript file for Premium Textile website
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const header = document.querySelector('.header');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    // Menu toggle functionality
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            fullscreenMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', function() {
            fullscreenMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking outside
    if (fullscreenMenu) {
        fullscreenMenu.addEventListener('click', function(e) {
            if (e.target === fullscreenMenu) {
                fullscreenMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Navigation link functionality
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const linkText = this.textContent.trim();
            let targetPage = '';
            
            // Map menu items to their corresponding HTML files
            switch(linkText) {
                case 'Home':
                    targetPage = 'Home.html';
                    break;
                case 'Business':
                    targetPage = 'Business.html';
                    break;
                case 'About Us':
                    targetPage = 'about-us.html';
                    break;
                case 'Sustainability':
                    targetPage = 'sustainability.html';
                    break;
                case 'Contact':
                    targetPage = 'contact.html';
                    break;
                default:
                    targetPage = 'Home.html';
            }
            
            // Close menu first
            fullscreenMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Navigate to the target page after a short delay for smooth transition
            setTimeout(() => {
                window.location.href = targetPage;
            }, 300);
        });
    });
    
    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Background slideshow functionality (for home page)
    const bgSlides = document.querySelectorAll('.bg-slide');
    if (bgSlides.length > 1) {
        let currentSlide = 0;
        
        function nextSlide() {
            bgSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % bgSlides.length;
            bgSlides[currentSlide].classList.add('active');
        }
        
        // Change background every 5 seconds
        setInterval(nextSlide, 5000);
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Simple form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff0000';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                this.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });
    
    // Newsletter subscription handling
    const newsletterForms = document.querySelectorAll('.footer-newsletter');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.product-category, .quality-item, .initiative, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                
                // Only animate if it's a number
                if (/^\d+\+?$/.test(text)) {
                    const finalNumber = parseInt(text.replace('+', ''));
                    const hasPlus = text.includes('+');
                    animateCounter(target, 0, finalNumber, 2000, hasPlus);
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Parallax effect for background images
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
    
    // Utility functions
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function animateCounter(element, start, end, duration, hasPlus = false) {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current + (hasPlus ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Handle page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'Home.html';
    
    // Add active class to current menu item
    menuLinks.forEach(link => {
        const linkText = link.textContent.trim();
        let expectedPage = '';
        
        switch(linkText) {
            case 'Home':
                expectedPage = 'Home.html';
                break;
            case 'Business':
                expectedPage = 'Business.html';
                break;
            case 'About Us':
                expectedPage = 'about-us.html';
                break;
            case 'Sustainability':
                expectedPage = 'sustainability.html';
                break;
            case 'Contact':
                expectedPage = 'contact.html';
                break;
        }
        
        if (currentPage === expectedPage || (currentPage === '' && expectedPage === 'Home.html')) {
            link.classList.add('active');
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close menu with Escape key
        if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
            fullscreenMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - could trigger scroll to next section
                console.log('Swipe up detected');
            } else {
                // Swipe down - could trigger scroll to previous section
                console.log('Swipe down detected');
            }
        }
    }
    
    // Performance optimization: Debounce scroll events
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
    
    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    console.log('Premium Textile website initialized successfully');
});

