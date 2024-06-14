// General Variables
const fragment = document.createDocumentFragment;

// ApiQuiz Variables
const apiQuiz = 'https://opentdb.com/api.php?amount=10';
let arrApiQuiz; // All info from apiQuiz.results

// Event Listeners
document.addEventListener('click', ({target}) => {
    if (target.matches('#goToQuiz')) {
        window.location.href = './pages/questions.html';
    }
});

// ApiQuiz Functions
const getApiQuiz = async () => {
    try{
        const responseApiQuiz = await fetch(apiQuiz);
        const dataApiQuiz = await responseApiQuiz.json();
        arrApiQuiz = dataApiQuiz.results;
        console.log(arrApiQuiz);
    } catch (error) {
        throw(error);
    }
}

// Function Calls
getApiQuiz();