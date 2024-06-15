// General Variables
const fragment = document.createDocumentFragment();
const goButton = document.querySelector('#goButton'); 
const nextButton = document.querySelector('#nextButton');

// ApiQuiz Variables
const apiQuiz = 'https://opentdb.com/api.php?amount=10';
let arrApiQuiz;
let currentIndex = 0;


// Event Listeners
document.addEventListener('click', async ({ target }) => {
    if (target.matches('#goToQuiz')) {
        try {
            const preguntas = await getApiQuiz();
            toLocalStorage(preguntas);
            setTimeout(() => {
                window.location.href = './pages/questions.html';
            }, 2000)
        } catch (error) {
            console.error('Error obtaining questions from quiz:', error);
        }
    }
    if (target.matches('#goButton')) {
        goButton.style.display = 'none'; 
        nextButton.style.display = 'block'; 
        arrApiQuiz = JSON.parse(localStorage.getItem('arrApiQuiz'));
        iterateArrApiQuiz();
    }
    
    if (target.matches('#nextButton')) {
        iterateArrApiQuiz();
    }
});


// ApiQuiz Functions
//Get questions from API
const getApiQuiz = async () => {
    console.log('access...')
    try {
        const responseApiQuiz = await fetch(apiQuiz);
        const dataApiQuiz = await responseApiQuiz.json();
        return dataApiQuiz.results;
    } catch (error) {
        throw (error);
    }
};

//Save questions in Local Storage
const toLocalStorage = (array) => {
    localStorage.setItem('arrApiQuiz', JSON.stringify(array));
};

//Iterate arrApiQuiz
const iterateArrApiQuiz = () => {
    document.querySelector('#questionCard').innerHTML = '';
    if (arrApiQuiz && currentIndex < arrApiQuiz.length) {
        paintQuestion(arrApiQuiz[currentIndex]);
        currentIndex++;
    } else {
        alert('You have finished the quiz.');
        currentIndex = 0;
        nextButton.style.display = 'none'; 
    }
};

//Paint questions at pages/questions
const paintQuestion = (object) => {
    const questionCardContainer = document.querySelector('#questionCard');
    const question = object.question;
    const category = object.category;
    const h3Question = document.createElement('H3');
    h3Question.innerHTML = question;
    const h4Category = document.createElement('H4');
    h4Category.innerHTML = category;
    const divAnswer1 = document.createElement('DIV');
    const divAnswer2 = document.createElement('DIV');
    const divAnswer3 = document.createElement('DIV');
    const divAnswer4 = document.createElement('DIV');

    if (object.type === 'boolean') {
        const answer1 = object.incorrect_answers[0];
        const answer2 = object.correct_answer;

        divAnswer1.innerHTML = `<p>${answer1}</p>`;
        divAnswer2.innerHTML = `<p>${answer2}</p>`;

        fragment.append(h4Category, h3Question, divAnswer1, divAnswer2)
        questionCardContainer.append(fragment);
    } else {
        const answer1 = object.incorrect_answers[1];
        const answer2 = object.incorrect_answers[0];
        const answer3 = object.correct_answer;
        const answer4 = object.incorrect_answers[2];

        divAnswer1.innerHTML = `<p>${answer1}</p>`;
        divAnswer2.innerHTML = `<p>${answer2}</p>`;
        divAnswer3.innerHTML = `<p>${answer3}</p>`;
        divAnswer4.innerHTML = `<p>${answer4}</p>`;

        fragment.append(h4Category, h3Question, divAnswer1, divAnswer2, divAnswer3, divAnswer4)
        questionCardContainer.append(fragment);
    }
};

// Function Calls
