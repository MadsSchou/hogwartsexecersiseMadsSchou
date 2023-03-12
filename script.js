"use strict";

let bloodData;
const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
  expelled: false,
};
window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");
  getBlood();
  addEventListeners();
}
const globalProps = { chosenFilter: "*" };

let popupStudent = null;
let expelledStudents = [];
let prefectStudents = [];
let isHacked = false;

let allStudents = [];
const Student = {
  firstname: null,
  lastname: null,
  middlename: null,
  nickname: null,
  image: null,
  house: null,
  gender: null,
  expel: false,
  prefect: false,
  inquisitorial: false,
  bloodType: "",
};

// //_______GetData________//
async function getBlood() {
  const responsBlood = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
  bloodData = await responsBlood.json();
  getData();
}
async function getData() {
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");

  const data = await response.json();

  console.log(data);

  prepareObjects(data);
  //  console.table(allStudents);
  buildList();
}
//_______Bloodstatus_______//

function addBloodStatus(student, bloodData) {
  let bloodStatus = "muggle";

  const isPure = bloodData.pure.some((element) => student.lastname === element);
  const isHalf = bloodData.half.some((element) => student.lastname === element);

  if (isHalf) {
    bloodStatus = "half";
  } else if (isPure) {
    bloodStatus = "pure";
  }
  return bloodStatus;
}

//____________PREPARE DATA_______________//
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
    student.gender = jsonObject.gender.charAt(0).toUpperCase() + jsonObject.gender.slice(1).toLowerCase();
    student.house = jsonObject.house.trim().charAt(0).toUpperCase() + jsonObject.house.trim().slice(1).toLowerCase();
    student.bloodstatus = addBloodStatus(student, bloodData);

    allStudents.push(student);
  });
}

//___EventListeners____//

function addEventListeners() {
  document.querySelector(`[data-filter="hufflepuff"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="rawenclaw"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="gryffindor"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="slytherin"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="*"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="expelledstudents"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="prefectedstudents"]`).addEventListener("click", klikFilter);
  document.querySelector("#search").addEventListener("input", searchFieldInput);
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

function buildList() {
  console.log("BUILD LIST");
  const currentList = filterList(allStudents);
  displayList(currentList);
}

//_________ Searchbar_______//
function searchFieldInput(evt) {
  // write to the list with only those elements in the studentArray that has properties containing the search frase
  displayList(
    studentArray.filter((elm) => {
      // comparing in uppercase so that m is the same as M
      return elm.firstName.toUpperCase().includes(evt.target.value.toUpperCase()) || elm.lastName.toUpperCase().includes(evt.target.value.toUpperCase());
    })
  );
}
//_______Counter_______//

function updateCounter() {
  let gryffindorCount = 0;
  let slytherinCount = 0;
  let hufflepuffCount = 0;
  let ravenclawCount = 0;
  let expelledCount = 0;
  let nonexpelledCount = 0;

  allStudents.forEach((student) => {
    if (student.expel) {
      expelledCount++;
    } else {
      nonexpelledCount++;
      switch (student.house) {
        case "Gryffindor":
          gryffindorCount++;
          break;
        case "Slytherin":
          slytherinCount++;
          break;
        case "Hufflepuff":
          hufflepuffCount++;
          break;
        case "Ravenclaw":
          ravenclawCount++;
          break;
      }
    }
  });
  function getHouseCount(house) {
    switch (house) {
      case "Gryffindor":
        return gryffindorCount;
      case "Slytherin":
        return slytherinCount;
      case "Hufflepuff":
        return hufflepuffCount;
      case "Ravenclaw":
        return ravenclawCount;
    }
  }

  // Update the Gryffindor count
  document.querySelector('[data-field="gryffindor"]').textContent = getHouseCount("Gryffindor");

  // Update the Slytherin count
  document.querySelector('[data-field="slytherin"]').textContent = getHouseCount("Slytherin");

  // Update the Hufflepuff count
  document.querySelector('[data-field="hufflepuff"]').textContent = getHouseCount("Hufflepuff");

  // Update the Ravenclaw count
  document.querySelector('[data-field="ravenclaw"]').textContent = getHouseCount("Ravenclaw");
}
//___________Filter house__________//
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
  } else if (globalProps.chosenFilter === "expelledstudents") {
    theFilteredList = listToFilter.filter(isExpelled);
  } else if (globalProps.chosenFilter === "prefectedstudents") {
    theFilteredList = listToFilter.filter(isPrefected);
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
function isExpelled(student) {
  return student.expel === "Expelled";
}

function isPrefected(student) {
  return student.prefect === "Prefected";
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

//__________Sorting__________//
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

//___________Display Student____________//
function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstname]").innerHTML = student.firstName;
  clone.querySelector("[data-field=lastname]").innerHTML = student.lastName;
  clone.querySelector("[data-field=house]").innerHTML = student.house;
  clone.querySelector("[data-field=student_img]").src = student.imgSrc;
  clone.querySelector("[data-field=student_img]").addEventListener("click", () => showPopup(student));
  //___________EXPELL________ //
  if (student.expel) {
    clone.querySelector("[data-field=expel]").innerHTML = "assets/extrafeatures/expel.svg";
  } else {
    // clone.querySelector("[data-field=expel]").textContent = "☆";
    clone.querySelector("[data-field=expel]").src = "assets/extrafeatures/expel.svg";
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

  //__________Prefects Setup_________//
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

  document.querySelector("#list tbody").appendChild(clone);
}

//___________Make Prefect___________//
function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);

  const numberOfPrefects = prefects.length;
  const other = prefects.filter((student) => student.type === selectedStudent.type).shift();

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

//_________Popup__________//

function showPopup(student) {
  const popup = document.querySelector("#popup");

  popup.style.display = "block";
  popup.querySelector("[data-field=firstname]").textContent = student.firstName;
  popup.querySelector("[data-field=middlename]").textContent = student.middleName;
  popup.querySelector("[data-field=nickname]").textContent = student.nickName;
  popup.querySelector("[data-field=lastname]").textContent = student.lastName;
  popup.querySelector("[data-field=house]").textContent = student.house;
  popup.querySelector("[data-field=student_img]").src = student.imgSrc;
  popup.querySelector("[data-field=bloodstatus]").textContent = student.bloodstatus;

  popup.addEventListener("click", () => (popup.style.display = "none"));
}

//_______HACKING_______//
function hackTheSystem() {
  console.log("hacking");
  addMads();
  randomizeBlood();
}
function addMads() {
  let me = Object.create(studentArray);
  let mystudentPicture = new Image();
  me.firstName = "Mads";
  me.lastName = "Olesen";
  me.middleName = "Schou";
  me.nickName = "Oeren";
  me.house = "Rawenclaw";
  me.bloodType = "pureblood";
  me.prefect = true;
  mystudentPicture.scr = "images/potter.png";
  me.image = mystudentPicture.scr;

  studentArray.push(me);
  buildList();
}

function randomizeBlood() {
  allStudents.forEach((student) => {
    const bloodStatuses = ["pure", "half", "muggle"];
    const newBloodStatus = bloodStatuses[Math.floor(Math.random() * bloodStatuses.length)];
    if (student.bloodstatus === "pure") {
      student.bloodstatus = newBloodStatus;
    } else {
      student.bloodstatus = "pure";
    }

    buildList();
  });
}
