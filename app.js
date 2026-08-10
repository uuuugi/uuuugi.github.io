document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       Dark / Light Theme Toggle
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // Toggle theme event
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    /* ==========================================================================
       Mobile Navigation Menu
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = mobileMenuToggle.querySelector('i');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Toggle lucide menu / close icon
        if (navMenu.classList.contains('active')) {
            mobileMenuToggle.innerHTML = '<i data-lucide="x"></i>';
        } else {
            mobileMenuToggle.innerHTML = '<i data-lucide="menu"></i>';
        }
        lucide.createIcons();
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        });
    });

    /* ==========================================================================
       Header Blur & Shadow on Scroll
       ========================================================================== */
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check in case of page refresh

    /* ==========================================================================
       Scroll Fade In Animation (Intersection Observer)
       ========================================================================== */
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);
    
    fadeInElements.forEach(el => fadeInObserver.observe(el));

    // Dynamic delay for multiple fade-in elements (e.g. within Hero)
    const heroElements = document.querySelectorAll('#hero .fade-in');
    heroElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.15}s`;
    });

    /* ==========================================================================
       Active Navigation Link Status on Scroll (ScrollSpy)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const handleScrollSpy = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // offset for fixed header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Fallback for reaching the very bottom of the page to highlight Contact
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            currentSectionId = 'contact';
        }

        if (currentSectionId) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy(); // Run initially to set active state

    /* ==========================================================================
       Project Details Modal Expansion (FLIP Transition)
       ========================================================================== */
    const projectModal = document.getElementById('project-modal');
    const modalBackdrop = projectModal.querySelector('.modal-backdrop');
    const modalContainer = projectModal.querySelector('.modal-container');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const showDetailsBtns = document.querySelectorAll('.show-details-btn');
    
    let activeCard = null;

    function getCenteredPosition() {
        const isMobile = window.innerWidth < 600;
        const w = isMobile ? window.innerWidth : Math.min(window.innerWidth * 0.92, 1050);
        const h = isMobile ? window.innerHeight : Math.min(window.innerHeight * 0.9, 820);
        const top = isMobile ? 0 : (window.innerHeight - h) / 2;
        const left = isMobile ? 0 : (window.innerWidth - w) / 2;
        const borderRadius = isMobile ? '0px' : 'var(--border-radius-lg)';
        
        return { top, left, width: w, height: h, borderRadius };
    }

    function openModal(btn) {
        const card = btn.closest('.project-card');
        if (!card) return;
        activeCard = card;

        const rect = card.getBoundingClientRect();

        // 1. Populate modal body
        const imagePlaceholder = card.querySelector('.project-image-placeholder');
        const titleText = card.querySelector('.project-title').textContent;
        const tagsHTML = card.querySelector('.project-tags').innerHTML;
        const descText = card.querySelector('.project-desc').textContent;
        const detailsPanelHTML = card.querySelector('.project-details-panel').innerHTML;
        const linksHTML = card.querySelector('.project-links') ? card.querySelector('.project-links').innerHTML : '';
        
        const headerClass = imagePlaceholder.className;
        const headerIconHTML = imagePlaceholder.innerHTML;
        
        modalBody.innerHTML = `
            <div class="modal-project-header ${headerClass.replace('project-image-placeholder', '')}">
                ${headerIconHTML}
            </div>
            <div class="modal-scroll-area">
                <div class="modal-grid-layout">
                    <div class="modal-left-col">
                        <h3 class="modal-project-title">${titleText}</h3>
                        <div class="project-tags">${tagsHTML}</div>
                        <p class="modal-project-desc">${descText}</p>
                        ${linksHTML ? `<div class="project-links">${linksHTML}</div>` : ''}
                    </div>
                    <div class="modal-right-col">
                        <div class="project-details-panel">
                            ${detailsPanelHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Re-initialize Lucide Icons inside the modal
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Prevent body scrolling and scrollbar layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            const header = document.getElementById('header');
            if (header) {
                header.style.paddingRight = `${scrollbarWidth}px`;
            }
        }
        document.body.style.overflow = 'hidden';

        // 2. Position container exactly over the card initially
        modalContainer.style.transition = 'none';
        modalContainer.style.top = `${rect.top}px`;
        modalContainer.style.left = `${rect.left}px`;
        modalContainer.style.width = `${rect.width}px`;
        modalContainer.style.height = `${rect.height}px`;
        modalContainer.style.borderRadius = 'var(--border-radius-md)';
        modalContainer.style.opacity = '0';

        // Display modal wrapper
        projectModal.classList.add('open');

        // 3. Force reflow
        modalContainer.offsetHeight;

        // 4. Animate to center
        modalContainer.style.transition = `
            top 0.5s cubic-bezier(0.25, 1, 0.5, 1),
            left 0.5s cubic-bezier(0.25, 1, 0.5, 1),
            width 0.5s cubic-bezier(0.25, 1, 0.5, 1),
            height 0.5s cubic-bezier(0.25, 1, 0.5, 1),
            opacity 0.25s ease-out,
            border-radius 0.5s cubic-bezier(0.25, 1, 0.5, 1)
        `;

        const pos = getCenteredPosition();
        modalContainer.style.top = `${pos.top}px`;
        modalContainer.style.left = `${pos.left}px`;
        modalContainer.style.width = `${pos.width}px`;
        modalContainer.style.height = `${pos.height}px`;
        modalContainer.style.borderRadius = pos.borderRadius;
        modalContainer.style.opacity = '1';
        
        projectModal.classList.add('active');
    }

    function closeModal() {
        if (!activeCard) return;

        const rect = activeCard.getBoundingClientRect();

        // Animate back to original card boundaries
        modalContainer.style.transition = `
            top 0.5s cubic-bezier(0.25, 1, 0.5, 1),
            left 0.5s cubic-bezier(0.25, 1, 0.5, 1),
            width 0.5s cubic-bezier(0.25, 1, 0.5, 1),
            height 0.5s cubic-bezier(0.25, 1, 0.5, 1),
            opacity 0.25s ease-in,
            border-radius 0.5s cubic-bezier(0.25, 1, 0.5, 1)
        `;

        modalContainer.style.top = `${rect.top}px`;
        modalContainer.style.left = `${rect.left}px`;
        modalContainer.style.width = `${rect.width}px`;
        modalContainer.style.height = `${rect.height}px`;
        modalContainer.style.borderRadius = 'var(--border-radius-md)';
        modalContainer.style.opacity = '0';

        projectModal.classList.remove('active');

        // Cleanup after transition ends
        setTimeout(() => {
            projectModal.classList.remove('open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            const header = document.getElementById('header');
            if (header) {
                header.style.paddingRight = '';
            }
            modalBody.innerHTML = '';
            activeCard = null;
        }, 500);
    }

    // Attach listeners
    showDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal(btn));
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    // Escape key handling
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Responsiveness on resize
    window.addEventListener('resize', () => {
        if (activeCard && projectModal.classList.contains('active')) {
            const pos = getCenteredPosition();
            modalContainer.style.transition = 'none';
            modalContainer.style.top = `${pos.top}px`;
            modalContainer.style.left = `${pos.left}px`;
            modalContainer.style.width = `${pos.width}px`;
            modalContainer.style.height = `${pos.height}px`;
            modalContainer.style.borderRadius = pos.borderRadius;
        }
    });
});
