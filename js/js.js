const quizFile = 'https://opentdb.com/api.php?amount=10&type=multiple';
const quizContainer = document.querySelector('.quiz-container');
const questionContainer = document.querySelector('.questionContainer');
const button = document.querySelector('input[name="button"]');
const answers = document.querySelector('.answers');
const answerContainer = document.querySelectorAll(".answerContainer");
const score = document.querySelector(".score");
const sumUp = document.querySelector(".sumUp");
const buttonnext = document.querySelector('input[name="buttonnext"]');

const request = new XMLHttpRequest();

//start new request
request.open('GET' , 'https://opentdb.com/api.php?amount=10&type=multiple' , true );

request.onload = function (){

	// Begin accessing JSON data here
	const data = JSON.parse(this.response);
	const quizData = [];
	const tab= data.results;

	//tab with object from API
	quizData.push(...tab);

	let index = 0;
	let scoreUP = 0;

	//shuffle tab with answers
	function shuffle(arr){
		let aLenngth = arr.length;
		let temp;
		let index;

		while(aLenngth > 0){
			index = Math.floor(Math.random() * aLenngth);
			aLenngth--;
			temp = arr[aLenngth];
			arr[aLenngth] = arr[index];
			arr[index] = temp;
		}
		return arr;
	}

	//make tab with incorrect + correct answers
	function answersAll(){
		let tabAnswersIC = quizData[index].incorrect_answers;
		let tabAnswersAll = tabAnswersIC;

		tabAnswersAll.push(quizData[index].correct_answer);

		shuffle(tabAnswersAll);

		return tabAnswersAll;
	}

	function checkAnswers(){
		let clickedAnswer = this.textContent;

		//make clicked answer color background
		this.classList.add("checked");
		
		//check if clkicked answer is equal to correct answer and add a point
		(clickedAnswer === (quizData[index].correct_answer)) ? scoreUP ++ : false;
		
		// make correct answer color background
		answerContainer.forEach(ans =>{
			if(ans.textContent === quizData[index].correct_answer){
				ans.classList.add("correct");
			}
		});

		score.innerHTML = `Wynik: ${scoreUP}`;
		index ++;

		buttonnext.addEventListener('click' , showQuestions);
	}

	function showAnswers(index){
		let ans = answersAll();
		let inx = 0;

		// add all answers to HTML
		answerContainer.forEach(el =>{
			el.innerHTML = ans[inx];
			inx++;
		});

		//call function to check if clicked answer is correct
		answerContainer.forEach(el => {
			el.addEventListener('click', checkAnswers )
		});
	}

	function showQuestions(){
		//remove color background
		answerContainer.forEach(el =>{
			el.classList.remove("checked");
			el.classList.remove("correct");
		});

		//check if there are any questions left, if not, clear everything and show score 
		if(index < quizData.length){
			let question = quizData[index].question;

			questionContainer.innerHTML = question;

			showAnswers(index);
		}else{
			questionContainer.parentNode.removeChild(questionContainer);

			answerContainer.forEach(ans =>{
				ans.parentNode.removeChild(ans);
			});

			score.parentNode.removeChild(score);
			sumUp.innerHTML = "Twój wynik to " + scoreUP;
			buttonnext.classList.remove("btnVisible");
		}
	}

	function startQuiz(){
		button.parentNode.removeChild(button);

		questionContainer.classList.add("questionContainerVis")
		answers.classList.add("answersVis");

		answerContainer.forEach(ans =>{
			ans.classList.add("answerContainerVis")
		});

		buttonnext.classList.add("btnVisible");
		showQuestions(index);
		score.innerHTML = `Wynik: ${scoreUP}`;
	}


	button.addEventListener('click' , startQuiz);

};

request.send();

