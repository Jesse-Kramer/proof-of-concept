const carouselContainer = document.querySelector('.carousel-container');
const slides = document.querySelectorAll(".carousel-item");
const prevButtons = document.querySelectorAll(".carousel-btn.prev");
const nextButtons = document.querySelectorAll(".carousel-btn.next");
if (document.startViewTransition) {
    carouselContainer.classList.add('cando-vt');
}

function updateButtonState(prevButton, nextButton) {
    if (!document.startViewTransition) {
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
    } else {
        slides.forEach(slide => {
            const prevBtn = slide.querySelector('.carousel-btn.prev');
            const nextBtn = slide.querySelector('.carousel-btn.next');
            const prevSlide = slide.previousElementSibling;
            const nextSlide = slide.nextElementSibling;

            if (prevBtn) {
                prevBtn.disabled = !prevSlide;
            }

            if (nextBtn) {
                nextBtn.disabled = !nextSlide;
            }
        });
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
            if (!document.startViewTransition) {
                carouselContainer.scrollBy({
                    left: -carouselContainer.offsetWidth,
                    behavior: 'smooth'
                });
            }

            const prevSlide = slide.previousElementSibling;
            // With a transition:
            document.startViewTransition({
                update: () => {
                    slide.classList.remove('active');
                    prevSlide.classList.add('active');
                },
                types: ['backwards'],
            })
        }
    });

    nextButton.addEventListener('click', function() {
        if (carouselContainer.scrollLeft + carouselContainer.clientWidth < carouselContainer.scrollWidth) {
            if (!document.startViewTransition) {
                carouselContainer.scrollBy({
                    left: carouselContainer.offsetWidth,
                    behavior: 'smooth'
                });
                return;
            }

            const nextSlide = slide.nextElementSibling;
            // With a transition:
            document.startViewTransition({
                update: () => {
                    slide.classList.remove('active');
                    nextSlide.classList.add('active');
                },
                types: ['forwards'],
            })
        }
    });
});