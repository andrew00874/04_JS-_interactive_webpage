const checkList = {
  inputId: false,
  inputPw: false,
  inputPwCheck: false,
  inputName: false,
  // inputGender: false,
};

const signupForm = document.getElementById("signupForm");
const inputId = document.getElementById("inputId");
const inputPw = document.getElementById("inputPw");
const inputPwCheck = document.getElementById("confirm-pw");
const inputName = document.getElementById("inputName");
const btn = document.getElementById("btn");
const idResult = document.getElementById("idResult");
const pwResult = document.getElementById("pwResult");
const pwCheckResult = document.getElementById("pwCheckResult");
const nameResult = document.getElementById("nameResult");
const reset = document.getElementById("reset");

const regExpId = /^[A-Za-z0-9\-\_]{6,16}$/;
const regExpName = /^[가-힣]{2,15}$/;
const regExpPw = /^[A-Za-z\d!@#$%^&*]{8,20}$/;

inputId.addEventListener("input", (e) => {
  const valid = e.target.value;
  if (valid.trim().length == 0) {
    idResult.textContent = "영어, 숫자, -, _ 6~16글자 사이 작성하세요.";
    e.target.addEventListener = "";
    idResult.classList.remove("check", "error");
    checkList["inputId"] = false;
    return;
  }

  if (regExpId.test(valid)) {
    idResult.textContent = "유효한 아이디 형식입니다.";
    idResult.classList.add("check");
    idResult.classList.remove("error");
    checkList["inputId"] = true;
  } else {
    idResult.textContent = "유효하지 않은 아이디 형식입니다.";
    idResult.classList.add("error");
    idResult.classList.remove("check");
    checkList["inputId"] = false;
  }
});

inputPw.addEventListener("input", (e) => {
  const valid = e.target.value;
  if (valid.trim().length == 0) {
    pwResult.textContent =
      "영어 대/소문자 + 숫자 + 특수문자 (!@#$%^&*) 포함 8~20글자";
    e.target.addEventListener = "";
    pwResult.classList.remove("check", "error");
    checkList["inputPw"] = false;
    return;
  }

  if (regExpPw.test(valid)) {
    pwResult.textContent = "유효한 비밀번호 형식입니다.";
    pwResult.classList.add("check");
    pwResult.classList.remove("error");
    checkList["inputPw"] = true;
  } else {
    pwResult.textContent = "유효하지 않은 비밀번호 형식입니다.";
    pwResult.classList.add("error");
    pwResult.classList.remove("check");
    checkList["inputPw"] = false;
  }
});

inputPwCheck.addEventListener("input", (e) => {
  const pwcheck = e.target.value;
  const pw = inputPw.value;
  if (pwcheck.trim().length == 0) {
    pwcheck.textContent = "비밀번호를 먼저 입력해주세요.";
    e.target.addEventListener = "";
    pwCheckResult.classList.remove("check", "error");
    checkList["inputPw"] = false;
    return;
  }
  if (pw === pwcheck) {
    pwCheckResult.textContent = "비밀번호가 일치합니다.";
    checkList["inputPwCheck"] = true;
    pwCheckResult.classList.add("check");
    pwCheckResult.classList.remove("error");
  } else {
    pwCheckResult.textContent = "비밀번호가 불일치합니다.";
    checkList["inputPwCheck"] = false;
    pwCheckResult.classList.remove("check");
    pwCheckResult.classList.add("error");
  }
});

inputName.addEventListener("input", (e) => {
  const name = inputName.value;
  if (name.length === 0) {
    nameResult.textContent = "한글 2~15자 (단모음, 단자음 제외)";
    nameResult.classList.remove("check", "error");
    checkList["inputName"] = false;
    return;
  }
  if (regExpName.test(name)) {
    nameResult.classList.add("check");
    nameResult.classList.remove("error");
    checkList["inputName"] = true;
  } else {
    nameResult.classList.add("error");
    nameResult.classList.remove("check");
    checkList["inputName"] = false;
  }
});

// gender.addEventListener("change", function () {
//   checkList["inputGender"] = true;
// });

reset.addEventListener("click", () => {
  const genRadio = document.querySelectorAll("input[name='gender']");
  inputId.value = "";
  inputName.value = "";
  inputPw.value = "";
  inputPwCheck.value = "";
  genRadio.forEach((radio) => {
    radio.checked = false;
  });
  inputId.dispatchEvent(new Event("input"));
  inputName.dispatchEvent(new Event("input"));
  inputPw.dispatchEvent(new Event("input"));
  inputPwCheck.dispatchEvent(new Event("input"));
});

btn.addEventListener("click", () => {
  const gender = document.querySelector("input[name='gender']:checked");

  for (let key in checkList) {
    if (!checkList[key]) {
      let message;
      switch (key) {
        case "inputId":
          message = "아이디를";
          break;
        case "inputPw":
          message = "비밀번호를";
          break;
        case "inputPwCheck":
          message = "비밀번호 확인을";
          break;
        case "inputName":
          message = "이름을";
          break;
        // case "inputGender":
        //   message = "성별을";
        //   break;
      }

      alert(message + " 확인해주세요.");
      //   reset.dispatchEvent(new Event("click"));
      return;
    }
  }
  if (gender == null) {
    alert("성별을 체크해주세요!");
    return;
  }
  alert("회원가입 완료!");
  signupForm.submit();
  reset.dispatchEvent(new Event("click"));
});
