// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
    
    // Apply object-fit polyfill for browsers that need it
    objectFitImages();
    
    // Handle hero video
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        // Ensure video plays on iOS/Safari
        heroVideo.play().catch(e => {
            console.log('Auto-play of hero video was prevented:', e);
            // Add play button for mobile if autoplay fails
            const playButton = document.createElement('button');
            playButton.innerHTML = '<i class="fas fa-play fa-2x"></i>';
            playButton.classList.add('hero-play-button');
            playButton.setAttribute('aria-label', 'Play video');
            
            // Insert play button
            heroVideo.parentNode.appendChild(playButton);
            
            // Play video when button is clicked
            playButton.addEventListener('click', () => {
                heroVideo.play();
                playButton.style.display = 'none';
            });
        });
        
        // Pause video when not in viewport to improve performance
        window.addEventListener('scroll', function() {
            const rect = heroVideo.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                // Video is out of view
                if (!heroVideo.paused) heroVideo.pause();
            } else {
                // Video is in view
                if (heroVideo.paused) heroVideo.play().catch(e => console.log('Play on scroll prevented'));
            }
        });
    }
    
    // Mobile menu enhancements
    const navItems = document.querySelectorAll('.navbar-nav .nav-item');
    navItems.forEach((item, index) => {
        item.style.setProperty('--item-count', index);
    });
    
    // Ensure navbar toggler has correct initial state
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        // Make sure toggler has collapsed class on load
        navbarToggler.classList.add('collapsed');
        navbarToggler.setAttribute('aria-expanded', 'false');
    }
    
    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                navbarToggler.classList.add('collapsed');
                navbarToggler.setAttribute('aria-expanded', 'false');
                navbarCollapse.classList.remove('show');
            }
        });
    });
    
    // Fix image loading and display issues across browsers
    window.addEventListener('load', function() {
        // Force browser to recalculate layout for approach cards
        document.querySelectorAll('.approach-card').forEach(function(card) {
            // Trigger layout recalculation
            card.style.display = 'none';
            card.offsetHeight; // Force reflow
            card.style.display = '';
            
            // Ensure images are loaded properly
            const img = card.querySelector('.approach-img');
            if (img) {
                // Force image refresh if needed
                const src = img.src;
                img.style.opacity = '0.99';
                setTimeout(function() {
                    img.style.opacity = '1';
                }, 10);
                
                // Fallback if object-fit is not working
                if (typeof img.style.objectFit === 'undefined') {
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.parentElement.style.overflow = 'hidden';
                }
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button visibility
    const backToTopButton = document.querySelector('.back-to-top');
    
    // Only add event listeners if the button exists
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
    }
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.navbar-nav a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.navbar-nav a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    });
    
    // Fix for mobile viewport overflow
    function fixMobileOverflow() {
        // Check if we're on mobile
        if (window.innerWidth <= 991) {
            // Set viewport meta tag to ensure proper width
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
            }
            
            // Force overflow-x hidden on body and html
            document.documentElement.style.overflowX = 'hidden';
            document.body.style.overflowX = 'hidden';
            
            // Apply width restrictions to containers
            document.querySelectorAll('.container').forEach(container => {
                container.style.maxWidth = '100%';
                container.style.width = '100%';
                container.style.overflowX = 'hidden';
            });
        }
    }
    
    // Run on load and resize
    fixMobileOverflow();
    window.addEventListener('resize', fixMobileOverflow);
}); 