const menuToggle = document.querySelector("#menu-toggle");
const menuNav = document.querySelector("#menu-nav");

menuToggle.addEventListener("click", () => {
    menuNav.classList.toggle("active");
});

document.addEventListener("click", (event) => {
    const clicouForaDoMenu = !menuNav.contains(event.target);
    const clicouNoToggle = menuToggle.contains(event.target);

    if (clicouForaDoMenu && !clicouNoToggle) {
        menuNav.classList.remove("active");
    }
});