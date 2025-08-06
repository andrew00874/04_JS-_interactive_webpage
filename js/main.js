// $(function () {
//   // Function to apply the theme based on the value in localStorage
//   function applyTheme() {
//     if (localStorage.getItem("darkMode") === "enabled") {
//       $("body").addClass("dark-mode");
//     } else {
//       $("body").removeClass("dark-mode");
//     }
//   }

//   // Apply the theme as soon as the page loads
//   applyTheme();

//   // Event handler for the dark mode button
//   $("#darkmode").click(() => {
//     // Toggle the .dark-mode class on the body
//     $("body").toggleClass("dark-mode");

//     // Check if dark mode is now enabled or disabled and save it to localStorage
//     if ($("body").hasClass("dark-mode")) {
//       localStorage.setItem("darkMode", "enabled");
//     } else {
//       localStorage.removeItem("darkMode");
//     }
//   });
// });

// // 💡 페이지가 로드되면 상품 데이터를 가져와서 화면에 표시합니다.
// document.addEventListener("DOMContentLoaded", () => {
//   // data 폴더에 있는 products.json 파일을 가져옵니다.
//   // fetch의 경로 '../data/products.json'는 html 파일 위치를 기준으로 합니다.
//   // 만약 home.html이 루트 폴더에 있다면 '/data/products.json' 또는 'data/products.json'으로 변경해야 합니다.
//   fetch("../json/product.json")
//     .then((response) => response.json()) // 응답을 JSON 형태로 파싱합니다.
//     .then((products) => {
//       // JSON 데이터가 성공적으로 로드되면, 상품 목록을 화면에 렌더링합니다.
//       const productContainer = document.querySelector(".products");

//       // 기존 상품 목록을 비웁니다.
//       productContainer.innerHTML = "";

//       // 모든 상품에 대해 HTML 요소를 생성합니다.
//       products.forEach((product) => {
//         const productItem = document.createElement("article");
//         productItem.className = "product-item";

//         // toLocaleString('ko-KR')을 사용해 숫자를 1,000 단위 콤마가 있는 통화 형식으로 변환합니다.
//         const formattedPrice = `${product.price.toLocaleString("ko-KR")}원`;

//         productItem.innerHTML = `
//           <a href="./product.html?id=${product.id}">
//             <img
//               src="${product.image}"
//               alt="${product.name}"
//             />
//             <div class="product-info">
//               <h3 class="product-name">${product.name}</h3>
//               <p class="product-price">${formattedPrice}</p>
//             </div>
//           </a>
//         `;
//         productContainer.appendChild(productItem);
//       });
//     })
//     .catch((error) => console.error("상품 데이터를 불러오는 중 오류 발생:", error));
// });
$(function () {
  // 햄버거 메뉴 토글 기능
  $(".nav-toggle").click(function () {
    $(".header-right-group").toggleClass("is-active");
  });
});

