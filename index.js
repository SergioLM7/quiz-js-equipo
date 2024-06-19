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
let userAnswers = [];
let points;

// Auth User Variables
let isUserLogged;
const profilePictureContainer = document.querySelector('#profilePictureContainer');
const loginContainer = document.querySelector('#login-container');
const signupContainer = document.querySelector('#signup-container');
const authContainer = document.querySelector('#auth-container');
const closeAuthWindow = document.querySelector('.close-auth-window');

// Event Listeners
document.addEventListener('click', ({ target }) => {

    if (target.matches('#goToQuiz')) {
        window.location.href = "./pages/questions.html";
    }
    if (target.matches('#goRankings')) {
        window.location.href = "./pages/results.html";
    }

    if (target.matches('.btnAnswer')) {
        saveAnswers(target.id);
        checkAnswers(target.id, userAnswers, arrApiQuiz);
        console.log(userAnswers);
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

//Event listener Upload Profile Picture
document.addEventListener('change', ({ target }) => {
    if (target.matches('#btnFilePfp')) {
        uploadProfilePicture();
    }
});

// Event listeners user authentication
document.getElementById("formLogin").addEventListener("submit", (event) => {
    event.preventDefault();
    let emailLogin = event.target.elements.emailLogin.value;
    let passLogin = event.target.elements.passLogin.value;
    signInUser(emailLogin, passLogin)
});

document.getElementById("formSignup").addEventListener("submit", (event) => {
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

//Event music
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audioPlayer');
    const button = document.getElementById('audioButton');

    button.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            button.classList.add('playing');
        } else {
            audio.pause();
            button.classList.remove('playing');
        }
    });
});


// ApiQuiz Functions
//Get questions from API
const getApiQuiz = async () => {
    console.log('Accessing API...');
    try {
        const responseApiQuiz = await fetch(apiQuiz);
        const dataApiQuiz = await responseApiQuiz.json();
        console.log('Data from API:', dataApiQuiz); // Añade este log
        return arrApiQuiz = dataApiQuiz.results;
    } catch (error) {
        console.error('Error fetching API:', error);
    }
};


//Save questions in Local Storage
const toLocalStorage = (array) => {
    localStorage.setItem('arrApiQuiz', JSON.stringify(array));
};

//Iterate arrApiQuiz
const iterateArrApiQuiz = () => {
    console.log('Iterating questions array...');
    if (currentIndex < arrApiQuiz.length) {
        document.querySelector('#questionCard').innerHTML = '';
        console.log('Painting question:', arrApiQuiz[currentIndex]);
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
        console.log('On questions page');
        if (localStorage.getItem('arrApiQuiz')) {
            arrApiQuiz = JSON.parse(localStorage.getItem('arrApiQuiz'));
            console.log('Using questions from local storage', arrApiQuiz);
            iterateArrApiQuiz();
        } else {
            const preguntas = await getApiQuiz();
            console.log('Questions from API:', preguntas);
            toLocalStorage(preguntas);
            iterateArrApiQuiz();
        }
    }
};



