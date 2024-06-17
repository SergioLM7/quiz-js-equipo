const firebaseConfig = {
    apiKey: "AIzaSyDm4y61vpKTeudhBnPZR-y9_suQd6Z7oHI",
    authDomain: "quizjs-4e621.firebaseapp.com",
    projectId: "quizjs-4e621",
    storageBucket: "quizjs-4e621.appspot.com",
    messagingSenderId: "1068148851720",
    appId: "1:1068148851720:web:7185cb90463c1d1ebafdbd"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// General Variables
const fragment = document.createDocumentFragment();
const goButton = document.querySelector('#goButton');
const nextButton = document.querySelector('#nextButton');

// ApiQuiz Variables
const apiQuiz = 'https://opentdb.com/api.php?amount=10';
let arrApiQuiz;
let currentIndex = 0;
let answers = [];

// Auth User Variables
let isUserLogged;
// const profilePictureContainer = document.querySelector('#profilePictureContainer');
const loginContainer = document.querySelector('#login-container');
const signupContainer = document.querySelector('#signup-container');
const authContainer = document.querySelector('#auth-container');
const closeAuthWindow = document.querySelector('.close-auth-window');

// Event Listeners
document.addEventListener('click', ({ target }) => {

    if (target.matches('#goToQuiz')) {
        window.location.href = "./pages/questions.html";
    }

    if (target.matches('.btnAnswer')) {
        iterateArrApiQuiz();
    }

    if (target.matches('#login-window')) {
        authContainer.classList.add('show');
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }

    if (target.matches('#signup-window')) {
        authContainer.classList.add('show');
        loginContainer.classList.add('hidden');
        signupContainer.classList.remove('hidden');
    }

    if (target.matches('.close-auth-window')) {
        authContainer.classList.remove('show');
    }

});

// Event listeners user authentication
document.getElementById("formLogin").addEventListener("submit", function (event) {
    event.preventDefault();
    let emailLogin = event.target.elements.emailLogin.value;
    let passLogin = event.target.elements.passLogin.value;
    signInUser(emailLogin, passLogin)
});

document.getElementById("formSignup").addEventListener("submit", function (event) {
    event.preventDefault();
    let nameSignup = event.target.elements.nameSignup.value;
    let emailSignup = event.target.elements.emailSignup.value;
    let passSignup = event.target.elements.passSignup.value;
    let passSignupRepeat = event.target.elements.passSignupRepeat.value;

    passSignup === passSignupRepeat ? signUpUser(nameSignup, emailSignup, passSignup) : alert("error password");
});

document.getElementById("button-logout").addEventListener("click", () => {
    signOut();
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
    if (currentIndex < arrApiQuiz.length) {
        document.querySelector('#questionCard').innerHTML = '';
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

        divAnswer1.innerHTML = `<button id=${answers[0]} class="btnAnswer">${answers[0]}</button>`;
        divAnswer2.innerHTML = `<button id=${answers[1]} class="btnAnswer">${answers[1]}</button>`;

        fragment.append(questionTitle, divAnswer1, divAnswer2)
        questionCardContainer.append(fragment);
    } else {
        answers = [object.correct_answer, object.incorrect_answers[0], object.incorrect_answers[1], object.incorrect_answers[2]];
        shuffleAnswers(answers);

        divAnswer1.innerHTML = `<button id=${answers[0]} class="btnAnswer">${answers[0]}</button>`;
        divAnswer2.innerHTML = `<button id=${answers[1]} class="btnAnswer">${answers[1]}</button>`;
        divAnswer3.innerHTML = `<button id=${answers[2]} class="btnAnswer">${answers[2]}</button>`;
        divAnswer4.innerHTML = `<button id=${answers[3]} class="btnAnswer">${answers[3]}</button>`;

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
};

// User Authentication Functions
const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(`se ha logado ${user.email} ID:${user.uid}`)
            alert(`se ha logado ${user.email} ID:${user.uid}`)
            console.log("USER", user);
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            alert('Wrong authentication details.');
        });
    authContainer.classList.remove('show');
}

const createUser = (user) => {
    db.collection("users")
        .add(user)
        .then((docRef) => console.log("Document written with ID: ", docRef.id))
        .catch((error) => console.error("Error adding document: ", error));
}

const signUpUser = (nameSignup, email, password) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`);
            createUser({
                id: user.uid,
                name: nameSignup,
                email: user.email,
                profilePicture: 'ProfilePicture'
            });
            user.updateProfile({
                displayName: nameSignup //Actualiza el display name
            });
            authContainer.classList.remove('show');
        })
        .catch((error) => {
            console.log("Error en el sistema" + error.message, "Error: " + error.code);
        });
}

const signOut = () => {
    let user = firebase.auth().currentUser;

    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email);
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        isUserLogged = firebase.auth().currentUser;
        console.log(`Está en el sistema:${user.email} ${user.uid}`);
        // document.getElementById("message").innerText = `Hello ${isUserLogged.displayName}!`;
        document.querySelector('#loggedOffContainer').classList.add('hidden');
        document.querySelector('#loggedInContainer').classList.remove('hidden');
        // profilePictureContainer.innerHTML = '';
        // getProfilePicture();
    } else {
        isUserLogged = firebase.auth().currentUser;
        console.log("no hay usuarios en el sistema");
        // document.getElementById("message").innerText = `No hay usuarios en el sistema`;
        document.querySelector('#loggedOffContainer').classList.remove('hidden');
        document.querySelector('#loggedInContainer').classList.add('hidden');
        // profilePictureContainer.innerHTML = '';
        // getProfilePicture();
    }
});

// Function Calls
onWindowChange();