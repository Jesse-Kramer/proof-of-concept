document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-item');

    // Function to update the state of buttons on all slides
    function updateButtonStates() {
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

    // Function to handle click on previous button
    function prevSlide(event) {
        const currentSlide = event.target.closest('.carousel-item');
        const prevSlide = currentSlide.previousElementSibling;

        if (prevSlide) {
            if (!document.startViewTransition) {
                currentSlide.classList.remove('active');
                prevSlide.classList.add('active');
                updateButtonStates();
                return;
            }

            // With a transition:
            document.startViewTransition({
                update: () => {
                    currentSlide.classList.remove('active');
                    prevSlide.classList.add('active');
                },
                types: ['backwards'],
            }).then(() => updateButtonStates());
        }
    }

    // Function to handle click on next button
    function nextSlide(event) {
        const currentSlide = event.target.closest('.carousel-item');
        const nextSlide = currentSlide.nextElementSibling;

        if (nextSlide) {
            if (!document.startViewTransition) {
                currentSlide.classList.remove('active');
                nextSlide.classList.add('active');
                updateButtonStates();
                return;
            }

            // With a transition:
            document.startViewTransition({
                update: () => {
                    currentSlide.classList.remove('active');
                    nextSlide.classList.add('active');
                },
                types: ['forwards'],
            }).then(() => updateButtonStates());
        }
    }

    // Attach click event listeners to previous buttons
    slides.forEach(slide => {
        const prevBtn = slide.querySelector('.carousel-btn.prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
    });

    // Attach click event listeners to next buttons
    slides.forEach(slide => {
        const nextBtn = slide.querySelector('.carousel-btn.next');
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
    });

    // Initial update of button states for the first slide
    updateButtonStates();
});
