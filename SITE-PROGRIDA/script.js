const menuToggle = document.querySelector("#menu-toggle");
const menuNav = document.querySelector("#menu-nav");
const fundo = document.querySelector("#fundo");

//sistema de abrir e fechar o menu
menuToggle.addEventListener("click", () => {
    menuNav.classList.toggle("active");
    fundo.style.display = menuNav.classList.contains("active") ? "block" : "none";
});

fundo.addEventListener("click", () => {
    menuNav.classList.remove("active");
    fundo.style.display = "none";
});

document.addEventListener("click", (event) => {
    const clicouForaDoMenu = !menuNav.contains(event.target);
    const clicouNoToggle = menuToggle.contains(event.target);

    if (clicouForaDoMenu && !clicouNoToggle) {
        menuNav.classList.remove("active");
    }
});

