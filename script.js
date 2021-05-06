const body = document.querySelector("body");

const root = document.createElement("div");
root.className = "container";

const title = document.createElement("h1");
title.className = "title";
title.innerText = "Тренажер слепой печати";

const parag = document.createElement("p");
parag.className = "text";
parag.innerHTML =
  "Вот вам яркий пример современных тенденций - семантический разбор внешних противодействий предполагает независимые способы реализации как самодостаточных, так и внешне зависимых концептуальных решений";

const clock = document.createElement("div");
clock.className = "clock";

const typeSpeed = document.createElement("div");
typeSpeed.className = "clock";
typeSpeed.setAttribute("hidden", "true");

const btnStart = document.createElement("button");
btnStart.className = "button";
btnStart.setAttribute("type", "button");
btnStart.innerText = "Начать тест";

const btnUpdate = document.createElement("button");
btnUpdate.className = "button";
btnUpdate.setAttribute("type", "button");
btnUpdate.setAttribute("hidden", "false");
btnUpdate.setAttribute("title", "Обновить текст и начать тест заново");

const input = document.createElement("textarea");
input.className = "textarea";
input.setAttribute("wrap", "soft");
input.setAttribute("rows", "8");
input.setAttribute("placeholder", "Напечатайте текст как в примере...");
input.setAttribute("contenteditable", "true");
input.setAttribute("hidden", "true");

body.append(root);
root.append(title);
root.append(input);
root.append(parag);
root.append(btnStart);
root.append(btnUpdate);
parag.after(input);
btnStart.after(input);
root.append(clock);
root.append(typeSpeed);

// const url = "https://baconipsum.com/api/?type=meat-and-filler";
const url = "https://fish-text.ru/get?&type=paragraph&number=1";

// Тестовый fetch для проверки получаемых данных
// fetch(url)
//   .then((res) => res.json())
//   .then((data) => console.log(data));

let timer = [0, 0, 0, 0];
let interval;
let timerRunning = false;

// Запуск таймера с минутами, секундами, милисекундами
function runTimer() {
  let currentTime = `${timer[0]} : ${timer[1]} : ${timer[2]} : ${timer[3]}`;
  clock.innerHTML = currentTime;
  timer[3]++;
  timer[0] = Math.floor(timer[3] / 100 / 60);
  timer[1] = Math.floor(timer[3] / 100 - timer[0] * 60);
  timer[2] = Math.floor(timer[3] - timer[1] * 100 - timer[0] * 6000);
}

const originText = document.querySelector(".text").innerHTML;
console.log("originText: ", originText);

// функция проверки правильности вводимого текста
function checkSpellText() {
  let textEntered = input.value;
  let originTextMatch = originText.substring(0, textEntered.length);
  if (textEntered === "") {
    input.style.border = "";
  } else if (textEntered == originText) {
    input.style.border = "#429890 4px solid";
  } else if (textEntered == originTextMatch) {
    input.style.border = "#0057fa  4px solid"; // blue
  } else {
    input.style.border = "#E95D0F 4px solid"; // orange
  }
}

// Начало теста
function start() {
  typeSpeed.setAttribute("hidden", "true");

  let textEnteredLength = input.value.length;
  if (textEnteredLength === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
}

// Перезагрузка таймера
function reset() {
  clearInterval(interval);
  interval = null;
  timer = [0, 0, 0, 0];

  let testTime = clock.innerHTML.replaceAll(":", ",").split(",");
  let symbolsPerMinute = parag.textContent.length / (testTime[3] / 100 / 60);

  typeSpeed.removeAttribute("hidden");
  typeSpeed.innerHTML = symbolsPerMinute.toString();

  clock.innerHTML = "00:00:00";
  // btnStart.style.display = "block";
  // btnUpdate.setAttribute("hidden", "false");
}

// Отслеживание положения курсора
// function getCaretPosition() {
//   var x = 0;
//   var y = 0;
//   var sel = window.getSelection();
//   if (sel.rangeCount) {
//     var range = sel.getRangeAt(0).cloneRange();
//     if (range.getClientRects()) {
//       range.collapse(true);
//       var rect = range.getClientRects()[0];
//       if (rect) {
//         y = rect.top;
//         x = rect.left;
//       }
//     }
//   }
//   return {
//     x: x,
//     y: y,
//   };
// }

// Вывод первого текста по нажатию на кнопку "Начать тест"
btnStart.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(url)
    .then((res) => res.json())
    .then((result) => {
      let html = "";
      html = `${result.text}`;
      parag.innerHTML = html;
    });
  setTimeout(() => parag.classList.add("show-text"), 500);
  if (parag) {
    btnStart.style.display = "none";
    btnUpdate.removeAttribute("hidden");
  }
  input.removeAttribute("disabled");
});

// Вывод нового фрагмента по нажатию на кнопку обновления текста
btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(url)
    .then((res) => res.json())
    .then((result) => {
      let html = "";
      html = `${result.text}`;
      setTimeout(() => {
        parag.innerHTML = html;
      }, 500);
      setTimeout(() => parag.classList.add("show-text"), 500);
    });
  parag.classList.remove("show-text");
  reset();
  input.value = "";
  input.style.border = "";
});

input.addEventListener("keypress", start, false);
input.addEventListener("keyup", checkSpellText, false);
