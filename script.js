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
  expel: false,
  prefect: false,
  gender: null,
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

// searchbar
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
  return student.house === "Hufflepuff";
}

function isRawenclaw(student) {
  return student.house === "Ravenclaw";
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
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

    //Studentsimg
    student.imgSrc = `./assets/images/${lastName.substring(0, firstName.indexOf(" ")).toLowerCase()}_.png`;
    student.imgSrc = `./assets/images/${lastName.substring(firstName.lastIndexOf(" ") + 1, firstName.lastIndexOf(" ") + 2).toLowerCase() + lastName.substring(firstName.lastIndexOf(" ") + 2).toLowerCase()}_${firstName.substring(0, 1).toUpperCase().toLowerCase()}.png`;

    // There are two students with the lastName Patil
    if (student.lastName === "Patil") {
      student.imgSrc = `./assets/images/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
    } else {
      student.imgSrc = `./assets/images/${lastName.substring(lastName.lastIndexOf(""), lastName.indexOf("-") + 1).toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
    }

    // There is a student with no lastName "Leanne"

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
  clone.querySelector("[data-field=student_img]").addEventListener("click", () => showPopup(student));

  // Show  expel.svg or expel.svg
  if (student.expel) {
    clone.querySelector("[data-field=expel]").src = "assets/expel.svg";
  } else {
    // clone.querySelector("[data-field=expel]").textContent = "☆";
    clone.querySelector("[data-field=expel]").src = "assets/expelgrey.svg";
  }

  clone.querySelector("[data-field=expel]").addEventListener("click", clickExpel);

  function clickExpel() {
    // console.log("starToggle");
    if (student.expel === true) {
      student.expel = false;
    } else {
      student.expel = true;
    }
    // console.log(student);
    displayList(allStudents);
  }

  //Prefects
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);
  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    buildList();
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);

  const numberOfPrefects = prefects.length;
  const other = prefects.filter((student) => student.type === selectedStudent.type).shift();

  //if theres is another of the same type
  if (other !== undefined) {
    console.log("There can only be one prefect of each type");
    removeOther(other);
  } else if (numberOfPrefects >= 2) {
    console.log("There can only be two prefects");
    removeAorB(prefects[0], prefects[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeOther(other) {
    //ask user to ignore or remove other
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);

    document.querySelector("#remove_other #removeotherbutton").addEventListener("click", clickRemoveOther);

    //show name
    document.querySelector("#remove_other [data-field=otherprefect]").textContent = other.name;

    //if ignore do nothing
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document.querySelector("#remove_other #removeotherbutton").removeEventListener("click", clickRemoveOther);
      document.querySelector("#remove_other #removeotherbutton").removeEventListener("click", clickRemoveOther);
    }
    //if remove the other
    function clickRemoveOther() {
      console.log(selectedStudent);
      removePrefect(other);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removeAorB(prefectA, prefectB) {
    //ask user to ignore or remove a or b
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

    //show names on buttons

    document.querySelector("#remove_aorb [data-field=prefectA]").textContent = prefectA.name;
    document.querySelector("#remove_aorb [data-field=prefectB]").textContent = prefectB.name;

    //if ignore do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      //if removeA
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      //else removeB
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}

//popup

function showPopup(student) {
  const popup = document.querySelector("#popup");

  popup.style.display = "block";
  popup.querySelector("[data-field=firstname]").textContent = student.firstName;
  popup.querySelector("[data-field=middlename]").textContent = student.middleName;
  popup.querySelector("[data-field=nickname]").textContent = student.nickName;
  popup.querySelector("[data-field=lastname]").textContent = student.lastName;
  popup.querySelector("[data-field=house]").textContent = student.house;
  popup.querySelector("[data-field=student_img]").src = student.imgSrc;

  popup.addEventListener("click", () => (popup.style.display = "none"));
}

// // luk popup
// document.querySelector("#luk").addEventListener("click", () => (popup.style.display = "none"));
