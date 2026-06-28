let currentQuestion = 0;
let answers = {};

const questions = [
    // Basic Info (1-10)
    {
        id: 1,
        text: "Как зовут твоего персонажа?",
        type: "text",
        category: "basic"
    },
    {
        id: 2,
        text: "Сколько лет персонажу?",
        type: "number",
        category: "basic"
    },
    {
        id: 3,
        text: "Какой пол/гендер персонажа?",
        type: "select",
        options: ["Мужской", "Женский", "Небинарный", "Другой"],
        category: "basic"
    },
    {
        id: 4,
        text: "Какой вид/раса персонажа? (человек, эльф, демон и т.д.)",
        type: "text",
        category: "basic"
    },
    // Appearance - many questions
    {
        id: 5,
        text: "Цвет волос персонажа?",
        type: "text",
        category: "appearance"
    },
    {
        id: 6,
        text: "Длина и стиль волос?",
        type: "select",
        options: ["Короткие", "Средние", "Длинные", "Волосы до пояса", "Лысый/лысина"],
        category: "appearance"
    },
    {
        id: 7,
        text: "Цвет глаз?",
        type: "text",
        category: "appearance"
    },
    {
        id: 8,
        text: "Форма тела (стройное, мускулистое, пышное и т.д.)?",
        type: "text",
        category: "appearance"
    },
    {
        id: 9,
        text: "Рост персонажа (в см)?",
        type: "number",
        category: "appearance"
    },
    {
        id: 10,
        text: "Особые черты лица (шрамы, татуировки, пирсинг)?",
        type: "text",
        category: "appearance"
    },
    // More appearance
    {
        id: 11,
        text: "Какой стиль одежды предпочитает персонаж?",
        type: "text",
        category: "appearance"
    },
    {
        id: 12,
        text: "Есть ли у персонажа аксессуары (очки, украшения, оружие)?",
        type: "text",
        category: "appearance"
    },
    // Personality
    {
        id: 13,
        text: "Основные черты характера (3-5 слов)?",
        type: "text",
        category: "personality"
    },
    {
        id: 14,
        text: "Какой темперамент? (сангвиник, холерик и т.д.)",
        type: "select",
        options: ["Сангвиник", "Холерик", "Меланхолик", "Флегматик", "Смесь"],
        category: "personality"
    },
    // Lore / Backstory
    {
        id: 15,
        text: "Краткая история происхождения персонажа",
        type: "textarea",
        category: "lore"
    },
    {
        id: 16,
        text: "Где родился/вырос персонаж?",
        type: "text",
        category: "lore"
    },
    // Sexuality and more
    {
        id: 17,
        text: "Сексуальная ориентация персонажа?",
        type: "select",
        options: ["Гетеросексуал", "Гомосексуал", "Бисексуал", "Пансексуал", "Асексуал", "Не указано"],
        category: "sexuality"
    },
    {
        id: 18,
        text: "Любимые сексуальные предпочтения или фетиши (опишите кратко)",
        type: "text",
        category: "sexuality"
    },
    // Add more questions to reach ~50+ for demo
    {
        id: 19,
        text: "Есть ли у персонажа суперспособности?",
        type: "text",
        category: "abilities"
    },
    {
        id: 20,
        text: "Какой возрастной рейтинг персонажа (NSFW, SFW)?",
        type: "select",
        options: ["SFW", "NSFW", "18+"],
        category: "basic"
    }
    // TODO: Expand to 100+ by duplicating pattern in real version
];

function startQuiz() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    currentQuestion = 0;
    answers = {};
    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('question-text').textContent = `${q.id}. ${q.text}`;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    if (q.type === 'text' || q.type === 'number') {
        const input = document.createElement('input');
        input.type = q.type;
        input.className = 'option';
        input.placeholder = 'Ваш ответ...';
        input.onchange = () => answers[q.id] = input.value;
        if (answers[q.id]) input.value = answers[q.id];
        optionsDiv.appendChild(input);
    } else if (q.type === 'select') {
        q.options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => {
                document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                div.classList.add('selected');
                answers[q.id] = opt;
            };
            if (answers[q.id] === opt) div.classList.add('selected');
            optionsDiv.appendChild(div);
        });
    } else if (q.type === 'textarea') {
        const ta = document.createElement('textarea');
        ta.className = 'option';
        ta.rows = 4;
        ta.placeholder = 'Опишите...';
        ta.onchange = () => answers[q.id] = ta.value;
        if (answers[q.id]) ta.value = answers[q.id];
        optionsDiv.appendChild(ta);
    }
    
    updateProgress();
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function nextQuestion() {
    const q = questions[currentQuestion];
    if (!answers[q.id] && q.type !== 'select') {
        alert('Пожалуйста, ответьте на вопрос!');
        return;
    }
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        generatePrompt();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function generatePrompt() {
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    
    let prompt = `A highly detailed character portrait of `;
    
    // Basic
    prompt += `${answers[1] || 'Unnamed'}, a ${answers[2] || 'adult'} year old ${answers[3] || 'person'} `;
    prompt += `${answers[4] || 'human'}. `;
    
    // Appearance
    prompt += `With ${answers[5] || 'vibrant'} ${answers[6] || 'long'} hair, ${answers[7] || 'piercing'} eyes, `;
    prompt += `a ${answers[8] || 'athletic'} body, height ${answers[9] || '170'}cm. `;
    prompt += `Features: ${answers[10] || 'flawless skin'}, wearing ${answers[11] || 'stylish modern clothes'}, accessories: ${answers[12] || 'none'}. `;
    
    // Personality & Lore
    prompt += `Personality: ${answers[13] || 'mysterious and confident'}. `;
    prompt += `Backstory: ${answers[15] || 'mysterious origins'}. `;
    
    // Sexuality (for NSFW generators)
    if (answers[20] && answers[20].includes('NSFW')) {
        prompt += `Sexy pose, ${answers[17] || ''}, ${answers[18] || 'seductive expression'}. `;
    }
    
    prompt += `Masterpiece, best quality, ultra detailed, cinematic lighting, 8k.`;
    
    document.getElementById('prompt-output').textContent = prompt;
}

function copyPrompt() {
    const promptText = document.getElementById('prompt-output').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        alert('Промпт скопирован в буфер!');
    });
}

function restartQuiz() {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
}