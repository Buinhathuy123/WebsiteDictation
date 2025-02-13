from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Danh sách các câu cần dictation với thời gian bắt đầu
sentences = [
    {"text": "It snowed all day today.", "audio": "/static/audio/sentence_1.mp3"},  # Câu 1 bắt đầu từ giây 0
    {"text": "The snow is beautiful.", "audio": "/static/audio/sentence_2.mp3"},  # Câu 2 bắt đầu từ giây 10
    {"text": "The snow finally stopped.", "audio": "/static/audio/sentence_3.mp3"}  # Câu 3 bắt đầu từ giây 20
]
sentences_conversation = [
    {"text": "Hello, Jack. This is Dave.","audio": "/static/audio/conversation_1.mp3"},
    {"text": "I want to return the book I borrowed from you last night.", "audio": "/static/audio/conversation_2.mp3"},
    {"text": "Will you be home at about six o'clock?", "audio": "/static/audio/conversation_3.mp3"}
]
sentences_shortstories = [
    {"text": "The leaves are changing colors.","audio": "/static/audio/shortstories_1.mp3"},
    {"text": "I see red maple leaves.", "audio": "/static/audio/shortstories_2.mp3"},
    {"text": "I see orange maple leaves.", "audio": "/static/audio/shortstories_3.mp3"}
]

@app.route('/')
def home():
    return render_template('index.html')  # Trang chủ chỉ hiển thị nền trắng

@app.route('/news')
def news():
    return render_template('news.html')  # Trang News hiển thị bài dictation

@app.route('/conversation')
def conversation():
    return render_template('conversation.html')  # Trang News hiển thị bài dictation

@app.route('/short-stories')
def shortstories():
    return render_template('shortstories.html')  # Trang News hiển thị bài dictation

@app.route('/get_sentence', methods=['GET'])
def get_sentence():
    index = int(request.args.get('index', 0))
    if index < len(sentences):
        return jsonify({
            "sentence": sentences[index]["text"],
            "audio": sentences[index]["audio"],
            "index": index
        })
    else:
        return jsonify({"sentence": None, "index": index})

    
@app.route('/get_sentence_conversation', methods=['GET'])
def get_sentence_conversation():
    index = int(request.args.get('index', 0))
    if index < len(sentences_conversation):
        return jsonify({
            "sentence": sentences_conversation[index]["text"],
            "audio": sentences_conversation[index]["audio"],
            "index": index
        })
    else:
        return jsonify({"sentence": None, "index": index})
    
@app.route('/get_sentence_shortstories', methods=['GET'])
def get_sentence_shortstories():
    index = int(request.args.get('index', 0))
    if index < len(sentences_shortstories):
        return jsonify({
            "sentence": sentences_shortstories[index]["text"],
            "audio": sentences_shortstories[index]["audio"],
            "index": index
        })
    else:
        return jsonify({"sentence": None, "index": index})

@app.route('/check_answer_conversation', methods=['POST'])
def check_answer_conversation():
    data = request.json
    user_input = data.get('user_input', '').strip()
    index = data.get('index', 0)
    correct_sentence = sentences_conversation[index]["text"]

    result = []
    for i in range(len(correct_sentence)):
        if i < len(user_input) and user_input[i].lower() == correct_sentence[i].lower():
            result.append(correct_sentence[i])
        else:
            result.append('*')

    result_str = ''.join(result)

    if user_input.lower() == correct_sentence.lower():
        return jsonify({
            "correct": True,
            "message": "Correct! Well done!",
            "detail": result_str
        })
    else:
        return jsonify({
            "correct": False,
            "message": "Incorrect. Try again!",
            "detail": result_str
        })

@app.route('/check_answer_shortstories', methods=['POST'])
def check_answer_shortstories():
    data = request.json
    user_input = data.get('user_input', '').strip()
    index = data.get('index', 0)
    correct_sentence = sentences_shortstories[index]["text"]

    result = []
    for i in range(len(correct_sentence)):
        if i < len(user_input) and user_input[i].lower() == correct_sentence[i].lower():
            result.append(correct_sentence[i])
        else:
            result.append('*')

    result_str = ''.join(result)

    if user_input.lower() == correct_sentence.lower():
        return jsonify({
            "correct": True,
            "message": "Correct! Well done!",
            "detail": result_str
        })
    else:
        return jsonify({
            "correct": False,
            "message": "Incorrect. Try again!",
            "detail": result_str
        })

@app.route('/check_answer', methods=['POST'])
def check_answer():
    data = request.json
    user_input = data.get('user_input', '').strip()
    index = data.get('index', 0)
    correct_sentence = sentences[index]["text"]

    result = []
    for i in range(len(correct_sentence)):
        if i < len(user_input) and user_input[i].lower() == correct_sentence[i].lower():
            result.append(correct_sentence[i])
        else:
            result.append('*')

    result_str = ''.join(result)

    if user_input.lower() == correct_sentence.lower():
        return jsonify({
            "correct": True,
            "message": "Correct! Well done!",
            "detail": result_str
        })
    else:
        return jsonify({
            "correct": False,
            "message": "Incorrect. Try again!",
            "detail": result_str
        })

if __name__ == '__main__':
    app.run(debug=True)