$(function () {
  // 다크모드 기능 (기존과 동일)
  function applyTheme() {
    if (localStorage.getItem("darkMode") === "enabled") {
      $("body").addClass("dark-mode");
    } else {
      $("body").removeClass("dark-mode");
    }
  }
  applyTheme();
  $("#darkmode").click(() => {
    $("body").toggleClass("dark-mode");
    if ($("body").hasClass("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.removeItem("darkMode");
    }
  });

  $("#login").click(function () {
    // 여기에 모달 열기 코드 작성
    $("#loginModal").css("display", "flex");
    $("#loginModal").fadeIn(300);
  });

  $("#closeModal").click(function () {
    // 여기에 모달 닫기 코드 작성
    $("#loginModal").fadeOut(300);
    $("#loginModal").css("display", "none");
  });

  $("#loginModal").click(function (e) {
    // 여기에 배경 클릭 시 모달 닫기 코드 작성
    // HINT: e.target === this 조건 사용
    if (e.target === this) {
      $("#loginModal").fadeOut(300);
      $("#loginModal").css("display", "none");
    }
  });
  // 💡 1. 모든 상품 데이터를 저장할 변수 선언
  let allProducts = [];

  // 💡 2. 상품 목록을 화면에 렌더링하는 함수 생성
  const productContainer = document.querySelector(".products");
  function renderProducts(products) {
    // 상품 목록 컨테이너 비우기
    productContainer.innerHTML = "";

    // 주어진 상품 데이터로 화면에 상품 아이템들을 추가
    products.forEach((product) => {
      const productItem = document.createElement("article");
      productItem.className = "product-item";
      const formattedPrice = `${product.price.toLocaleString("ko-KR")}원`;

      productItem.innerHTML = `
          <a href="./product.html?id=${product.id}">
            <img src="${product.image}" alt="${product.name}" />
            <div class="product-info">
              <h3 class="product-name">${product.name}</h3>
              <p class="product-price">${formattedPrice}</p>
            </div>
          </a>
        `;
      productContainer.appendChild(productItem);
    });
  }

  // 💡 3. JSON 데이터를 가져와서 초기 화면을 설정하고, 네비게이션 이벤트 핸들러 등록
  // $.get() 메서드로 product.json 파일의 데이터를 가져옵니다.
  $.get("./json/product.json", function (products) {
    // 가져온 상품 데이터를 allProducts 변수에 저장
    // $.get()은 JSON을 자동으로 파싱해주므로, response.json() 과정이 필요 없습니다.
    allProducts = products;

    // 초기에는 모든 상품을 화면에 표시
    renderProducts(allProducts);

    // 💡 4. 각 네비게이션 버튼에 클릭 이벤트 추가 (이하 동일)
    // 신상품
    $("#nav-new").click((e) => {
      e.preventDefault();
      const newProducts = allProducts.filter((product) => product.isNew);
      renderProducts(newProducts);
    });

    // 베스트
    $("#nav-best").click((e) => {
      e.preventDefault();
      const bestProducts = allProducts.filter((product) => product.isBest);
      renderProducts(bestProducts);
    });

    // 아우터
    $("#nav-outer").click((e) => {
      e.preventDefault();
      const outerProducts = allProducts.filter(
        (product) => product.category === "아우터"
      );
      renderProducts(outerProducts);
    });

    // 상의
    $("#nav-top").click((e) => {
      e.preventDefault();
      const topProducts = allProducts.filter(
        (product) => product.category === "상의"
      );
      renderProducts(topProducts);
    });

    // 하의
    $("#nav-bottom").click((e) => {
      e.preventDefault();
      const bottomProducts = allProducts.filter(
        (product) => product.category === "하의"
      );
      renderProducts(bottomProducts);
    });

    $("#glass").click((e) => {
      e.preventDefault();
      const searchedProduct = allProducts.filter((product) =>
        product.name.includes($("#search").val().trim())
      );
      renderProducts(searchedProduct);
    });

    $("#search").keyup((e) => {
      e.preventDefault();
      if (e.key === "Enter") {
        const searchedProduct = allProducts.filter((product) =>
          product.name.includes($("#search").val().trim())
        );
        renderProducts(searchedProduct);
      }
    });
  }).fail(function (error) {
    // 에러 처리
    console.error("상품 데이터를 불러오는 중 오류 발생:", error);
  });
});

// login 모듈

$(document).ready(function () {
  // --- 변수 선언 ---
  const $loginModal = $("#loginModal");
  const $loginBtn = $("#login");
  const $closeModalBtn = $("#closeModal");
  const $loginForm = $("#loginForm");
  const $userMenu = $(".user-menu");

  // --- 함수 선언 ---

  /** 로그인 상태에 따라 헤더 메뉴를 업데이트하는 함수 */
  function updateHeaderUI(user) {
    // 로그아웃 상태일 때
    if (!user) {
      const loggedOutMenu = `
        <div class="search-box">
          <input type="text" id="search" placeholder="검색어 입력" />
          <i class="fa-solid fa-magnifying-glass" id="glass"></i>
        </div>
        <a href="./signup.html">회원가입</a>
        <a id="login">로그인</a>
        <a href="/cart">장바구니</a>
      `;
      $userMenu.html(loggedOutMenu);
      // 로그인 버튼에 다시 클릭 이벤트를 연결해야 함
      $("#login").on("click", openLoginModal);
    }
    // 로그인 상태일 때
    else {
      const loggedInMenu = `
        <div class="search-box">
          <input type="text" id="search" placeholder="검색어 입력" />
          <i class="fa-solid fa-magnifying-glass" id="glass"></i>
        </div>
        <span class="welcome-msg">${user.name}님 환영합니다!</span>
        <a id="logout">로그아웃</a>
        <a href="/cart">장바구니</a>
      `;
      $userMenu.html(loggedInMenu);
      // 로그아웃 버튼에 클릭 이벤트 연결
      $("#logout").on("click", handleLogout);
    }
  }

  /** 로그인 모달을 여는 함수 */
  function openLoginModal() {
    $loginModal.css("display", "flex");
  }

  /** 로그인 모달을 닫는 함수 */
  function closeLoginModal() {
    $loginModal.hide();
  }

  /** 로그인 처리를 담당하는 함수 */
  function handleLogin(event) {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const id = $("#login-id").val();
    const pw = $("#login-pw").val();

    if (!id || !pw) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    // localStorage에서 사용자 정보 가져오기
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 입력된 아이디와 비밀번호가 일치하는 사용자 찾기
    const foundUser = users.find((user) => user.id === id && user.pw === pw);

    if (foundUser) {
      // 로그인 성공
      alert(`${foundUser.name}님, 환영합니다!`);
      // 로그인 상태를 세션 스토리지에 저장 (브라우저를 닫으면 사라짐)
      sessionStorage.setItem("currentUser", JSON.stringify(foundUser));
      updateHeaderUI(foundUser); // 헤더 UI 업데이트
      closeLoginModal(); // 모달 닫기
    } else {
      // 로그인 실패
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  }

  /** 로그아웃 처리를 담당하는 함수 */
  function handleLogout() {
    const isLogout = confirm("정말 로그아웃 하시겠습니까?");
    if (isLogout) {
      sessionStorage.removeItem("currentUser"); // 세션 스토리지에서 사용자 정보 삭제
      updateHeaderUI(null); // 헤더 UI를 로그아웃 상태로 변경
      alert("로그아웃 되었습니다.");
    }
  }

  // --- 이벤트 리스너 연결 ---
  $loginBtn.on("click", openLoginModal);
  $closeModalBtn.on("click", closeLoginModal);
  $loginForm.on("submit", handleLogin);

  // 모달 외부(검은 배경) 클릭 시 닫기
  $loginModal.on("click", function (e) {
    if (e.target === this) {
      closeLoginModal();
    }
  });

  // --- 페이지 로드 시 초기 실행 ---
  // 페이지가 로드될 때 세션 스토리지에 로그인 정보가 있는지 확인
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (currentUser) {
    updateHeaderUI(currentUser); // 로그인 정보가 있으면 UI 업데이트
  } else {
    updateHeaderUI(null); // 없으면 로그아웃 상태 UI
  }
});
