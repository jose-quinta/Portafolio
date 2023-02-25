const tag = (sel, para) => (para || document).querySelector(sel);
// change navbar styles on scroll
window.addEventListener('scroll', () => {
    tag('.navbar').classList.toggle('window-scroll', window.scrollY > 0)
})

window.addEventListener('scroll', () => {
    tag('.btn-home').classList.toggle('btn', window.scrollY > 1)
})

tag('.btn-toogle').addEventListener('click', () => {
    tag('.menu').classList.toggle('mostrar');
})