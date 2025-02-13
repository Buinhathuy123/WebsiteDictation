let currentIndex = 0;
let audio;
let isPlaying = false;
let currentSentenceStartTime = 0;
let isTyping = false;
let currentSpeed = 1.0;
let notes = [];
let isShowingAnswer = false; // Biến kiểm tra trạng thái skip
// Hàm playAudio dành riêng cho Conversation
function playAudio() {
    if (isPlaying) return; // Nếu đang phát thì không làm gì

    fetch(`/get_sentence_conversation?index=${currentIndex}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.sentence) {
                if (audio) {
                    audio.pause(); // Dừng audio hiện tại nếu có
                }
                audio = new Audio(data.audio); // Tạo mới audio với file tương ứng
                audio.playbackRate = currentSpeed; // Áp dụng tốc độ hiện tại
                audio.play();
                isPlaying = true;
                document.getElementById('user-input').focus();
                // Tự động dừng sau khi phát xong
                audio.addEventListener('ended', () => {
                    isPlaying = false;
                });
            } else {
                showCompletionMessage(); // Hiển thị thông báo hoàn thành bài tập
            }
        });
}

// Hàm checkAnswer dành riêng cho Conversation
function checkAnswer() {
    const userInput = document.getElementById('user-input').value;
    fetch('/check_answer_conversation', { // Sử dụng endpoint của Conversation
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput, index: currentIndex }),
    })
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            const detailDiv = document.getElementById('detail');
            resultDiv.textContent = data.message;
            detailDiv.textContent = data.detail;

            if (data.correct) {
                resultDiv.style.color = "green";
                currentIndex++;
                document.getElementById('user-input').value = '';
                pauseAudio();
                playAudio();
            } else {
                resultDiv.style.color = "red";
            }
        });
}

// Hàm để dừng audio
function pauseAudio() {
    if (audio) {
        audio.pause();
        isPlaying = false;
        
    }
}

// Hàm để thay đổi tốc độ phát audio
function changeSpeed(speed) {
    if (audio) {
        audio.playbackRate = speed;
        currentSpeed = speed;
    }
}

// Hàm để chuyển đến câu trước đó
function previousSentence() {
    if (currentIndex > 0) {
        currentIndex--; // Giảm chỉ số câu hiện tại
        document.getElementById('user-input').value = ''; // Xóa nội dung textarea
        pauseAudio(); // Dừng audio hiện tại
        playAudio(); // Phát audio của câu trước đó
    } else {
        alert("Đây là câu đầu tiên!"); // Thông báo nếu đang ở câu đầu tiên
    }
}

// Hàm hiển thị thông báo hoàn thành bài tập
function showCompletionMessage() {
    // Ẩn tất cả các phần tử khác
    document.getElementById('audio-controls').classList.add('hidden');
    document.getElementById('user-input').classList.add('hidden');
    document.getElementById('submit-button').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('detail').classList.add('hidden');
    document.getElementById('play-button').classList.add('hidden');
    document.getElementById('pause-button').classList.add('hidden');
    document.getElementById('previous-button').classList.add('hidden');
    document.getElementById('speed-select').classList.add('hidden');
    document.getElementById('volume-slider').classList.add('hidden');
    document.getElementById('thongbao').classList.add('hidden');
    document.getElementById('note-button').classList.add('hidden');
    document.getElementById('skip-button').classList.add('hidden');
    // Hiển thị thông báo hoàn thành bài tập
    document.getElementById('completion-message').style.display = 'block';
}

// Sự kiện khi ô textarea được focus (người dùng bắt đầu nhập liệu)
document.getElementById('user-input').addEventListener('focus', () => {
    isTyping = true;
});

// Sự kiện khi ô textarea bị blur (người dùng kết thúc nhập liệu)
document.getElementById('user-input').addEventListener('blur', () => {
    isTyping = false;
});

// Thêm sự kiện cho slider âm lượng
document.getElementById('volume-slider').addEventListener('input', (event) => {
    const volume = event.target.value;
    if (audio) {
        audio.volume = volume; // Cập nhật âm lượng của audio
    }
});

// Sự kiện khi nhấn nút Play
document.getElementById('play-button').addEventListener('click', () => {
    playAudio(); // Sử dụng endpoint và file audio của news
});


// Sự kiện khi thay đổi tốc độ từ dropdown
document.getElementById('speed-select').addEventListener('change', (event) => {
    const speed = parseFloat(event.target.value); // Lấy giá trị tốc độ từ dropdown
    changeSpeed(speed); // Thay đổi tốc độ phát audio
});

// Sự kiện khi nhấn nút Pause
document.getElementById('pause-button').addEventListener('click', () => {
    pauseAudio();
});

// Sự kiện khi nhấn nút Submit
document.getElementById('submit-button').addEventListener('click', () => {
    checkAnswer(); // Sử dụng endpoint của news
});



// Sự kiện khi nhấn nút Previous
document.getElementById('previous-button').addEventListener('click', () => {
    previousSentence();
});

// Sự kiện khi nhấn phím Enter trong ô textarea
document.getElementById('user-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn không cho xuống dòng
        checkAnswer(); // Gọi hàm kiểm tra đáp án
    }
});

// Sự kiện khi nhấn phím Space, ArrowLeft, hoặc Enter
document.addEventListener('keydown', (event) => {
    const modal = document.getElementById('note-modal');
    const noteInput = document.getElementById('note-input');

    // Nếu modal note đang mở và ô nhập note đang được focus
    if (modal.style.display === 'flex' && document.activeElement === noteInput) {
        // Cho phép sử dụng phím Space trong ô nhập note
        return;
    }

    // Các sự kiện bình thường khi modal note không mở
    if (event.key === ' ') { // Phím Space để Play/Pause
        if (!isTyping) { // Chỉ thực hiện nếu không đang nhập liệu
            event.preventDefault();
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        }
    } else if (event.key === 'ArrowLeft') { // Phím mũi tên trái để Previous
        previousSentence();
    } else if (event.key === 'Enter' && !event.shiftKey) { // Phím Enter để Submit
        event.preventDefault();
        checkAnswer();
    }
});



// Hàm mở modal note
function openModal() {
    const modal = document.getElementById('note-modal');
    modal.style.display = 'flex'; // Hiển thị modal
    document.getElementById('note-input').focus(); // Tự động focus vào ô nhập note
}

// Hàm đóng modal note
function closeModal() {
    const modal = document.getElementById('note-modal');
    modal.style.display = 'none'; // Ẩn modal
}

// Hàm thêm note
function addNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();

    if (noteText) {
        notes.push({ id: Date.now(), text: noteText }); // Thêm note vào mảng
        noteInput.value = ''; // Xóa nội dung textarea
        saveNotes(); // Lưu note vào localStorage
        renderNotes(); // Hiển thị lại danh sách note
    }
}

// Hàm xóa note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id); // Lọc ra note cần xóa
    saveNotes(); // Lưu note vào localStorage
    renderNotes(); // Hiển thị lại danh sách note
}

// Hàm chỉnh sửa note
function editNote(id) {
    const note = notes.find(note => note.id === id); // Tìm note cần chỉnh sửa
    const newText = prompt("Edit your note:", note.text); // Hiển thị hộp thoại để chỉnh sửa

    if (newText !== null && newText.trim() !== "") {
        note.text = newText.trim(); // Cập nhật nội dung note
        saveNotes(); // Lưu note vào localStorage
        renderNotes(); // Hiển thị lại danh sách note
    }
}

// Hàm hiển thị danh sách note
function renderNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // Xóa nội dung cũ

    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';

        noteItem.innerHTML = `
            <div class="note-content">${note.text}</div>
            <div class="note-actions">
                <button class="edit-button" onclick="editNote(${note.id})"><i class="fas fa-edit"></i></button>
                <button onclick="deleteNote(${note.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;

        notesList.appendChild(noteItem);
    });
}

