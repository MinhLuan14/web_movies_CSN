const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const cols = 14;
const prices = { standard: 80000, vip: 110000, double: 160000 };

const seatsGrid = document.getElementById('seats-grid');
const rowLabels = document.getElementById('row-labels');
const btnCheckout = document.getElementById('btn-checkout');

// --- HÀM MỚI: Lấy danh sách ghế đã bán từ LocalStorage ---
function getBookedSeats() {
    const booked = localStorage.getItem('allBookedSeats');
    return booked ? JSON.parse(booked) : [];
}

function initBooking() {
    const savedData = localStorage.getItem('pendingTicket');
    const titleElement = document.getElementById('booking-movie-title');
    const movieSubInfo = document.querySelector('.movie-sub-info');

    if (savedData) {
        const ticket = JSON.parse(savedData);
        if (titleElement) titleElement.innerText = ticket.title || ticket.movieTitle;
        if (movieSubInfo) {
            movieSubInfo.innerHTML = `
                <span><i class="fas fa-film"></i> ${ticket.genres || '2D'}</span>
                <span class="divider">|</span>
                <span><i class="fas fa-map-marker-alt"></i> ${ticket.cinema || 'Rạp chưa chọn'}</span>
                <span class="divider">|</span>
                <span><i class="far fa-clock"></i> ${ticket.time || ''}</span>
                <span class="age-tag">T13</span>
            `;
        }
    }
    renderSeats();
}

function renderSeats() {
    if (!seatsGrid || !rowLabels) return;
    rowLabels.innerHTML = '';
    seatsGrid.innerHTML = '';

    // Lấy danh sách ghế đã có người đặt
    const bookedSeats = getBookedSeats();

    rows.forEach((row) => {
        const label = document.createElement('span');
        label.innerText = row;
        rowLabels.appendChild(label);

        for (let i = 1; i <= cols; i++) {
            if (row === 'J' && i > 7) continue;

            const seat = document.createElement('div');
            seat.classList.add('seat');

            let type = (row === 'J') ? 'double' : (row >= 'F' ? 'vip' : 'standard');
            seat.classList.add(type);
            seat.dataset.price = prices[type];

            // Đặt tên ghế
            const seatName = (type === 'double') ? `${row}${i * 2 - 1}-${i * 2}` : `${row}${i}`;
            seat.dataset.name = seatName;

            // --- KIỂM TRA GHẾ ĐÃ BÁN ---
            if (bookedSeats.includes(seatName)) {
                seat.classList.add('sold'); // Thêm class sold
            } else {
                // Chỉ thêm sự kiện click nếu ghế chưa bán
                seat.addEventListener('click', () => toggleSeat(seat));
            }

            seatsGrid.appendChild(seat);
        }
    });
}

function toggleSeat(seat) {
    // Không cho chọn nếu ghế đã bán (phòng hờ)
    if (seat.classList.contains('sold')) return;

    seat.classList.toggle('selecting');
    updateTotal();
}

function updateTotal() {
    const selectedSeats = document.querySelectorAll('.seat.selecting');
    const totalPriceEl = document.getElementById('total-price');
    const seatNamesEl = document.getElementById('seat-names');

    let total = 0;
    let names = [];

    selectedSeats.forEach(s => {
        total += parseInt(s.dataset.price);
        names.push(s.dataset.name);
    });

    totalPriceEl.innerText = total.toLocaleString('vi-VN') + 'đ';
    seatNamesEl.innerText = names.length > 0 ? names.join(', ') : 'Chưa có';

    btnCheckout.disabled = names.length === 0;
    btnCheckout.style.opacity = names.length === 0 ? "0.5" : "1";
}

if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        const selectedElements = document.querySelectorAll('.seat.selecting');
        const selectedNames = Array.from(selectedElements).map(s => s.dataset.name);
        const selectedData = Array.from(selectedElements).map(s => ({
            name: s.dataset.name,
            price: s.dataset.price
        }));

        // 1. Cập nhật vào danh sách ghế ĐÃ BÁN vĩnh viễn
        const bookedSeats = getBookedSeats();
        const updatedBookedSeats = [...bookedSeats, ...selectedNames];
        localStorage.setItem('allBookedSeats', JSON.stringify(updatedBookedSeats));

        // 2. Lưu thông tin vé hiện tại để sang trang thanh toán
        const oldTicket = JSON.parse(localStorage.getItem('pendingTicket')) || {};
        const finalBooking = {
            ...oldTicket,
            selectedSeats: selectedData,
            totalPrice: document.getElementById('total-price').innerText,
            bookingAt: new Date().toLocaleString()
        };

        localStorage.setItem('finalBooking', JSON.stringify(finalBooking));

        // Chuyển trang
        window.location.href = 'payment.html';
    });
}

initBooking();