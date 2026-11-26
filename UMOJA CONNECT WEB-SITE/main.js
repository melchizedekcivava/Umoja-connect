/**
 * UMOJA COMMUNITY CONNECT - MAIN JAVASCRIPT
 * Interactive features, drawer navigation, form handling & ticket generator
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileDrawer();
    initStatsCounter();
    initCategorySelector();
    initReportForm();
    initTrackerSearch();
    initEventFilters();
    initOpportunityFilters();
    initModals();
    initFaqAccordion();
    initContactForm();
    initNewsletterForm();
    initQuickSearch();
});

/* ---------------------------------------------------------
   1. Header Scroll Shadow
--------------------------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ---------------------------------------------------------
   2. Mobile Drawer Navigation
--------------------------------------------------------- */
function initMobileDrawer() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    const closeBtn = document.querySelector('.drawer-close');

    if (!toggleBtn || !drawer || !backdrop) return;

    function openDrawer() {
        drawer.classList.add('open');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });
}

/* ---------------------------------------------------------
   3. Animated Number Counters
--------------------------------------------------------- */
function initStatsCounter() {
    const counters = document.querySelectorAll('.counter-val');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'), 10);
                const suffix = target.getAttribute('data-suffix') || '';
                let current = 0;
                const step = Math.ceil(countTo / 40);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= countTo) {
                        target.textContent = countTo.toLocaleString() + suffix;
                        clearInterval(timer);
                    } else {
                        target.textContent = current.toLocaleString() + suffix;
                    }
                }, 30);
                obs.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ---------------------------------------------------------
   4. Category Selector in Problem Report
--------------------------------------------------------- */
function initCategorySelector() {
    const options = document.querySelectorAll('.category-option');
    const hiddenInput = document.getElementById('selectedCategory');
    if (!options.length) return;

    options.forEach(opt => {
        opt.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            if (hiddenInput) {
                hiddenInput.value = opt.getAttribute('data-category');
            }
        });
    });
}

/* ---------------------------------------------------------
   5. Problem Report Form Submission & Ticket Generator
--------------------------------------------------------- */
function initReportForm() {
    const reportForm = document.getElementById('reportProblemForm');
    if (!reportForm) return;

    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const category = document.getElementById('selectedCategory')?.value || 'General Issue';
        const ward = document.getElementById('issueWard')?.value || 'Umoja I';
        const location = document.getElementById('issueLocation')?.value || 'Near Market';
        const desc = document.getElementById('issueDescription')?.value || 'Reported community issue.';
        const urgency = document.getElementById('issueUrgency')?.value || 'Moderate';
        
        // Generate Realistic Ticket ID
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const ticketId = `UMJ-2026-${randomNum}`;
        const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        // Show Ticket Modal
        const modal = document.getElementById('ticketModal');
        if (modal) {
            document.getElementById('modalTicketId').textContent = ticketId;
            document.getElementById('modalTicketCategory').textContent = category;
            document.getElementById('modalTicketWard').textContent = `${ward} (${location})`;
            document.getElementById('modalTicketDate').textContent = currentDate;
            modal.classList.add('active');
        }

        // Prepend to Live Tracker Table if exists
        const trackerTable = document.getElementById('trackerTableBody');
        if (trackerTable) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><span class="ticket-id">#${ticketId}</span></td>
                <td><strong>${escapeHtml(category)}</strong><br><small style="color:#64748b;">${escapeHtml(location)}</small></td>
                <td><span class="badge badge-info">${escapeHtml(ward)}</span></td>
                <td>${currentDate}</td>
                <td><span class="badge badge-warning">Pending Review</span></td>
                <td><button class="btn btn-sm btn-outline view-details-btn" data-id="${ticketId}">Details</button></td>
            `;
            trackerTable.insertBefore(newRow, trackerTable.firstChild);
        }

        showToast(`Issue reported successfully! Ticket #${ticketId} created.`, 'success');
        reportForm.reset();
        
        // Reset category pills
        document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
        if (document.querySelectorAll('.category-option')[0]) {
            document.querySelectorAll('.category-option')[0].classList.add('selected');
        }
    });
}

