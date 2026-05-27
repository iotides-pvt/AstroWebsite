
        function setupMobileNavigation() {
            const toggle = document.getElementById('mobile-menu-toggle');
            const menu = document.getElementById('mobile-menu');

            if (!toggle || !menu) return;

            const setMenuState = (isOpen) => {
                menu.classList.toggle('hidden', !isOpen);
                toggle.setAttribute('aria-expanded', String(isOpen));
                toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
                toggle.innerHTML = isOpen
                    ? '<i data-lucide="x" class="h-5 w-5"></i>'
                    : '<i data-lucide="menu" class="h-5 w-5"></i>';
                lucide.createIcons();
            };

            toggle.addEventListener('click', () => {
                setMenuState(menu.classList.contains('hidden'));
            });

            menu.querySelectorAll('a[href^="#"]').forEach((link) => {
                link.addEventListener('click', () => {
                    setMenuState(false);
                });
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth >= 1280) {
                    setMenuState(false);
                }
            });
        }

        function setupActiveNavigation() {
            const navItems = Array.from(document.querySelectorAll('.nav-link'))
                .map((link) => {
                    const targetSelector = link.dataset.activeTarget || link.getAttribute('href');
                    const target = targetSelector ? document.querySelector(targetSelector) : null;
                    return target ? { link, target } : null;
                })
                .filter(Boolean);

            if (!navItems.length || !('IntersectionObserver' in window)) return;

            const observer = new IntersectionObserver((entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (!visibleEntry) return;

                navItems.forEach(({ link, target }) => {
                    link.classList.toggle('is-active', target === visibleEntry.target);
                });
            }, {
                threshold: [0.08, 0.18, 0.32],
                rootMargin: '-18% 0px -68% 0px'
            });

            navItems.forEach(({ target }) => {
                observer.observe(target);
            });
        }

        function setupSectionReveal() {
            const sections = document.querySelectorAll('main > section');
            sections.forEach((section) => {
                section.classList.add('reveal-section');
            });

            const showSection = (section) => {
                section.classList.add('section-visible');
            };

            if (!('IntersectionObserver' in window)) {
                sections.forEach(showSection);
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    showSection(entry.target);
                    observer.unobserve(entry.target);
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -8% 0px'
            });

            sections.forEach((section) => {
                observer.observe(section);
            });
        }

        function setupCardSequence() {
            const cardSelectors = [
                '#about .grid > div:first-child',
                '#services .grid > div',
                '#advanced-expertise .grid > div',
                '#advanced-expertise .pt-6 > div',
                '#transit-guidance .transit-card',
                '#remedies .grid > div:last-child',
                '#bach-flower > div:last-child',
                '#consultation-options .consultation-card',
                '#youtube-channel .rounded-2xl',
                '#why-choose .grid > div',
                '#testimonials .grid > div',
                '#journey-to-clarity .grid > div',
                '#connect .grid > div:last-child'
            ];

            const sectionGroups = new Map();

            cardSelectors.forEach((selector) => {
                document.querySelectorAll(selector).forEach((card) => {
                    const section = card.closest('section');
                    if (!section) return;

                    card.classList.add('reveal-card');
                    card.setAttribute('data-hover-card', '');

                    if (!sectionGroups.has(section)) {
                        sectionGroups.set(section, []);
                    }

                    const cards = sectionGroups.get(section);
                    if (!cards.includes(card)) {
                        cards.push(card);
                    }
                });
            });

            const revealCards = (cards) => {
                cards.forEach((card, index) => {
                    window.setTimeout(() => {
                        card.classList.add('is-visible');
                    }, index * 130);
                });
            };

            if (!('IntersectionObserver' in window)) {
                sectionGroups.forEach(revealCards);
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    revealCards(sectionGroups.get(entry.target) || []);
                    observer.unobserve(entry.target);
                });
            }, {
                threshold: 0.18,
                rootMargin: '0px 0px -12% 0px'
            });

            sectionGroups.forEach((cards, section) => {
                observer.observe(section);
            });
        }

        lucide.createIcons();
        setupMobileNavigation();
        setupActiveNavigation();
        setupSectionReveal();
        setupCardSequence();
    

