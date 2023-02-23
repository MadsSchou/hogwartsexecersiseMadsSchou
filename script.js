"use strict";

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");
  getData();
}

const allStudents = [];
const Student = {
  firstName: null,
  lastName: null,
  middleName: null,
  nickName: null,
  image: null,
  house: null,
};

async function getData() {
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  const data = await response.json();
  console.log(data);
  prepareObjects(data);
  console.table(allStudents);
  displayList();
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

    student.house = jsonObject.house.trim().charAt(0).toUpperCase() + jsonObject.house.trim().slice(1).toLowerCase();
    allStudents.push(student);
  });
}
displayList();

function displayList() {
  document.querySelector("#list tbody").innerHTML = "";
  allStudents.forEach(displayStudent);
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
