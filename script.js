"use strict";

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");
  getData();
  addEventListeners();
}
const globalProps = { chosenFilter: "*" };

const allStudents = [];
const Student = {
  firstName: null,
  lastName: null,
  middleName: null,
  nickName: null,
  image: null,
  house: null,
};
function addEventListeners() {
  document.querySelector(`[data-filter="hufflepuff"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="rawenclaw"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="gryffindor"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="slytherin"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="*"]`).addEventListener("click", klikFilter);
}

function klikFilter(evt) {
  const filter = evt.target.dataset.filter;
  console.log("Filtering:", filter);
  setFilter(filter);
}

function setFilter(filter) {
  globalProps.chosenFilter = filter;
  buildList();
}

async function getData() {
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  const data = await response.json();
  console.log(data);
  prepareObjects(data);
  console.table(allStudents);
  buildList();
}

function buildList() {
  console.log("BUILD LIST");
  const currentList = filterList(allStudents);
  displayList(currentList);
}

// --------- searchbar ---------
function searchFieldInput(evt) {
  settings.search = evt.target.value;
  buildList();
}

function searchList(list) {
  return list.filter((student) => {
    return student.firstName.toUpperCase().includes(settings.search.toUpperCase()) || student.lastName.toUpperCase().includes(settings.search.toUpperCase()) || student.house.toUpperCase().includes(settings.search.toUpperCase());
  });
}
//Filter on house

function filterList(listToFilter) {
  let theFilteredList = listToFilter;

  if (globalProps.chosenFilter === "hufflepuff") {
    theFilteredList = listToFilter.filter(isHufflepuff);
  } else if (globalProps.chosenFilter === "rawenclaw") {
    theFilteredList = listToFilter.filter(isRawenclaw);
  } else if (globalProps.chosenFilter === "gryffindor") {
    theFilteredList = listToFilter.filter(isGryffindor);
  } else if (globalProps.chosenFilter === "slytherin") {
    theFilteredList = listToFilter.filter(isSlytherin);
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

function displayList(students) {
  // console.table(students);
  // console.log(students);
  // clear the list
  document.querySelector("#student_list").innerHTML = "";

  // count students
  const studentCounted = studentCounter(students);
  displayCount(studentCounted);

  // build a new list
  students.forEach(displayStudent);
}

function prepareObjects(data) {
  data.forEach((jsonObject) => {
    const student = Object.create(Student);

    const nameArray = jsonObject.fullname.trim().split(" ");
    let firstName,
      middleName,
      lastName = "",
      nickName;
    const nickNameIndex = nameArray.findIndex((name, index) => {
      return name.startsWith('"') && name.endsWith('"');
    });
    if (nickNameIndex !== -1) {
      nickName = nameArray[nickNameIndex].replaceAll(`"`, "");
      nickName = nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
      nameArray.splice(nickNameIndex, 1);
    }
    if (nameArray.length === 1) {
      firstName = nameArray[0];
    } else if (nameArray.length === 2) {
      firstName = nameArray[0];
      lastName = nameArray[1];
    } else {
      firstName = nameArray[0];
      middleName = nameArray.slice(1, -1).join(" ");
      lastName = nameArray[nameArray.length - 1];
    }

    console.log(nickNameIndex);
    //Get lastname and firstname
    if (lastName) {
      student.lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    }

    student.firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

    //Get middlename
    if (middleName) {
      student.middleName = middleName.charAt(0).toUpperCase() + middleName.slice(1).toLowerCase();
    }

    //Get nickname
    if (nickName) {
      student.nickName = nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
    }

    // //Get Justin Finch-Fletchey
    // if (nickName) {
    //   student.nickName = nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
    // }
    // //Get Leanne Null
    // if (nickName) {
    //   student.nickName = nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
    // }
    // //Get Parvati Patil
    // if (nickName) {
    //   student.nickName = nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
    // }
    // //Get Padma Patil
    // if (nickName) {
    //   student.nickName = nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
    // }

    //Studentsimg
    student.imgSrc = `./assets/images/${lastName.substring(0, firstName.indexOf(" ")).toLowerCase()}_.png`;
    student.imgSrc = `./assets/images/${lastName.substring(firstName.lastIndexOf(" ") + 1, firstName.lastIndexOf(" ") + 2).toLowerCase() + lastName.substring(firstName.lastIndexOf(" ") + 2).toLowerCase()}_${firstName.substring(0, 1).toUpperCase().toLowerCase()}.png`;

    student.house = jsonObject.house.trim().charAt(0).toUpperCase() + jsonObject.house.trim().slice(1).toLowerCase();

    allStudents.push(student);
  });
}

//Sorting
document.querySelectorAll("table th").forEach((header) => {
  header.addEventListener("click", () => {
    sortTable(header.dataset.sort);
  });
});
function sortTable(column) {
  const table = document.querySelector("table");
  const rows = Array.from(table.querySelectorAll("tbody tr"));

  // Sort the rows based on the value of the clicked column
  rows.sort((a, b) => {
    const aValue = a.querySelector(`[data-field="${column}"]`).textContent.trim();
    const bValue = b.querySelector(`[data-field="${column}"]`).textContent.trim();
    return aValue.localeCompare(bValue);
  });

  // Clear the current table data
  table.querySelector("tbody").innerHTML = "";

  // Add the sorted rows to the table
  rows.forEach((row) => {
    table.querySelector("tbody").appendChild(row);
  });
}

function displayList() {
  const filteredStudents = filterList(allStudents, globalProps.chosenFilter);
  document.querySelector("#list tbody").innerHTML = "";
  filteredStudents.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstname]").innerHTML = student.firstName;
  clone.querySelector("[data-field=middlename]").innerHTML = student.middleName;
  clone.querySelector("[data-field=nickname]").innerHTML = student.nickName;
  clone.querySelector("[data-field=lastname]").innerHTML = student.lastName;
  clone.querySelector("[data-field=house]").innerHTML = student.house;
  clone.querySelector("[data-field=student_img]").src = student.imgSrc;
  clone.querySelector("[data-field=student_img]").alt = `Picture of ${student.firstName} ${student.lastName}`;

  document.querySelector("#list tbody").appendChild(clone);
}

//popup
// popop

const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}