// Hàm lưu note vào localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Hàm tải note từ localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes(); // Hiển thị lại danh sách note
    }
}

// Sự kiện khi nhấn nút Notes
document.getElementById('note-button').addEventListener('click', openModal);

// Sự kiện khi nhấn nút đóng modal
document.getElementById('close-modal').addEventListener('click', closeModal);

// Sự kiện khi nhấn nút Add Note
document.getElementById('add-note-button').addEventListener('click', addNote);

// Sự kiện khi nhấn phím Enter trong ô note input
document.getElementById('note-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Ngăn không cho xuống dòng
        addNote(); // Thêm note
    }
});
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
//sự kiện skip
function fetchDataForCurrentIndex() {
    return fetch(`/get_sentence_conversation?index=${currentIndex}`)
        .then(response => response.json())
        .then(data => {
            return data;
        });
}
document.getElementById('skip-button').addEventListener('click', () => {
    if (!isShowingAnswer) {
        // Lần đầu nhấn Skip -> Hiện đáp án
        fetchDataForCurrentIndex().then(data => {
            if (data.sentence) {
                document.getElementById('user-input').value = data.sentence; // Hiển thị đáp án
                isShowingAnswer = true; // Chuyển trạng thái sang "đã hiện đáp án"
            } else {
                showCompletionMessage(); // Hiển thị thông báo hoàn thành bài tập
            }
        });
    } else {
        // Lần nhấn Skip thứ 2 -> Chuyển câu tiếp theo
        currentIndex++; // Sang câu tiếp theo
        fetchDataForCurrentIndex().then(data => {
            if (data.sentence) {
                document.getElementById('user-input').value = ''; // Xóa input cũ
                pauseAudio(); // Dừng âm thanh hiện tại
                playAudio(); // Phát câu tiếp theo
                isShowingAnswer = false; // Reset trạng thái Skip
            } else {
                showCompletionMessage(); // Hiển thị thông báo hoàn thành bài tập
            }
        });
    }
});

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
// Tải note từ localStorage khi trang được tải
window.addEventListener('load', loadNotes);