/* ---------------------------------------------------------
   6. Tracker Search
--------------------------------------------------------- */
function initTrackerSearch() {
    const searchInput = document.getElementById('trackerSearchInput');
    const tableBody = document.getElementById('trackerTableBody');
    if (!searchInput || !tableBody) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

/* ---------------------------------------------------------
   7. Event Filter Tabs
--------------------------------------------------------- */
function initEventFilters() {
    const filterTabs = document.querySelectorAll('.event-filter-tab');
    const eventCards = document.querySelectorAll('.event-card');
    if (!filterTabs.length || !eventCards.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-filter');

            eventCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ---------------------------------------------------------
   8. Opportunity Filter Tabs
--------------------------------------------------------- */
function initOpportunityFilters() {
    const filterTabs = document.querySelectorAll('.opp-filter-tab');
    const oppCards = document.querySelectorAll('.opportunity-card');
    if (!filterTabs.length || !oppCards.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-filter');

            oppCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ---------------------------------------------------------
   9. Modals (RSVP, Application, Generic)
--------------------------------------------------------- */
function initModals() {
    // Open RSVP Modal
    document.querySelectorAll('.open-rsvp-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title') || 'Community Event';
            const modal = document.getElementById('rsvpModal');
            if (modal) {
                document.getElementById('rsvpEventTitle').textContent = title;
                modal.classList.add('active');
            }
        });
    });

    // Open Opportunity Application Modal
    document.querySelectorAll('.open-apply-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title') || 'Youth Program';
            const modal = document.getElementById('applyModal');
            if (modal) {
                document.getElementById('applyOppTitle').textContent = title;
                modal.classList.add('active');
            }
        });
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .modal-cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        });
    });

    // Click outside to close
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Form Submissions in modals
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('rsvpModal').classList.remove('active');
            showToast('RSVP Confirmed! A SMS confirmation has been simulated.', 'success');
            rsvpForm.reset();
        });
    }

    const applyForm = document.getElementById('applyForm');
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('applyModal').classList.remove('active');
            showToast('Application Submitted! Our youth coordinator will review it shortly.', 'success');
            applyForm.reset();
        });
    }
}

/* ---------------------------------------------------------
   10. FAQ Accordion
--------------------------------------------------------- */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
}

/* ---------------------------------------------------------
   11. Contact Form
--------------------------------------------------------- */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you! Your message has been sent to the Umoja Community Desk.', 'success');
        contactForm.reset();
    });
}

/* ---------------------------------------------------------
   12. Newsletter Form
--------------------------------------------------------- */
function initNewsletterForm() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Subscribed! You will receive community alerts and updates.', 'success');
            form.reset();
        });
    });
}

/* ---------------------------------------------------------
   13. Quick Search Overlay / Prompt
--------------------------------------------------------- */
function initQuickSearch() {
    const searchBtns = document.querySelectorAll('.header-search-btn');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('siteSearchInput');
    const searchResults = document.getElementById('siteSearchResults');

    if (!searchBtns.length || !searchModal || !searchInput) return;

    searchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            searchModal.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
        });
    });

    const searchableData = [
        { title: 'Report Garbage & Waste', page: 'Report a Problem', link: 'pages/reportaproblem.html#report-form' },
        { title: 'Blocked Drains & Sewage', page: 'Report a Problem', link: 'pages/reportaproblem.html#report-form' },
        { title: 'Track Reported Issues', page: 'Tracker', link: 'pages/reportaproblem.html#tracker' },
        { title: 'Umoja Green Cleanup Drive', page: 'Events', link: 'pages/events.html' },
        { title: 'Youth Tech & Digital Hub', page: 'Opportunities', link: 'pages/opportunities.html' },
        { title: 'Nairobi Micro-Grant for Youth', page: 'Opportunities', link: 'pages/opportunities.html' },
        { title: 'About Bright Umoja & Mission', page: 'About Us', link: 'pages/aboutus.html' },
        { title: 'Emergency Hotlines & Ward Desk', page: 'Contact', link: 'pages/contact.html' }
    ];

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        if (!val) {
            searchResults.innerHTML = '<p style="color:#94a3b8;font-size:0.9rem;text-align:center;padding:1rem;">Type to search pages, events, or services...</p>';
            return;
        }

        const matches = searchableData.filter(d => d.title.toLowerCase().includes(val) || d.page.toLowerCase().includes(val));
        if (matches.length === 0) {
            searchResults.innerHTML = '<p style="color:#94a3b8;font-size:0.9rem;text-align:center;padding:1rem;">No matching results found.</p>';
        } else {
            searchResults.innerHTML = matches.map(m => `
                <a href="${m.link}" style="display:block;padding:0.75rem 1rem;border-bottom:1px solid #e2e8f0;text-decoration:none;">
                    <div style="font-weight:600;color:#0f172a;">${escapeHtml(m.title)}</div>
                    <div style="font-size:0.8rem;color:#0f766e;">In ${escapeHtml(m.page)} &rarr;</div>
                </a>
            `).join('');
        }
    });
}

/* ---------------------------------------------------------
   Helper: Toast Notification
--------------------------------------------------------- */
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
