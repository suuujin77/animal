document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.header');
    // Header Scroll Effect with Throttling
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Counting Animation
    const counters = document.querySelectorAll('.stat-num');
    const countSpeed = 200;

    const startCounting = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/,/g, '');
        const increment = target / countSpeed;

        if (count < target) {
            const nextCount = Math.ceil(count + increment);
            counter.innerText = nextCount >= target ? target.toLocaleString() : nextCount.toLocaleString();
            setTimeout(() => startCounting(counter), 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                startCounting(counter);
                statsObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => statsObserver.observe(counter));

    // Simple Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Review Slider Logic
    const sliderWrapper = document.querySelector('.reviews-wrapper');
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');

    let currentIndex = 0;
    const totalCards = cards.length;

    // Create dots logic removed as per user request

    const updateSlider = () => {
        const gap = 20;
        const cardWidth = cards[0].offsetWidth + gap;
        sliderWrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        // Calculate max index based on visibility
        let visibleCount = 4;
        if (window.innerWidth <= 600) visibleCount = 1;
        else if (window.innerWidth <= 900) visibleCount = 2;
        else if (window.innerWidth <= 1200) visibleCount = 3;

        const maxIndex = Math.max(0, totalCards - visibleCount);

        // Ensure current index is within bounds
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        // Update arrow button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    };

    const goToSlide = (index) => {
        let visibleCount = 4;
        if (window.innerWidth <= 600) visibleCount = 1;
        else if (window.innerWidth <= 900) visibleCount = 2;
        else if (window.innerWidth <= 1200) visibleCount = 3;

        const maxIndex = Math.max(0, totalCards - visibleCount);
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlider();
    };

    // Auto slide
    let autoSlideInterval = setInterval(() => {
        let visibleCount = 4;
        if (window.innerWidth <= 600) visibleCount = 1;
        else if (window.innerWidth <= 900) visibleCount = 2;
        else if (window.innerWidth <= 1200) visibleCount = 3;

        const maxIndex = Math.max(0, totalCards - visibleCount);

        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0);
        }
    }, 5000);

    // Pause auto slide on interaction
    dotsContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
            clearInterval(autoSlideInterval);
        }
    });

    nextBtn.addEventListener('click', () => {
        let visibleCount = 4;
        if (window.innerWidth <= 600) visibleCount = 1;
        else if (window.innerWidth <= 900) visibleCount = 2;
        else if (window.innerWidth <= 1200) visibleCount = 3;
        const maxIndex = Math.max(0, totalCards - visibleCount);

        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
            clearInterval(autoSlideInterval);
        }
    });

    // Handle resize
    window.addEventListener('resize', updateSlider);

    // Initial update
    updateSlider();
});
