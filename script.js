let currentTurns = 1;
let canPick = false;

// 1. Hàm khởi động
function startApp() {
    // Kích hoạt nhạc
    const iframe = document.getElementById('yt-player');
    iframe.src += "&autoplay=1";
    
    // Ẩn màn hình chờ, hiện bao to
    document.getElementById('entry-overlay').style.display = 'none';
    document.getElementById('big-lixi-container').style.display = 'block';
    document.getElementById('msg').innerText = "✨ Chạm bao lì xì để khai lộc ✨";
}

// 2. Hàm nổ tung bao lì xì
function explode() {
    const bigLixi = document.getElementById('big-lixi-container');
    bigLixi.style.pointerEvents = 'none';
    
    // Âm thanh & Hiệu ứng sáng
    document.getElementById('sfx-explode').play();
    const flash = document.getElementById('flash-overlay');
    flash.style.opacity = '0.8';
    setTimeout(() => flash.style.opacity = '0', 150);

    // Animation biến mất
    bigLixi.style.transition = "all 0.2s";
    bigLixi.style.transform = "translate(-50%, -50%) scale(1.5)";
    bigLixi.style.opacity = '0';
    setTimeout(() => bigLixi.style.display = 'none', 200);

    // Bắn pháo hoa
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });

    // Tạo lưới game sau 1 giây
    setTimeout(() => {
        createGrid();
        document.getElementById('grid').style.opacity = '1';
        document.getElementById('msg').innerText = "👉 Chọn 1 bao lì xì may mắn!";
        canPick = true;
    }, 1000);
}

// 3. Tạo lưới 9 bao lì xì
function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for(let i=0; i<9; i++) {
        const item = document.createElement('div');
        item.className = 'lixi-item';
        item.onclick = () => pick(item);
        grid.appendChild(item);
    }
}

// 4. Xử lý khi chọn bao
function pick(el) {
    if(!canPick || currentTurns <= 0) return;
    
    // Trừ lượt
    currentTurns--;
    updateTurnDisplay();
    
    // Hiệu ứng mở
    el.classList.add('opening');
    el.style.pointerEvents = 'none'; 

    // --- LOGIC TỶ LỆ ---
    const rate = Math.floor(Math.random() * 100) + 1;
    let gift = "";
    let isBonus = false;

    // 40%: 10k | 30%: 20k | 15%: Lời chúc | 10%: Thêm lượt | 5%: 50k
    if (rate <= 40) {
        gift = "10.000 VNĐ";
        document.getElementById('sfx-open').play();
    } else if (rate <= 70) {
        gift = "20.000 VNĐ";
        document.getElementById('sfx-open').play();
    } else if (rate <= 85) {
        gift = "Chúc Mừng<br>Năm Mới 🌸"; 
        document.getElementById('sfx-open').play();
    } else if (rate <= 95) {
        gift = "Thêm 1 lượt 🎲"; 
        isBonus = true;
        document.getElementById('sfx-bonus').play();
    } else {
        gift = "50.000 VNĐ 💎";
        document.getElementById('sfx-open').play();
    }

    // Xử lý thêm lượt
    if (isBonus) {
        currentTurns += 2; // +1 trả lại, +1 thưởng
        updateTurnDisplay();
    }

    // Hiện kết quả
    setTimeout(() => {
        const modalTitle = document.getElementById('modal-title');
        if (isBonus) {
            modalTitle.innerText = "🎉 MAY MẮN QUÁ 🎉";
            modalTitle.style.color = "#00c853";
        } else {
            modalTitle.innerText = "🎉 KẾT QUẢ 🎉";
            modalTitle.style.color = "#b30000";
        }

        document.getElementById('reward').innerHTML = gift;
        
        const btn = document.getElementById('modal-btn');
        if (currentTurns <= 0) {
            btn.innerText = "Hết lượt rồi!";
            btn.onclick = () => location.reload();
        } else {
            btn.innerText = "Chơi tiếp";
            btn.onclick = () => closeModal();
        }

        document.getElementById('result-modal').style.display = 'flex';
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }, 600);
}

function closeModal() {
    document.getElementById('result-modal').style.display = 'none';
}

function updateTurnDisplay() {
    document.getElementById('turn-cnt').innerText = currentTurns;
}