let currentQuestionIndex = 1; // Start with the first question

function loadQuestion() {
    const filename = document.getElementById('filename').value.trim();
    if (!filename) {
        alert('Please enter a filename.');
        return;
    }

    // Extract the number from the filename (e.g., 'question1.txt' -> '1')
    const number = filename.match(/\d+/)[0];
    currentQuestionIndex = parseInt(number, 10); // Update currentQuestionIndex

    fetch(`http://localhost:3000/question/${filename}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Question data received:', data); // Debugging log
            displayQuestion(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to load question. Please check the filename and try again.');
        });
}

function displayQuestion(question) {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = `<strong>${question.question}</strong>`;

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options';

    question.options.forEach((option, i) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => selectAnswer(option.charAt(0)));
        optionsContainer.appendChild(optionButton);
    });

    const submitButton = document.createElement('button');
    submitButton.className = 'submit-button';
    submitButton.textContent = 'Sprawdź';
    submitButton.addEventListener('click', () => checkAnswer(question));

    questionContainer.appendChild(questionElement);
    questionContainer.appendChild(optionsContainer);
    questionContainer.appendChild(submitButton);

    // Ensure next question button is hidden initially
    document.getElementById('next-question').style.display = 'none';
}

function selectAnswer(answer) {
    // Handle selecting an answer
    const selectedOption = document.querySelector('.selected');
    if (selectedOption) {
        selectedOption.classList.remove('selected');
    }
    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        if (button.textContent.charAt(0) === answer) {
            button.classList.add('selected');
        }
    });
}

function loadNextQuestion() {
    // Clear previous question and notes
    const questionContainer = document.getElementById('question-container');
    const notesContainer = document.getElementById('notes-container');
    questionContainer.innerHTML = '';
    notesContainer.innerHTML = '';

    currentQuestionIndex++; // Increment currentQuestionIndex for next question
    const filename = `question${currentQuestionIndex}.txt`;

    fetch(`http://localhost:3000/question/${filename}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Question data received:', data); // Debugging log
            displayQuestion(data);
            // Ensure next question button is hidden again after loading new question
            document.getElementById('next-question').style.display = 'none';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to load question. Please check the filename and try again.');
        });
}

function checkAnswer(question) {
    const selectedOption = document.querySelector('.selected');
    if (!selectedOption) {
        alert('Please select an option!');
        return;
    }

    const answer = selectedOption.textContent.charAt(0);
    const correctAnswer = question.correct_answer;

    let message;
    if (answer === correctAnswer) {
        message = 'Correct!';
    } else {
        message = `Incorrect! The correct answer is ${correctAnswer}.`;
    }

    // Display message below submit button
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    document.getElementById('question-container').appendChild(messageElement);

    showNotes(question);

    // Display next question button
    document.getElementById('next-question').style.display = 'inline-block';
}

function showNotes(question) {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.style.display = 'block';
    notesContainer.textContent = question.notes;
}

// Event listener for the "Load Next Question" button
document.getElementById('next-question').addEventListener('click', loadNextQuestion);
