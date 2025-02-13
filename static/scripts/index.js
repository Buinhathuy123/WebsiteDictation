// Hàm chuyển đổi Dark Mode
function toggleDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Chuyển đổi class dark-mode trên body
    body.classList.toggle('dark-mode');

    // Thay đổi biểu tượng và lưu trạng thái Dark Mode vào localStorage
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Biểu tượng mặt trời (Light Mode)
        localStorage.setItem('darkMode', 'enabled'); // Lưu trạng thái Dark Mode
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Biểu tượng mặt trăng (Dark Mode)
        localStorage.setItem('darkMode', 'disabled'); // Lưu trạng thái Light Mode
    }
}

// Kiểm tra trạng thái Dark Mode khi tải trang
function checkDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Nếu Dark Mode đã được kích hoạt trước đó
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Biểu tượng mặt trời (Light Mode)
    } else {
        body.classList.remove('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Biểu tượng mặt trăng (Dark Mode)
    }
}

// Gắn sự kiện cho nút Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

// Kiểm tra Dark Mode khi trang được tải
window.addEventListener('load', checkDarkMode);