//Paint questions at pages/questions
const paintQuestion = (object) => {
    console.log('Painting question:', object);
    const questionCardContainer = document.querySelector('#questionCard');
    const question = object.question;
    const category = object.category;
    const h3Question = document.createElement('H3');
    h3Question.innerHTML = question;
    const h4Category = document.createElement('H4');
    h4Category.innerHTML = category;
    const questionTitle = document.createElement('DIV');
    questionTitle.id = "questionTitle";
    questionTitle.classList = 'rainbow-text';
    questionTitle.append(h4Category, h3Question);
    const divAnswer1 = document.createElement('DIV');
    divAnswer1.id = 'answer1';
    const divAnswer2 = document.createElement('DIV');
    divAnswer2.id = 'answer2';
    const divAnswer3 = document.createElement('DIV');
    divAnswer3.id = 'answer3';
    const divAnswer4 = document.createElement('DIV');
    divAnswer4.id = 'answer4';

    if (object.type === 'boolean') {
        answers = [object.incorrect_answers[0], object.correct_answer];
        shuffleAnswers(answers);

        divAnswer1.innerHTML = `<button id='${answers[0]}' class="btnAnswer">${answers[0]}</button>`;
        divAnswer2.innerHTML = `<button id='${answers[1]}' class="btnAnswer">${answers[1]}</button>`;

        fragment.append(questionTitle, divAnswer1, divAnswer2);
        questionCardContainer.append(fragment);
    } else {
        answers = [object.correct_answer, object.incorrect_answers[0], object.incorrect_answers[1], object.incorrect_answers[2]];
        //shuffleAnswers(answers);

        divAnswer1.innerHTML = `<button id='${answers[0]}' class="btnAnswer">${answers[0]}</button>`;
        divAnswer2.innerHTML = `<button id='${answers[1]}' class="btnAnswer">${answers[1]}</button>`;
        divAnswer3.innerHTML = `<button id='${answers[2]}' class="btnAnswer">${answers[2]}</button>`;
        divAnswer4.innerHTML = `<button id='${answers[3]}' class="btnAnswer">${answers[3]}</button>`;

        fragment.append(questionTitle, divAnswer1, divAnswer2, divAnswer3, divAnswer4);
        questionCardContainer.append(fragment);
    }
    console.log('Question painted successfully');
};

//Function to show answers in almost random positions
const shuffleAnswers = (answers) => {
    console.log('Primer array', answers);
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
        console.log(i, j, answers);
    }
    return answers;
};

//Function save answers
const saveAnswers =(answer) => {
    userAnswers.push(answer);
};

//Function check answers
const checkAnswers = (answer, arrayUser, arrayBBDD) => {
    const answerIndex = arrayUser.indexOf(answer);
    const buttonAnswer = document.getElementById(answer);

    if (answer === arrayBBDD[answerIndex].correct_answer) {
        buttonAnswer.classList.add('correct');
        alert('CORRECT!');
        points++;
    } else {
        buttonAnswer.classList.add('incorrect');
        alert ('INCORRECT!')
    }
   /* for (let i=-1; i < arrayUser.length; i++) {
        if (arrayUser[i+1] === arrayBBDD[i+1].correct_answer) {
            alert('CORRECT!');
            console.log(i);
        } else {
            alert('INCORRECT');
        }
    };*/
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
};

//LOG IN CON GOOGLE



const createUser = (user) => {
    // Create a document reference with the user ID as the document ID
    db.collection("users")
        .doc(user.id)  // This sets the document ID to the user's UID
        .set(user)  // Use set to create the document with the provided data
        .then(() => {
            console.log("Document written with ID: ", user.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
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
                profilePicture: 'https://firebasestorage.googleapis.com/v0/b/quizjs-4e621.appspot.com/o/profilePictures%2FprofilePicture.png?alt=media&token=af80ce80-7247-49bc-be5a-da9b388e40d8'
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
};

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        isUserLogged = firebase.auth().currentUser;
        console.log(`Está en el sistema:${user.email} ${user.uid}`);
        console.log(isUserLogged);
        document.getElementById("message").innerText = `Hello ${isUserLogged.displayName}!`;
        document.querySelector('#loggedOffContainer').classList.add('hidden');
        document.querySelector('#loggedInContainer').classList.remove('hidden');        
        document.querySelector('#button-logout').style.display="block"
        document.querySelector('#pfpMessageContainer').style.display="flex"

        profilePictureContainer.innerHTML = '';
        getProfilePicture();
    } else {
        isUserLogged = firebase.auth().currentUser;
        console.log("no hay usuarios en el sistema");
        document.getElementById("message").innerText = `No hay usuarios en el sistema`;
        document.getElementById("message").style.fontSize = "12px";
        document.querySelector('#loggedOffContainer').classList.remove('hidden');
        document.querySelector('#loggedInContainer').classList.add('hidden');
        document.querySelector('#button-logout').style.display="none"
        document.querySelector('#profilePictureContainer').style.display= "none"
        profilePictureContainer.innerHTML = '';
        getProfilePicture();
    }
});

