
document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('image');
    const newImagePreviewContainer = document.getElementById('newImagePreviewContainer');
    const newImagePreview = document.getElementById('newImagePreview');
    const viewNewImageBtn = document.getElementById('viewNewImageBtn');
    const imageModal = document.getElementById('imageModal'); // The modal element itself
    const modalImage = document.getElementById('modalImage'); // The image inside the modal

    // --- Functionality for Newly Chosen Image ---
    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0]; // Get the first file chosen

        if (file) {
            const reader = new FileReader(); // FileReader to read the local file

            reader.onload = function (e) {
                newImagePreview.src = e.target.result; // Set the src of the small preview image
                viewNewImageBtn.setAttribute('data-image-url', e.target.result); // Set the URL for the modal button
                newImagePreviewContainer.classList.remove('d-none'); // Show the preview container
            };

            reader.readAsDataURL(file); // Read the file as a Data URL (base64 encoded string)
        } else {
            // If no file is selected (e.g., user cancels file selection)
            newImagePreview.src = ''; // Clear the preview image source
            viewNewImageBtn.removeAttribute('data-image-url'); // Remove the URL from the button
            newImagePreviewContainer.classList.add('d-none'); // Hide the preview container
        }
    });

    // --- Functionality for Dynamic Modal Image Loading ---
    // Listen for Bootstrap's 'show.bs.modal' event
    imageModal.addEventListener('show.bs.modal', function (event) {
        // Get the button that triggered the modal (either "View Current" or "View Chosen")
        const button = event.relatedTarget;
        // Get the image URL from the 'data-image-url' attribute of the clicked button
        const imageUrl = button.getAttribute('data-image-url');

        // Set the src of the image inside the modal
        if (imageUrl) {
            modalImage.src = imageUrl;
        } else {
            modalImage.src = ''; // Clear if no URL found
            console.warn("No image URL found for modal.");
        }
    });

    // Optional: Clear the modal image source when the modal is hidden
    // This prevents the old image from briefly flashing if the modal is reopened
    imageModal.addEventListener('hidden.bs.modal', function () {
        modalImage.src = '';
    });
});
