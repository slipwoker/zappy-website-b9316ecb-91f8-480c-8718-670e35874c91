document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation and submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        const formFields = {
            name: {
                element: document.getElementById('name'),
                error: document.getElementById('name-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Name is required';
                    if (value.trim().length < 2) return 'Name must be at least 2 characters';
                    return null;
                }
            },
            email: {
                element: document.getElementById('email'),
                error: document.getElementById('email-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Email is required';
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) return 'Please enter a valid email address';
                    return null;
                }
            },
            phone: {
                element: document.getElementById('phone'),
                error: document.getElementById('phone-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Phone number is required';
                    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
                    if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number';
                    return null;
                }
            },
            service: {
                element: document.getElementById('service'),
                error: document.getElementById('service-error'),
                validate: (value) => {
                    if (!value) return 'Please select a service';
                    return null;
                }
            },
            date: {
                element: document.getElementById('date'),
                error: document.getElementById('date-error'),
                validate: (value) => {
                    if (!value) return 'Please select a date';
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) return 'Please select a future date';
                    return null;
                }
            },
            time: {
                element: document.getElementById('time'),
                error: document.getElementById('time-error'),
                validate: (value) => {
                    if (!value) return 'Please select a time';
                    return null;
                }
            },
            consent: {
                element: document.getElementById('consent'),
                error: document.getElementById('consent-error'),
                validate: (checked) => {
                    if (!checked) return 'Please agree to the terms and privacy policy';
                    return null;
                }
            }
        };
        
        // Real-time validation
        Object.keys(formFields).forEach(fieldName => {
            const field = formFields[fieldName];
            if (field.element) {
                field.element.addEventListener('blur', () => validateField(fieldName));
                field.element.addEventListener('input', () => {
                    if (field.error.classList.contains('show')) {
                        validateField(fieldName);
                    }
                });
            }
        });
        
        function validateField(fieldName) {
            const field = formFields[fieldName];
            if (!field || !field.element) return true;
            
            const value = field.element.type === 'checkbox' ? field.element.checked : field.element.value;
            const error = field.validate(value);
            
            if (error) {
                field.element.classList.add('error');
                field.error.textContent = error;
                field.error.classList.add('show');
                return false;
            } else {
                field.element.classList.remove('error');
                field.error.textContent = '';
                field.error.classList.remove('show');
                return true;
            }
        }
        
        function validateForm() {
            let isValid = true;
            Object.keys(formFields).forEach(fieldName => {
                if (!validateField(fieldName)) {
                    isValid = false;
                }
            });
            return isValid;
        }
        
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
        
        // Form submission
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                // Focus on first error field
                const firstErrorField = appointmentForm.querySelector('.form__input.error, .form__select.error');
                if (firstErrorField) {
                    firstErrorField.focus();
                }
                return;
            }
            
            // Show loading state
            const submitButton = appointmentForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                // Show success message
                const successMessage = document.getElementById('form-success');
                if (successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Reset form
                appointmentForm.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successMessage) {
                        successMessage.style.display = 'none';
                    }
                }, 5000);
            }, 2000);
        });
    }
    
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
    const animatedElements = document.querySelectorAll('.service-card, .testimonial, .gallery__item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
    
    // Gallery image modal (simple implementation)
    const galleryImages = document.querySelectorAll('.gallery__img');
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            // Simple modal implementation
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const modalImg = document.createElement('img');
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
            `;
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            modal.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            // Close on Escape key
            const closeOnEscape = (e) => {
                if (e.key === 'Escape') {
                    document.body.removeChild(modal);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            };
            document.addEventListener('keydown', closeOnEscape);
        });
    });
    
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
    
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type !== 'submit') {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
});