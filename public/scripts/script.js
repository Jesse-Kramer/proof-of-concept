const carouselContainer = document.querySelector('.carousel-container');
const slides = document.querySelectorAll(".carousel-item");
const prevButtons = document.querySelectorAll(".carousel-btn.prev");
const nextButtons = document.querySelectorAll(".carousel-btn.next");

function updateButtonState(prevButton, nextButton) {
    if (carouselContainer.scrollLeft <= 45) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if (carouselContainer.scrollLeft + carouselContainer.clientWidth + 45 >= carouselContainer.scrollWidth) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

slides.forEach((slide, index) => {
    const prevButton = prevButtons[index];
    const nextButton = nextButtons[index];

    updateButtonState(prevButton, nextButton);

    carouselContainer.addEventListener('scroll', () => {
        updateButtonState(prevButton, nextButton);
    });

    prevButton.addEventListener('click', function() {
        if (carouselContainer.scrollLeft > 0) {
            carouselContainer.scrollBy({
                left: -carouselContainer.offsetWidth,
                behavior: 'smooth'
            });
        }
    });

    nextButton.addEventListener('click', function() {
        if (carouselContainer.scrollLeft + carouselContainer.clientWidth < carouselContainer.scrollWidth) {
            
            carouselContainer.scrollBy({
                left: carouselContainer.offsetWidth,
                behavior: 'smooth'
            });
        }
    });
});