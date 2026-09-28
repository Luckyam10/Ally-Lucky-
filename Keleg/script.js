/* =========================================================
   CINEMATIC PAGE TRANSITIONS
========================================================= */

const transition = document.getElementById("pageTransition");
const transitionTitle = document.getElementById("transitionTitle");

function runPageTransition(link) {
    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!target || !transition) return;

    const title =
        (link.textContent || "OUR STORY")
        .replace("→", "")
        .trim()
        .toUpperCase();

    if (transitionTitle) {
        transitionTitle.textContent = title;
    }

    transition.classList.remove("exit");
    transition.classList.add("active");

    setTimeout(() => {
        target.scrollIntoView({
            behavior: "instant",
            block: "start"
        });
    }, 500);

    setTimeout(() => {
        transition.classList.add("exit");

        setTimeout(() => {
            transition.classList.remove("active", "exit");
        }, 1100);

    }, 700);
}


/* Navigation */

document.querySelectorAll(".navlinks a, .hero-actions a").forEach(link => {

    link.addEventListener("click", event => {

        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) {
            return;
        }

        const target = document.querySelector(href);

        if (!target) {
            return;
        }

        event.preventDefault();

        runPageTransition(link);

    });

});


/* Logo returns home */

const logo = document.querySelector(".logo");

if (logo) {

    logo.addEventListener("click", event => {

        const href = logo.getAttribute("href");

        if (href !== "#home") return;

        const target = document.querySelector("#home");

        if (!target) return;

        event.preventDefault();

        runPageTransition(logo);

    });

}


/* =========================================================
   MEMORY DATA
========================================================= */

const memories = [

    {
        file: "Capture.jpg",
        label: "our first chapter"
    },

    {
        file: "Capture1.jpg",
        label: "late afternoon"
    },

    {
        file: "Capture2.jpg",
        label: "somewhere new"
    },

    {
        file: "Capture3.jpg",
        label: "just us"
    },

    {
        file: "Capture4.jpg",
        label: "little adventures"
    },

    {
        file: "Capture5.jpg",
        label: "one of those nights"
    }

];


/* =========================================================
   ADVENTURE PHOTOS
========================================================= */

const adventureMemories = [

    {
        file: "Capture6.jpg",
        label: "the place we went"
    },

    {
        file: "Capture7.jpg",
        label: "somewhere with you"
    },

    {
        file: "Capture8.jpg",
        label: "a day worth remembering"
    }

];


/* Combine both galleries */

const allPhotos = [
    ...memories,
    ...adventureMemories
];


/* =========================================================
   LIGHTBOX
========================================================= */

const lightbox = document.getElementById("lightbox");
const viewer = document.querySelector(".viewer");
const viewerImage = document.getElementById("viewerImage");
const viewerLabel = document.getElementById("viewerLabel");

const closeButton = document.querySelector(".close");
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

let current = 0;


/* Load image */

function loadImage(file) {

    if (!viewerImage) return;

    viewerImage.src = "assets/images/" + file;

    viewerImage.onerror = function () {

        console.warn("Could not load:", file);

    };

}


/* Open memory */

function openMemory(index) {

    if (!lightbox || !viewer || !viewerImage) {
        return;
    }

    current = (index + allPhotos.length) % allPhotos.length;

    const photo = allPhotos[current];

    /* Remove old animation */

    viewer.classList.remove("show");
    viewer.classList.remove("changing");

    /* Force animation restart */

    void viewer.offsetWidth;

    setTimeout(() => {

        loadImage(photo.file);

        if (viewerLabel) {
            viewerLabel.textContent = photo.label;
        }

        lightbox.classList.add("open");

        requestAnimationFrame(() => {

            viewer.classList.add("show");

        });

    }, 100);

}


/* Close memory */

function closeMemory() {

    if (!lightbox || !viewer) return;

    viewer.classList.remove("show");

    setTimeout(() => {

        lightbox.classList.remove("open");

    }, 400);

}


/* =========================================================
   GALLERY CLICK EVENTS
========================================================= */

document.querySelectorAll(".memory").forEach(card => {

    card.addEventListener("click", event => {

        event.preventDefault();

        const index = Number(card.dataset.index);

        openMemory(index);

    });

});


/* =========================================================
   ADVENTURE PHOTO CLICK EVENTS
========================================================= */

document.querySelectorAll(".adventure-photo").forEach(card => {

    card.addEventListener("click", event => {

        event.preventDefault();

        const file = card.dataset.image;

        if (!file) return;

        const index = allPhotos.findIndex(photo => photo.file === file);

        if (index !== -1) {

            openMemory(index);

        }

    });

});


/* =========================================================
   BUTTONS
========================================================= */

if (closeButton) {

    closeButton.addEventListener("click", closeMemory);

}

if (nextButton) {

    nextButton.addEventListener("click", () => {

        openMemory(current + 1);

    });

}

if (prevButton) {

    prevButton.addEventListener("click", () => {

        openMemory(current - 1);

    });

}


/* Clicking outside image closes lightbox */

if (lightbox) {

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {

            closeMemory();

        }

    });

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener("keydown", event => {

    if (!lightbox || !lightbox.classList.contains("open")) {
        return;
    }

    if (event.key === "Escape") {

        closeMemory();

    }

    if (event.key === "ArrowRight") {

        openMemory(current + 1);

    }

    if (event.key === "ArrowLeft") {

        openMemory(current - 1);

    }

});


/* =========================================================
   MOBILE SWIPE
========================================================= */

let startX = 0;

if (lightbox) {

    lightbox.addEventListener("touchstart", event => {

        startX = event.touches[0].clientX;

    }, { passive: true });


    lightbox.addEventListener("touchend", event => {

        const endX = event.changedTouches[0].clientX;

        const difference = endX - startX;

        if (Math.abs(difference) < 50) {
            return;
        }

        if (difference < 0) {

            openMemory(current + 1);

        } else {

            openMemory(current - 1);

        }

    }, { passive: true });

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("reveal-in");

                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


document
    .querySelectorAll(
        "section, .film-feature, .film-cards article, .memory, .adventure-photo"
    )
    .forEach(element => {

        element.classList.add("reveal-ready");

        observer.observe(element);

    });


/* =========================================================
   IMAGE PARALLAX / HOVER EFFECT
========================================================= */

document.querySelectorAll(".memory, .adventure-photo").forEach(card => {

    card.addEventListener("mousemove", event => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -2;
        const rotateY = ((x - centerX) / centerX) * 2;

        card.style.setProperty(
            "--rotate-x",
            `${rotateX}deg`
        );

        card.style.setProperty(
            "--rotate-y",
            `${rotateY}deg`
        );

    });


    card.addEventListener("mouseleave", () => {

        card.style.setProperty("--rotate-x", "0deg");
        card.style.setProperty("--rotate-y", "0deg");

    });

});