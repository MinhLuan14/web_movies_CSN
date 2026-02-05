// 1. Danh sách 10 tấm ảnh của Luân (thay link ảnh thật vào đây)
const promoImages = [
    '/assets/img/tickets/compo1.png',
    '/assets/img/tickets/compo2.png',
    '/assets/img/tickets/compo3.png',
    '/assets/img/tickets/compoalone.png',
    '/assets/img/tickets/popcine.png',
    '/assets/img/tickets/roomvip.png',
    '/assets/img/tickets/ticket50.png',
    '/assets/img/tickets/ticketgol.png',
    '/assets/img/tickets/ticketstudents.png',
    '/assets/img/tickets/tsicketsnack.png'
];

function renderRandomPromos() {
    const container = document.getElementById('promoContainer');
    if (!container) return;
    container.innerHTML = '';

    const shuffled = [...promoImages].sort(() => 0.5 - Math.random());
    const selectedImages = shuffled.slice(0, 4); // Thay đổi ở đây

    // Cập nhật trong vòng lặp selectedImages.forEach
    selectedImages.forEach((imgSrc, index) => {
        const card = document.createElement('div');
        card.className = `promo-card`;
        // Thêm delay cho từng thẻ dựa trên index
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
        <img src="${imgSrc}" class="promo-img-auto" onload="this.classList.add('loaded')">
        <div class="promo-glow"></div>
    `;
        container.appendChild(card);
    });
}

// 4. Thiết lập tự động đổi ảnh sau mỗi 5 giây
setInterval(renderRandomPromos, 5000);

// Chạy lần đầu khi load trang
document.addEventListener('DOMContentLoaded', renderRandomPromos);