// Profile Picture
const uploadProfilePicture = () => {
    const file = document.querySelector('#btnFilePfp').files[0];
    const storageRef = firebase.storage().ref();
    var profilePicRef = storageRef.child(`profilePictures/${isUserLogged.uid}profilePicture.jpg`);

    // Upload the file
    profilePicRef.put(file).then((snapshot) => {
        // Get the download URL
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            // Save the download URL in Firestore
            db.collection('users')
                .doc(isUserLogged.uid)
                .set({
                    profilePicture: downloadURL
                }, { merge: true }).then( () => {
                    console.log('Profile picture URL saved successfully!');
                    getProfilePicture();
                }).catch( (error) => {
                    console.error('Error saving profile picture URL: ', error);
                });
        });
    }).catch( (error) => {
        console.error('Error uploading profile picture: ', error);
    });
};

const getProfilePicture = () => {
    isUserLogged = firebase.auth().currentUser;
    db.collection('users')
        .doc(isUserLogged.uid)
        .get()
        .then( (doc) => {
            if (doc.exists) {
                const urlProfilePicture = doc.data().profilePicture;
                if (urlProfilePicture) {
                    profilePictureContainer.innerHTML = '';
                    const imgProfilePicture = document.createElement('IMG');
                    imgProfilePicture.id = 'imgProfilePicture';
                    imgProfilePicture.src = `${urlProfilePicture}`;
                    profilePictureContainer.append(imgProfilePicture);
                }
            } else {
                console.log('No such document!');
            }
        }).catch( (error) => {
            console.log('Error getting document:', error);
        });
};

// Footer Logic
const generateFooter = () => {
    const developers = [
        {
            name: 'Sergio Lillo Martínez',
            github: 'https://github.com/SergioLM7'
        },
        {
            name: 'Antonio González Torres',
            github: 'https://github.com/Nitolez'
        },
        {
            name: 'Diego Blázquez Rosado',
            github: 'https://github.com/diegoblazquezr'
        }
    ];
    const footerDevsContainer = document.querySelector('#footer-devs-container');
    shuffleAnswers(developers);
    developers.forEach((element) => {
        const spanDev = document.createElement('SPAN');
        spanDev.innerHTML = `${element.name}<a href="${element.github}" target="_blank"><i class="fa-brands fa-github fa-xl" style="color: #000000;"></i></a>`;
        fragment.append(spanDev);
    });
    footerDevsContainer.append(fragment);
};

//Temporizador
let timer;
let minutes = 0;
let seconds = 0;

function startTimer() {
    timer = setInterval(updateTimer, 1000); 
    document.getElementById('timer').classList.add('timer-go');
}

function stopTimer() {
    clearInterval(timer);
    document.getElementById('timer').classList.remove('timer-go');
    document.getElementById('timer').classList.add('timer-stopped');

}

function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }

    let displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

    document.getElementById('timer').textContent = `${displayMinutes}:${displaySeconds}`;
    if(seconds == 10){
        stopTimer()
    }
}

// Save Score and Date to User
const saveScore = (obj) => {
    if (isUserLogged) {
        const userRef = db.collection('users').doc(isUserLogged.uid);

        userRef.get().then((doc) => {
            if (doc.exists) {
                let scoresArray = doc.data().scores || [];
                scoresArray.push(obj);

                userRef.set({ scores: scoresArray }, { merge: true })
                    .then(() => {
                        console.log('Score saved successfully!');
                    })
                    .catch((error) => {
                        console.error('Error saving score: ', error);
                    });
            }
        })
    } else {
        console.log("No user is logged in to add their score.");
        alert("You need to be logged in to add score.");
    }
}
// saveScore({score: 10, date: '07-02-1997'});
// Function Calls
onWindowChange();
generateFooter();
startTimer(); 
