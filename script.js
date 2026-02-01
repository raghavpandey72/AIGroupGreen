// ============================================
// AICL - MAIN JAVASCRIPT
// ============================================

// Configuration & Data
const fallbackCountries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", 
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", 
    "Belize", "Benin", "Bhutan", "Bolivia", "Botswana", "Brazil", "Bulgaria", "Burkina Faso", 
    "Burundi", "Cambodia", "Cameroon", "Canada", "Chad", "Chile", "China", "Colombia", "Comoros", 
    "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", 
    "Dominica", "Ecuador", "Egypt", "El Salvador", "Eritrea", "Estonia", "Ethiopia", "Fiji", 
    "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", 
    "Guinea", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", 
    "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", 
    "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg", "Madagascar", 
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", 
    "Monaco", "Mongolia", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", 
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", 
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", 
    "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Singapore", "Slovakia", 
    "Slovenia", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", 
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tunisia", "Turkey", 
    "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
    "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const backdrop = document.getElementById('backdrop');
const closeMenu = document.getElementById('closeMenu');
const backToTop = document.getElementById('backToTop');
const chatButton = document.getElementById('chatButton');
const comingSoonModal = document.getElementById('comingSoonModal');
const countrySelect = document.getElementById('countrySelect');
const stateSelect = document.getElementById('stateSelect');
const stateGroup = document.getElementById('stateGroup');
const countryWrapper = document.getElementById('countryWrapper');
const countryError = document.getElementById('countryError');
const postalHint = document.getElementById('postalHint');
const header = document.querySelector('.header');

let countryCodeMap = {};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        html.setAttribute('data-theme', currentTheme);
    }
    
    // Load countries for form
    loadCountries();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add scroll listener for header shadow
    window.addEventListener('scroll', handleHeaderScroll);
});

// ============================================
// THEME / DARK MODE
// ============================================

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ============================================
// NAVIGATION & MOBILE MENU
// ============================================

function toggleMenu() {
    mobileMenu.classList.toggle('active');
    backdrop.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

menuToggle.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);
backdrop.addEventListener('click', toggleMenu);

function toggleSubmenu() {
    const submenu = document.getElementById('mobileSubmenu');
    const icon = document.getElementById('submenuIcon');
    submenu.classList.toggle('active');
    
    if (submenu.classList.contains('active')) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

function toggleDesktopDropdown() {
    const dropdown = document.getElementById('desktopDropdown');
    const currentOpacity = window.getComputedStyle(dropdown).opacity;
    
    if (currentOpacity === '0') {
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0)';
    } else {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(10px)';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const desktopDropdown = document.getElementById('desktopDropdown');
    if (!e.target.closest('.nav-item') || !e.target.closest('.nav-item').querySelector('.dropdown-menu')) {
        if (desktopDropdown) {
            desktopDropdown.style.opacity = '0';
            desktopDropdown.style.visibility = 'hidden';
            desktopDropdown.style.transform = 'translateY(10px)';
        }
    }
});

// ============================================
// SCROLL EFFECTS
// ============================================

function handleHeaderScroll() {
    // Header shadow on scroll
    header.style.boxShadow = window.scrollY > 10 
        ? '0 2px 20px rgba(0,0,0,0.1)' 
        : '0 2px 10px rgba(0,0,0,0.05)';
    
    // Back to top button visibility
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ============================================
// MODALS
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.classList.add('modal-open');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.classList.remove('modal-open');
}

function closeModalOnBackdrop(event, modalId) {
    if (event.target === document.getElementById(modalId)) {
        closeModal(modalId);
    }
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.classList.remove('modal-open');
        comingSoonModal.classList.remove('active');
    }
});

// ============================================
// CHAT WIDGET
// ============================================

chatButton.addEventListener('click', () => {
    comingSoonModal.classList.add('active');
});

function closeComingSoon() {
    comingSoonModal.classList.remove('active');
}

comingSoonModal.addEventListener('click', (e) => {
    if (e.target === comingSoonModal) {
        closeComingSoon();
    }
});

// ============================================
// FORM HANDLING - COUNTRY & STATE LOADING
// ============================================

