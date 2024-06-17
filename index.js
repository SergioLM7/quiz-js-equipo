// General Variables
const fragment = document.createDocumentFragment();
const goButton = document.querySelector('#goButton');
const nextButton = document.querySelector('#nextButton');

// ApiQuiz Variables
const apiQuiz = 'https://opentdb.com/api.php?amount=10';
let arrApiQuiz;
let currentIndex = 0;
let answers = [];


console.log(window.location.pathname);


// Event Listeners
document.addEventListener('click', ({ target }) => {
    if (target.matches('#goToQuiz')) {
        window.location.href = "./pages/questions.html";
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
        return arrApiQuiz = dataApiQuiz.results;
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
    if (currentIndex < arrApiQuiz.length) {
        paintQuestion(arrApiQuiz[currentIndex]);
        currentIndex++;
    } else {
        alert('You have finished the quiz.');
        currentIndex = 0;
    }
};

//Initial function
const onWindowChange = async () => {
    if (window.location.pathname == "/pages/questions.html") {
        if (localStorage.getItem('arrApiQuiz')) {
            arrApiQuiz = JSON.parse(localStorage.getItem('arrApiQuiz'));
            iterateArrApiQuiz();
        } else {
            const preguntas = await getApiQuiz();
            console.log(preguntas)
            toLocalStorage(preguntas);
            iterateArrApiQuiz();
        }
    };
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
    const questionTitle = document.createElement('DIV');
    questionTitle.id = "questionTitle"
    questionTitle.classList = 'rainbow-text'
    questionTitle.append(h4Category, h3Question)
    const divAnswer1 = document.createElement('DIV');
    divAnswer1.id = 'answer1'
    const divAnswer2 = document.createElement('DIV');
    divAnswer2.id = 'answer2'
    const divAnswer3 = document.createElement('DIV');
    divAnswer3.id = 'answer3'
    const divAnswer4 = document.createElement('DIV');
    divAnswer4.id = 'answer4'

    if (object.type === 'boolean') {
        answers = [object.incorrect_answers[0], object.correct_answer];
        shuffleAnswers(answers);

        divAnswer1.innerHTML = `<button>${answers[0]}</button>`;
        divAnswer2.innerHTML = `<button>${answers[1]}</button>`;

        fragment.append(questionTitle, divAnswer1, divAnswer2)
        questionCardContainer.append(fragment);
    } else {
        answers = [object.correct_answer, object.incorrect_answers[0], object.incorrect_answers[1], object.incorrect_answers[2]];
        shuffleAnswers(answers);

        divAnswer1.innerHTML = `<button>${answers[0]}</button>`;
        divAnswer2.innerHTML = `<button>${answers[1]}</button>`;
        divAnswer3.innerHTML = `<button>${answers[2]}</button>`;
        divAnswer4.innerHTML = `<button>${answers[3]}</button>`;

        fragment.append(questionTitle, divAnswer1, divAnswer2, divAnswer3, divAnswer4)
        questionCardContainer.append(fragment);
    }
};

const shuffleAnswers = (answers) => {
    console.log('Primer array', answers);
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
        console.log(i, j, answers);
    }
    return answers;
}

// Function Calls
onWindowChange();



