document.addEventListener("DOMContentLoaded", function () {
  let correct = 0;
  let total = 0;
  let currentQuestionI = 0;

  const toggleBtn = document.getElementById("theme-toggle");

  toggleBtn.addEventListener("click", () => {
   document.body.classList.toggle("light-mode");
  });

  const endBtn = document.getElementById("end-btn");
  const endScreen = document.getElementById("end-screen");
  const finalScore = document.getElementById("final-score");

endBtn.addEventListener("click", function () {
  finalScore.textContent = `${correct}/${total}`;
  endScreen.style.display = "flex";
});

document.getElementById("restart-btn").addEventListener("click", function () {
  correct = 0;
  total = 0;
  currentQuestionI = 0;

  document.getElementById("score-value").textContent = "0/0";
  document.getElementById("feedback-text").textContent = "Click an answer to begin";

  endScreen.style.display = "none";

  displayQuestion(currentQuestionI);
});

  fetch("quiz-data.json")
    .then((response) => response.json())
    .then((data) => {
      let lastCorrect = false;
      let hasAnswered = false;

      const questionsList = data.quiz_data.questions;
      const questionElement = document.getElementById("question-text");
      const answers = document.querySelectorAll(".answer-box");
      const feedback = document.getElementById("feedback-text");
      const scoreValue = document.getElementById("score-value");

      function displayQuestion(index) {
        const currentQuestion = questionsList[index];
        questionElement.textContent = currentQuestion.question;
        console.log("Q:", currentQuestion.question);

        let options = [{ text: currentQuestion.answer, isCorrect: true }];

        let poolKeys = Array.isArray(currentQuestion.pool_type)
          ? currentQuestion.pool_type
          : [currentQuestion.pool_type];

        let distractorsPool = [];
        poolKeys.forEach((poolKey) => {
          distractorsPool = distractorsPool.concat(
            data.quiz_data.distractor_pools[poolKey],
          );
        });

        distractorsPool = distractorsPool.filter(
          (item) => item !== currentQuestion.answer,
        );

        while (options.length < 4 && distractorsPool.length > 0) {
          let randomI = Math.floor(Math.random() * distractorsPool.length);
          let randomDistractor = distractorsPool.splice(randomI, 1)[0];
          options.push({ text: randomDistractor, isCorrect: false });
        }

        options.sort(() => Math.random() - 0.5);

        answers.forEach((box, i) => {
          if (options[i]) {
            box.textContent = options[i].text;
            box.setAttribute("data-correct", options[i].isCorrect);
          } else {
            box.style.display = "none";
          }
        });
      }

      const nextBtn = document.getElementById("next-btn");

      nextBtn.addEventListener("click", function () {
        total += 1;
        if (lastCorrect) {
          correct += 1;
        }
        scoreValue.textContent = correct + "/" + total;

        currentQuestionI++;

        if (currentQuestionI < questionsList.length) {
          hasAnswered = false;
          lastCorrect = false;
          feedback.textContent = "";
          nextBtn.style.display = "none";

          displayQuestion(currentQuestionI);
        } else {
          questionElement.textContent = "Quiz Completed!";
          document.querySelector(".answers-container").style.display = "none";
          nextBtn.style.display = "none";
          feedback.textContent = "Your final score: " + correct + "/" + total;
        }
      });

      displayQuestion(currentQuestionI);

      answers.forEach(function (answer) {
        answer.addEventListener("click", function () {
          if (hasAnswered) return;

          const isCorrect = this.getAttribute("data-correct");
          lastCorrect = isCorrect === "true";
          hasAnswered = true;

          if (lastCorrect) {

          feedback.textContent = "Correct!";
          feedback.style.color = "limegreen";
        } else {

          feedback.textContent = "Incorrect!";
          feedback.style.color = "red";
        }

          const nextBtn = document.getElementById("next-btn");
          nextBtn.style.display = "block";
        });
      });
    });
});