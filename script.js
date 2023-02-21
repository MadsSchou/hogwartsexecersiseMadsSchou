window.addEventListener("DOMContentLoaded", start);
const globalProps = { chosenFilter: "*" };
// const allStudents = [];

async function getData(url) {
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

function cleanUpData(studentsList, i) {
  // console.log(studentsList);

  // Student object
  const Student = {
    studentId: null,
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    gender: "",
    imgSrc: "",
    house: "",
    // blood: "",
    // prefect: false,
    // expelled: false,
    // inqSquad: false,
    // hacker: null,
  };

  const student = Object.create(Student);
}

function start() {
  console.log("ready");

  addEventListeners();
  loadJSON();
}
function addEventListeners() {
  document.querySelector(`[data-filter="hufflepuff"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="rawenclaw"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="gryffindor"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="slytherin"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="*"]`).addEventListener("click", klikFilter);
}

function klikFilter(evt) {
  // console.log("klikFilter", evt.target.dataset.filter);
  globalProps.chosenFilter = evt.target.dataset.filter;
  buildList();
}

async function loadJSON() {
  const response = await fetch("student.json");
  const jsonData = await response.json();
  console.log(data);

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(preapareObject);

  buildList();
}
function buildList() {
  console.log("BUILD LIST");
  const currentList = filterList(allStudents);

  displayList(currentList);
}

function filterList(theFilteredList) {
  if (globalProps.chosenFilter === "hufflepuff") {
    theFilteredList = allStudents.filter(isHufflepuff);
  } else if (globalProps.chosenFilter === "rawenclaw") {
    theFilteredList = allStudents.filter(isRawenclaw);
  }
  return theFilteredList;
}

function isHufflepuff(student) {
  if (student.type === "hufflepuff") {
    return true;
  }
}
function isRawenclaw(student) {
  if (student.type === "rawenclaw") {
    return true;
  }
}
function isGryffindor(student) {
  if (student.type === "gryffindor") {
    return true;
  }
}
function isSlytherin(student) {
  if (student.type === "slytherin") {
    return true;
  }
}

function preapareObject(jsonObject) {
  const student = Object.create(Student);

  const texts = jsonObject.fullname.split(" ");
  student.name = texts[0];
  student.desc = texts[2];
  student.type = texts[3];
  student.age = jsonObject.age;

  return student;
}

// let data;
// let filter = "alle";

// const filterKnapper = document.querySelectorAll("nav li");
// filterKnapper.forEach((knap) => knap.addEventListener("click", filtrerKategorier));
// hentData();

// function filtrerKategorier() {
//   filter = this.dataset.kategori;
//   document.querySelector(".valgt").classList.remove("valgt");
//   this.classList.add("valgt");
//   vis(data);
// }

// async function hentData() {
//   const respons = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
//   data = await respons.json();
//   console.log(data);
//   vis(data);
// }

// function vis(data) {
//   const main = document.querySelector("main");
//   const template = document.querySelector("template").content;
//   main.textContent = "";
//   data.forEach((student) => {
//     if (filter == student.kategori || filter == "alle") {
//       const klon = template.cloneNode(true);
//       klon.querySelector("article").addEventListener("click", () => visStudent(student));
//       klon.querySelector(".billedeurl").src = "medium/" + student.billednavn + "-md.jpg";
//       klon.querySelector(".firstname").textContent = student.firstname;
//       klon.querySelector(".lastname").textContent = student.lastname;
//       main.appendChild(klon);
//     }
//   });
// }
// function visStudent(studentData) {
//   console.log(studentData);
//   const popop = document.querySelector("#popop");
//   popop.style.display = "flex";
//   popop.querySelector(".billedeurl").src = "medium/" + studentData.billednavn + "-md.jpg";
//   //   popop.querySelector("h3").textContent = studentData.navn;
//   popop.querySelector(".firstname").textContent = studentData.firstname;
//   popop.querySelector(".lastname").textContent = studentData.lastname;
//   popop.querySelector(".middlename").textContent = studentData.middlename;
//   popop.querySelector(".nickname").textContent = studentData.nickname;
//   popop.addEventListener("click", () => (popop.style.display = "none"));
// }

// hentData();
// /*Burgermenu*/
// const btn = document.querySelector(".toggle-btn");
// const menu = document.querySelector(".main-menu");
// const menuimg = btn.querySelector("img");
// function toggleMenu() {
//   menu.classList.toggle("shown");
//   const menuShown = menu.classList.contains("shown");
//   if (menuShown) {
//     console.log(menuShown);
//     menuimg.src = "medium/luk.svg";
//   } else {
//     console.log(menuShown);
//     menuimg.src = "medium/burgermenu.svg";
//   }
// }
// btn.addEventListener("click", toggleMenu);
