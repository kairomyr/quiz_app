document.addEventListener("DOMContentLoaded", function() {

    let correct = 0; 
    let total = 0;   

    const answers = document.querySelectorAll(".answer-box");
    const feedback = document.getElementById("feedback-text");
    const scoreValue = document.getElementById("score-value");

    answers.forEach(function(answer) {
        answer.addEventListener("click", function() {

            const isCorrect = this.getAttribute("data-correct");
            total += 1;

            if (isCorrect === "true") {
                feedback.textContent = "Correct!";

                correct += 1;
            } else {
                feedback.textContent = "Incorrect!";
            }
            scoreValue.textContent = correct + "/" + total;
        });
    });

});