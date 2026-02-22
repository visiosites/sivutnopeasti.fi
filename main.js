// Headers and footers
async function loadPartial(id, file) {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}

Promise.all([
    loadPartial('header-placeholder', '/partials/header.html'),
    loadPartial('footer-placeholder', '/partials/footer.html')
]).then(() => {
    initApp();
});

function initApp() {

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const navLinks = navMenu.querySelectorAll('a');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close mobile menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Process Animation - KIINTEÄ KORKEUS, EI LAGAA
    // Ajetaan vain jos animaatio löytyy sivulta (eli etusivu)
    if (document.getElementById('scene1')) {
        let currentStep = 0;
        const totalSteps = 4;
        const stepDuration = 2500;
        let animationInterval;
        let isPaused = false;
        const scenes = ['scene1', 'scene2', 'scene3', 'scene4'];
        const stepItems = ['step1', 'step2', 'step3', 'step4'];

        function updateScene(step) {
            stepItems.forEach((item, index) => {
                const el = document.getElementById(item);
                if (el) el.classList.toggle('active', index === step);
            });
            scenes.forEach((scene, index) => {
                const el = document.getElementById(scene);
                if (el) el.classList.toggle('active', index === step);
            });
        }

        function nextStep() {
            if (isPaused) return;
            currentStep = (currentStep + 1) % totalSteps;
            updateScene(currentStep);
        }

        function startAnimation() {
            if (animationInterval) clearInterval(animationInterval);
            animationInterval = setInterval(nextStep, stepDuration);
        }

        updateScene(0);
        startAnimation();

        document.querySelectorAll('.step-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                currentStep = index;
                updateScene(currentStep);
                clearInterval(animationInterval);
                startAnimation();
            });
        });
    }

    // Floating CTA visibility - PIILOTETAAN FOOTERISSA JA YHTEYS-OSIOSSA
    // Ajetaan vain jos tarvittavat elementit löytyvät sivulta (eli etusivu)
    const floatingCta = document.getElementById('floatingCta');
    const heroSection = document.querySelector('.hero');
    const contactSection = document.getElementById('yhteys');

    if (floatingCta && heroSection && contactSection) {
        function checkScroll() {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            const footer = document.querySelector('footer');
            const footerTop = footer.getBoundingClientRect().top;
            const contactTop = contactSection.getBoundingClientRect().top;
            const contactBottom = contactSection.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            const buffer = 100; // px ennen footeria

            // Tarkista onko yhteys-osio näkyvissä
            const isContactVisible = contactTop < windowHeight && contactBottom > 0;

            // Näytä nappi kun hero on ohitettu, mutta footer ei vielä näy eikä yhteys-osio ole näkyvissä
            if (heroBottom < 0 && footerTop > windowHeight + buffer && !isContactVisible) {
                floatingCta.classList.add('visible');
            } else {
                floatingCta.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', checkScroll);
        checkScroll();
    }

}
