document.addEventListener("DOMContentLoaded", function () {
  let correct = 0;
  let total = 0;
  let currentQuestionI = 0;

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

          const nextBtn = document.getElementById("next-btn");
          nextBtn.style.display = "block";
        });
      });
    });
});
