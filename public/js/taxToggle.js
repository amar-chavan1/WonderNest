document.addEventListener('DOMContentLoaded', function() {
    const taxSwitch = document.getElementById('flexSwitchCheckDefault');
    // Select all the listing card links, as they hold the data-price
    const listingCardLinks = document.querySelectorAll('.listing-card-link'); 

    // Define your tax rate (e.g., 18% GST for services in India)
    const TAX_RATE = 0.18; 

    function updatePrices() {
        const isTaxOn = taxSwitch.checked; // Check if the switch is toggled ON

        listingCardLinks.forEach(link => {
            // Get the original base price from the data-price attribute
            const basePrice = parseFloat(link.dataset.price); 
            // Find the specific span within this card to update its price display
            const priceDisplaySpan = link.querySelector('.listing-price-display'); 

            if (isNaN(basePrice)) {
                // Basic error handling for cases where data-price might be missing or invalid
                console.warn("Invalid base price found for a listing card:", link);
                return;
            }

            let displayHtml = `<b>&#8377 ${basePrice.toLocaleString("en-IN")}</b> per night`;

            if (isTaxOn) {
                const taxAmount = basePrice * TAX_RATE;
                const totalPrice = basePrice + taxAmount;
                displayHtml = `
                    <span class="original-price text-muted">&#8377 ${basePrice.toLocaleString("en-IN")}</span> + ${TAX_RATE * 100}% GST <br>
                    <b>&#8377 ${totalPrice.toLocaleString("en-IN")}</b> total
                `;
            }
            priceDisplaySpan.innerHTML = displayHtml; // Update the HTML content
        });
    }

    // Add an event listener to the tax switch
    taxSwitch.addEventListener('change', updatePrices);

    // Optional: Call updatePrices once when the page loads if you want to apply tax immediately
    // if the switch is initially checked (e.g., if you add 'checked' attribute in EJS).
    // updatePrices(); 
});