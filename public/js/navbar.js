document.addEventListener('DOMContentLoaded', function() {
    // Get navbar elements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    
    if (navbarToggler && navbarCollapse) {
        // Optimize toggler click handling
        navbarToggler.addEventListener('click', function() {
            // Use requestAnimationFrame for smoother toggling
            requestAnimationFrame(() => {
                // Add hardware acceleration
                navbarCollapse.style.transform = 'translateZ(0)';
            });
        });
        
        // Optimize dropdown positioning on mobile
        const userDropdown = document.getElementById('userDropdown');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (userDropdown && dropdownMenu) {
            userDropdown.addEventListener('click', function(e) {
                // Ensure dropdown is properly positioned on mobile
                if (window.innerWidth < 768) {
                    const rect = userDropdown.getBoundingClientRect();
                    const rightEdge = window.innerWidth - rect.right;
                    
                    // Adjust dropdown position if needed
                    if (rightEdge < 100) {
                        dropdownMenu.style.right = '0';
                        dropdownMenu.style.left = 'auto';
                    }
                }
            });
        }
    }
    
    // Optimize page transitions
    document.querySelectorAll('a.nav-link, .dropdown-item').forEach(link => {
        link.addEventListener('click', function() {
            // Add a small delay to allow the click effect to complete
            if (!this.getAttribute('href').startsWith('#')) {
                this.classList.add('clicked');
            }
        });
    });
});