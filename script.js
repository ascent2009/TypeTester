const body = document.querySelector("body");

const root = document.createElement("div");
root.className = "container";

const title = document.createElement("h1");
title.className = "title";
title.innerText = "Тренажер слепой печати";

const parag = document.createElement("p");
parag.className = "text";
parag.innerHTML = "";

const tools = document.createElement("div");
tools.className = "tools-block";

const clock = document.createElement("div");
clock.className = "clock";

const typeSpeed = document.createElement("div");
typeSpeed.className = "clock";
typeSpeed.setAttribute("hidden", "true");

const hintBlock = document.createElement("div");
hintBlock.className = "hint-block";

const hint = document.createElement("p");
// hint.className = "hint";
hint.setAttribute("hidden", "true");

const btnStart = document.createElement("button");
btnStart.className = "button";
btnStart.setAttribute("type", "button");
btnStart.setAttribute("title", "Начать тест");

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
input.setAttribute("disabled", "true");

body.append(root);
root.append(title);
root.append(parag);
root.append(hintBlock);
hintBlock.append(hint);
root.append(input);
root.append(tools);
tools.append(btnStart);
tools.append(btnUpdate);
tools.append(clock);
tools.append(typeSpeed);

// const url = "https://baconipsum.com/api/?type=meat-and-filler";
const url = "https://fish-text.ru/get?&type=paragraph&number=1";
const fetchText = async () => {
  const text = await fetch(url);
  const result = await text.json();
  parag.innerHTML = result.text;
};

// Тестовый fetch для проверки получаемых данных
// fetch(url)
//   .then((res) => res.json())
//   .then((data) => console.log(data));

let timer = [0, 0, 0, 0];
let interval;
let timerRunning = false;

// Запуск таймера с минутами, секундами, милисекундами
function runTimer() {
  let minWithZero = `0${timer[0]}`;
  // let secWithZero = `0${timer[1]}`;
  let currentTime = `${timer[0]} : ${timer[1]} : ${timer[2]} : ${timer[3]}`;
  if (timer[0] < 10) {
    currentTime = `${minWithZero} : ${timer[1]} : ${timer[2]} : ${timer[3]}`;
  }
  clock.innerHTML = currentTime;
  timer[3]++;
  timer[0] = Math.floor(timer[3] / 100 / 60);
  timer[1] = Math.floor(timer[3] / 100 - timer[0] * 60);
  timer[2] = Math.floor(timer[3] - timer[1] * 100 - timer[0] * 6000);
}

// функция проверки правильности вводимого текста
function checkSpellText() {
  // const originT = () => {
  //   fetchText();
  //   return parag.innerHTML;
  // };
  const originText = parag.innerHTML;
  // console.log("originText: ", originText);
  let textEntered = input.value;
  let originTextMatch = originText.substring(0, textEntered.length);
  if (textEntered === "") {
    hint.setAttribute("hidden", "true");
    input.style.border = "";
  } else if (textEntered == originText) {
    input.classList.add("textarea-colored");
    input.style.borderColor = "#429890"; // green
    hint.removeAttribute("hidden");
    hint.style.color = "#429890";
    hint.style.fontWeight = "bold";
    hint.innerHTML = "&#x1F44D; Отлично получилось!";
  } else if (textEntered == originTextMatch) {
    input.classList.add("textarea-colored");
    input.style.borderColor = "#0057fa"; // blue
    hint.removeAttribute("hidden");
    hint.style.color = "#0057fa";
    hint.style.fontWeight = "bold";
    hint.innerHTML = "Пока все правильно...";
  } else {
    input.classList.add("textarea-colored");
    input.style.borderColor = "#E95D0F"; // orange
    hint.removeAttribute("hidden");
    hint.style.color = "#E95D0F";
    hint.style.fontWeight = "bold";
    hint.innerHTML = "Ой, какая-то ошибка... &#x1F914;";
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

// Подсчет количества набранных символов в поле ввода
const charCount = () => {
  let testTime = clock.innerHTML.replaceAll(":", ",").split(",");
  let symbolsPerMinute = Math.round(
    input.value.length / (parseInt(testTime[3]) / 100 / 60)
  );
  typeSpeed.removeAttribute("hidden");
  typeSpeed.innerHTML = `${symbolsPerMinute.toString()} зн/мин`;
};

// Перезагрузка таймера
function reset() {
  clearInterval(interval);
  interval = null;
  timer = [0, 0, 0, 0];
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
  // parag.innerHTML = `${fetchText()}`;
  fetchText();
  setTimeout(() => parag.classList.add("show-text"), 500);
  if (parag) {
    // btnStart.style.display = "none";
    btnUpdate.removeAttribute("hidden");
  }
  input.removeAttribute("disabled");
  btnStart.setAttribute("disabled", "true");
});

// Вывод нового фрагмента по нажатию на кнопку обновления текста
btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  setTimeout(() => {
    fetchText();
  }, 500);
  setTimeout(() => parag.classList.add("show-text"), 500);

  parag.classList.remove("show-text");
  reset();
  input.value = "";
  input.style.border = "";
});

input.addEventListener("keypress", start, false);
input.addEventListener("keyup", checkSpellText, false);
input.addEventListener("keyup", charCount, false);
