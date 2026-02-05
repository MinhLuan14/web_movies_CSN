/**
 * TỔNG HỢP JS CHO USER & TICKET - POPCINE
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Khởi tạo User Profile (Header & Sidebar)
    loadUserProfile();

    // 2. Kiểm tra và Render dữ liệu vé (Tự động nhận diện trang)
    renderSingleTicket(); // Dành cho trang ticket.html
    renderUserHistory();  // Dành cho trang user.html

    // 3. Khởi tạo các sự kiện Click (Logout, Form)
    initUserActions();

    // 4. Kích hoạt hệ thống chuyển Tab Sidebar
    initTabSystem();
});

// --- HÀM LẤY DỮ LIỆU CHUNG ---
const getBookedTickets = () => JSON.parse(localStorage.getItem('bookedTickets')) || [];

/**
 * Hệ thống chuyển tab Sidebar (Xử lý lỗi không bấm được Nav)
 */
function initTabSystem() {
    const navLinks = document.querySelectorAll('.nav-link[data-target]');
    const tabContents = document.querySelectorAll('.tab-content');

    if (navLinks.length === 0) return; // Nếu không phải trang User thì bỏ qua

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');

            // Xóa trạng thái active cũ
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Kích hoạt tab mới
            link.classList.add('active');
            const targetTab = document.getElementById(target);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

/**
 * Đổ dữ liệu người dùng ra Header và Form
 */
function loadUserProfile() {
    const savedName = localStorage.getItem('userName') || "Khách hàng";

    // Update các vị trí hiển thị tên
    const elements = {
        displayName: document.getElementById('display-name'),
        fullNameInput: document.getElementById('full-name'),
        navName: document.getElementById('display-name-nav'),
        navAvatar: document.getElementById('nav-avatar'),
        loginWrapper: document.getElementById('btn-login-wrapper'),
        userProfileNav: document.getElementById('user-profile-nav')
    };

    if (elements.displayName) elements.displayName.innerText = savedName;
    if (elements.fullNameInput) elements.fullNameInput.value = savedName;
    if (elements.navName) elements.navName.innerText = savedName;

    if (elements.navAvatar) {
        elements.navAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(savedName)}&background=f5b400&color=000&bold=true`;
    }

    if (elements.loginWrapper) elements.loginWrapper.style.display = 'none';
    if (elements.userProfileNav) elements.userProfileNav.style.display = 'flex';
}

/**
 * RENDER LỊCH SỬ VÉ CHO TRANG USER.HTML
 */
function renderUserHistory() {
    const historyContainer = document.getElementById('tickets-user-list');
    if (!historyContainer) return;

    const tickets = getBookedTickets();
    if (tickets.length === 0) {
        historyContainer.innerHTML = '<div class="empty-msg">Bạn chưa có lịch sử đặt vé.</div>';
        return;
    }

    const html = [...tickets].reverse().map(ticket => `
        <div class="ticket-item">
            <div class="ticket-poster">
                <img src="${ticket.poster || '../assets/img/default-poster.jpg'}" alt="${ticket.title}">
            </div>
            <div class="ticket-info">
                <span class="ticket-id">#${ticket.ticketId}</span>
                <h4 class="movie-title">${ticket.title}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${ticket.cinema}</p>
                <p><i class="far fa-calendar-alt"></i> ${ticket.date} | ${ticket.time}</p>
                <p><i class="fas fa-couch"></i> Ghế: <strong>${ticket.selectedSeats?.map(s => s.name).join(', ') || ticket.seats}</strong></p>
            </div>
            <div class="ticket-status-wrapper">
                <div class="qr-mini">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.ticketId}">
                </div>
                <span class="status-badge coming">Hợp lệ</span>
            </div>
        </div>
    `).join('');

    historyContainer.innerHTML = html;
}

/**
 * RENDER VÉ CHO TRANG TICKET.HTML (Vé vừa đặt)
 */
function renderSingleTicket() {
    const container = document.getElementById('single-ticket-container');
    if (!container) return;

    const tickets = getBookedTickets();
    if (tickets.length === 0) {
        container.innerHTML = "<p>Không tìm thấy thông tin vé.</p>";
        return;
    }

    const ticket = tickets[tickets.length - 1]; // Lấy vé cuối cùng

    container.innerHTML = `
        <div class="ticket-main-card">
            <div class="ticket-header">
                <img src="${ticket.poster}" alt="${ticket.title}">
                <h2>${ticket.title}</h2>
            </div>
            <div class="ticket-body">
                <p><strong>Rạp:</strong> ${ticket.cinema}</p>
                <p><strong>Suất chiếu:</strong> ${ticket.time} | ${ticket.date}</p>
                <p><strong>Ghế:</strong> ${ticket.selectedSeats?.map(s => s.name).join(', ') || ticket.seats}</p>
                <div class="qr-large">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.ticketId}">
                    <span style="display:block; margin-top:10px; font-weight:bold;">${ticket.ticketId}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Gán sự kiện Logout và Cập nhật hồ sơ
 */
function initUserActions() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedName = document.getElementById('full-name').value;
            localStorage.setItem('userName', updatedName);
            alert('Cập nhật thông tin thành công!');
            location.reload();
        });
    }

    document.addEventListener('click', (e) => {
        const logoutBtn = e.target.closest('#btn-logout');
        if (logoutBtn) {
            e.preventDefault();
            if (confirm('Bạn có muốn đăng xuất?')) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userName');
                window.location.href = '../index.html';
            }
        }
    });
}