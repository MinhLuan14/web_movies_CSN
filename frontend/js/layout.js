fetch('components/header.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
    });

document.addEventListener('click', function (e) {
    const btnBar = e.target.closest('.fa-bars');
    const iconMenu = document.querySelector('.icon-menu');
    if (btnBar) {
        e.stopPropagation();
        iconMenu.classList.toggle('active');
        console.log("Đã toggle menu!");
    } else if (iconMenu && !iconMenu.contains(e.target)) {
        iconMenu.classList.remove('active');
    }

});
window.onscroll = function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
fetch('pages/home.html')
    .then(res => res.text())
    .then(html => document.getElementById('content').innerHTML = html);
fetch('components/footer.html')
    .then(res => res.text())
    .then(html => document.getElementById('footer').innerHTML = html);