async function loadCountries() {
    countryWrapper.classList.add('loading');
    countryError.classList.remove('show');
    countrySelect.innerHTML = '<option value="" disabled selected>Loading countries...</option>';
    
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/iso');
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Invalid data format');
        }

        const countries = data.data.sort((a, b) => a.name.localeCompare(b.name));
        
        countrySelect.innerHTML = '<option value="" disabled selected>Select Country/Territory*</option>';
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name;
            option.textContent = country.name;
            option.dataset.iso2 = country.Iso2;
            option.dataset.iso3 = country.Iso3;
            countrySelect.appendChild(option);
            
            countryCodeMap[country.name] = country.Iso2;
        });
        
        countryWrapper.classList.remove('loading');
        
    } catch (error) {
        console.error('Primary API failed, trying fallback:', error);
        
        try {
            const backupResponse = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3');
            const countries = await backupResponse.json();
            
            countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
            
            countrySelect.innerHTML = '<option value="" disabled selected>Select Country/Territory*</option>';
            
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                option.dataset.iso2 = country.cca2;
                option.dataset.iso3 = country.cca3;
                countrySelect.appendChild(option);
                countryCodeMap[country.name.common] = country.cca2;
            });
            
            countryWrapper.classList.remove('loading');
            
        } catch (backupError) {
            console.error('Both APIs failed, using static list:', backupError);
            useFallbackCountries();
        }
    }
}

function useFallbackCountries() {
    countryWrapper.classList.remove('loading');
    countrySelect.innerHTML = '<option value="" disabled selected>Select Country/Territory*</option>';
    
    fallbackCountries.sort().forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
    
    countryError.innerHTML = 'Using offline country list. <button type="button" class="retry-btn" onclick="loadCountries()">Try Online</button>';
    countryError.classList.add('show');
}

async function loadStates(countryName) {
    stateSelect.disabled = true;
    stateSelect.innerHTML = '<option value="" disabled selected>Loading states...</option>';
    stateGroup.style.display = 'block';
    
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: countryName })
        });
        
        const data = await response.json();
        
        if (data.data && data.data.states && data.data.states.length > 0) {
            stateSelect.innerHTML = '<option value="" disabled selected>Select State/Province</option>';
            data.data.states.forEach(state => {
                const option = document.createElement('option');
                option.value = state.name;
                option.textContent = state.name;
                stateSelect.appendChild(option);
            });
            stateSelect.disabled = false;
        } else {
            throw new Error('No states found');
        }
    } catch (error) {
        console.log('No states available for this country or API error:', error);
        stateGroup.style.display = 'none';
    }
}

// Country selection change handler
countrySelect.addEventListener('change', async (e) => {
    const countryName = e.target.value;
    
    const countryToCode = {
        'United States': 'US', 'United Kingdom': 'GB', 'Canada': 'CA', 'Australia': 'AU',
        'Germany': 'DE', 'France': 'FR', 'India': 'IN', 'China': 'CN', 'Brazil': 'BR',
        'Japan': 'JP', 'Uganda': 'UG', 'Kenya': 'KE', 'Tanzania': 'TZ', 'Rwanda': 'RW',
        'South Africa': 'ZA', 'Nigeria': 'NG', 'United Arab Emirates': 'AE'
    };
    
    const code = countryToCode[countryName] || '';
    
    // Update postal code hint based on country
    if (code === 'US') postalHint.textContent = 'Format: 12345 or 12345-6789';
    else if (code === 'GB') postalHint.textContent = 'Format: SW1A 1AA';
    else if (code === 'CA') postalHint.textContent = 'Format: K1A 0B1';
    else if (code === 'UG') postalHint.textContent = 'No postal code required';
    else postalHint.textContent = 'Enter your postal/ZIP code';
    
    await loadStates(countryName);
});

// ============================================
// FORM SUBMISSION
// ============================================

function handleSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalContent = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    setTimeout(() => {
        alert('Thank you for your submission. We will get in touch with you as soon as possible.');
        e.target.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        stateGroup.style.display = 'none';
        postalHint.textContent = '';
    }, 1500);
}

// Make functions available globally for HTML onclick attributes
window.toggleDesktopDropdown = toggleDesktopDropdown;
window.toggleSubmenu = toggleSubmenu;
window.openModal = openModal;
window.closeModal = closeModal;
window.closeModalOnBackdrop = closeModalOnBackdrop;
window.closeComingSoon = closeComingSoon;
window.loadCountries = loadCountries;
window.handleSubmit = handleSubmit;