// HTML 문서 로딩이 완료된 후 스크립트 실행
document.addEventListener("DOMContentLoaded", () => {
  // 유효성 검사 결과 저장 객체
  const checkList = {
    inputId: false,
    inputPw: false,
    inputPwCheck: false,
    inputName: false,
  };

  // DOM 요소 가져오기
  const signupForm = document.getElementById("signupForm");
  const inputId = document.getElementById("inputId");
  const inputPw = document.getElementById("inputPw");
  const inputPwCheck = document.getElementById("confirm-pw");
  const inputName = document.getElementById("inputName");
  const btn = document.getElementById("btn");

  // --- 유효성 검사 함수 ---
  const validate = (inputEl, resultEl, regExp, checkKey) => {
    const value = inputEl.value;
    if (regExp.test(value)) {
      resultEl.textContent = "유효한 형식입니다.";
      resultEl.classList.add("check");
      resultEl.classList.remove("error");
      checkList[checkKey] = true;
    } else {
      resultEl.textContent = "유효하지 않은 형식입니다.";
      resultEl.classList.add("error");
      resultEl.classList.remove("check");
      checkList[checkKey] = false;
    }
  };

  // --- 정규 표현식 ---
  const regExp = {
    id: /^[a-zA-Z0-9\-_]{6,16}$/,
    pw: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/,
    name: /^[가-힣]{2,15}$/,
  };

  // --- 이벤트 리스너 설정 ---
  inputId.addEventListener("input", () =>
    validate(inputId, idResult, regExp.id, "inputId")
  );
  inputPw.addEventListener("input", () =>
    validate(inputPw, pwResult, regExp.pw, "inputPw")
  );
  inputName.addEventListener("input", () =>
    validate(inputName, nameResult, regExp.name, "inputName")
  );

  inputPwCheck.addEventListener("input", () => {
    const pwCheckResult = document.getElementById("pwCheckResult");
    if (inputPw.value.length === 0) {
      pwCheckResult.textContent = "비밀번호를 먼저 입력해주세요.";
      pwCheckResult.classList.remove("check", "error");
      checkList.inputPwCheck = false;
      return;
    }
    if (inputPw.value === inputPwCheck.value) {
      pwCheckResult.textContent = "비밀번호가 일치합니다.";
      pwCheckResult.classList.add("check");
      pwCheckResult.classList.remove("error");
      checkList.inputPwCheck = true;
    } else {
      pwCheckResult.textContent = "비밀번호가 일치하지 않습니다.";
      pwCheckResult.classList.add("error");
      pwCheckResult.classList.remove("check");
      checkList.inputPwCheck = false;
    }
  });

  // 초기화 버튼을 누르면(type="reset") 폼이 초기화된 후 실행됩니다.
  signupForm.addEventListener("reset", () => {
    for (const key in checkList) {
      checkList[key] = false;
    }
    document.getElementById("idResult").textContent =
      "영어, 숫자, -, _ 6~16글자 사이";
    document.getElementById("pwResult").textContent =
      "영어 대/소문자 + 숫자 + 특수문자 (!@#$%^&*) 포함 8~20글자";
    document.getElementById("pwCheckResult").textContent =
      "비밀번호를 먼저 입력해주세요.";
    document.getElementById("nameResult").textContent =
      "한글 2~15자 (단모음, 단자음 제외)";

    document.querySelectorAll(".input-result").forEach((el) => {
      el.classList.remove("check", "error");
    });
  });

  // --- 회원가입 최종 제출 ---
  window.onRecaptchaLoad = function () {
    console.log("reCAPTCHA v2 로드 완료, 이벤트 리스너를 등록합니다.");
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      if (!document.querySelector("input[name='gender']:checked")) {
        alert("성별을 체크해주세요!");
        return;
      }
      for (let key in checkList) {
        if (!checkList[key]) {
          alert("입력 양식을 올바르게 작성해주세요.");
          return;
        }
      }
      if (grecaptcha.getResponse().length === 0) {
        alert("보안문자(reCAPTCHA)를 체크해주세요.");
        return;
      }

      // --- ▼▼▼ 이 부분이 데이터를 저장하는 로직입니다 ▼▼▼ ---

      // 1. 기존에 localStorage에 저장된 사용자 정보가 있는지 확인합니다.
      // JSON.parse()를 사용해 문자열을 실제 자바스크립트 배열로 변환합니다.
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // ★★★ 추가된 로직: ID 중복 검사 ★★★
      const isDuplicateId = users.some((user) => user.id === inputId.value);

      if (isDuplicateId) {
        alert("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
        inputId.focus(); // 아이디 입력창에 다시 포커스를 줍니다.
        return; // 회원가입 절차를 중단합니다.
      }
      // ★★★ 중복 검사 로직 끝 ★★★

      
      // 2. 새로 가입하는 사용자 정보를 객체로 만듭니다.
      const newUser = {
        id: inputId.value,
        name: inputName.value,
        pw: inputPw.value, // ⚠️ 실제 서비스에서는 비밀번호를 절대 그대로 저장하면 안 됩니다!
      };

      // 3. 기존 사용자 배열에 새 사용자 정보를 추가합니다.
      users.push(newUser);

      // 4. 업데이트된 배열을 다시 JSON 문자열 형태로 변환하여 localStorage에 저장합니다.
      localStorage.setItem("users", JSON.stringify(users, null, 2));
      // (null, 2)는 JSON을 예쁘게 포맷팅하기 위한 옵션입니다.

      // --- ▲▲▲ 데이터 저장 로직 끝 ▲▲▲ ---

      alert("회원가입이 완료되었습니다!");

      // 회원가입 완료 후 메인 페이지로 이동
      location.href = "index.html";
    });
  };
});
