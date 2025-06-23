
const stars = document.querySelectorAll('#starRating i');
const ratingInput = document.getElementById('ratingInput');

function setRating(rating) {
    ratingInput.value = rating;

    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('fa-regular');
            star.classList.add('fa-solid');
        } else {
            star.classList.remove('fa-solid');
            star.classList.add('fa-regular');
        }
    });
}

// Set default rating to 1 when page loads
document.addEventListener('DOMContentLoaded', () => {
    setRating(1);
});

// Handle star click events
stars.forEach((star) => {
    star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-value'));
        setRating(rating);
    });
});

// 💬 Comment Character Count Logic
const commentInput = document.getElementById('comment');
const charCount = document.getElementById('charCount');

if (commentInput && charCount) {
    commentInput.addEventListener('input', () => {
        const len = commentInput.value.length;
        charCount.textContent = len;

        // Optional: Add visual warning if approaching limit
        if (len > 180) {
            charCount.style.color = '#dc3545'; // Bootstrap danger red
        } else {
            charCount.style.color = '#6c757d'; // Bootstrap muted gray
        }
    });
}

