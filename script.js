const body = document.querySelector("body");

const root = document.createElement("div");
root.className = "container";

const title = document.createElement("h1");
title.className = "title";
title.innerText = "Тренажер слепой печати";

const parag = document.createElement("ul");
parag.className = "text";

const btnStart = document.createElement("button");
btnStart.className = "button";
btnStart.setAttribute('type', 'button');
btnStart.innerText = 'Начать тест';

const btnUpdate = document.createElement("button");
btnUpdate.className = "button";
btnUpdate.setAttribute('type', 'button');
btnUpdate.setAttribute('hidden', 'false');
btnUpdate.setAttribute('title', 'Обновить текст');

const input = document.createElement("textarea");
input.className = "textarea";
input.setAttribute('wrap', 'soft');
input.setAttribute("rows", "7");
input.setAttribute("placeholder", "Напечатайте текст как в примере...");

body.append(root);
root.append(title);
root.append(input);
root.append(parag);
root.append(btnStart);
root.append(btnUpdate);
parag.after(input);
btnStart.after(input);

const url = "https://baconipsum.com/api/?type=meat-and-filler"

btnStart.addEventListener("click", e => {
    e.preventDefault();
    fetch(url)
    .then(res => res.json())
    .then(result => {
        let html = '';
        result.map(element => {
        return html = `<li id=${(Math.random() * 100).toFixed(0)}>${element}</li>`})
        parag.innerHTML = html;
        setTimeout(() => parag.classList.add("show-text"), 500);
    })
    if(parag) {
        btnStart.setAttribute('hidden', 'true')
        btnUpdate.removeAttribute('hidden')
    }
})

btnUpdate.addEventListener("click", e => {
    e.preventDefault();
    fetch(url)
    .then(res => res.json())
    .then(result => {
        let html = '';
        result.map(element => {
        return html = `<li id=${(Math.random() * 100).toFixed(0)}>${element}</li>`})
        setTimeout(() => {parag.innerHTML = html}, 500);
        setTimeout(() => parag.classList.add("show-text"), 500);
        parag.classList.remove("show-text");
    })
    
})

