$(function () {
  // Function to apply the theme based on the value in localStorage
  function applyTheme() {
    if (localStorage.getItem("darkMode") === "enabled") {
      $("body").addClass("dark-mode");
    } else {
      $("body").removeClass("dark-mode");
    }
  }

  // Apply the theme as soon as the page loads
  applyTheme();

  // Event handler for the dark mode button
  $("#darkmode").click(() => {
    // Toggle the .dark-mode class on the body
    $("body").toggleClass("dark-mode");

    // Check if dark mode is now enabled or disabled and save it to localStorage
    if ($("body").hasClass("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.removeItem("darkMode");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const productId = urlParams.get("id");

  if (!productId) {
    displayError("상품 ID가 유효하지 않습니다.");
    return;
  }

  fetch("./json/product.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`데이터 파일을 찾을 수 없습니다. (HTTP ${res.status})`);
      }
      return res.json();
    })
    .then((products) => {
      const product = products.find((p) => p.id == productId);

      if (product) {
        // 기본 상품 정보 표시
        document.title = `${product.name} - 무진장 쇼핑몰`;
        document.querySelector(".product-name").textContent = product.name;
        document.querySelector(
          ".product-price"
        ).textContent = `${product.price.toLocaleString("ko-KR")}원`;
        document.querySelector(".product-image img").src = product.image;
        document.querySelector(".product-image img").alt = product.name;

        // 상세 정보 표시
        const detailsContent = document.querySelector("#details");
        detailsContent.querySelector("p").textContent = product.description;
        detailsContent.querySelector(".product-detail-image img").src =
          product.detail_img;
        detailsContent.querySelector(
          ".product-detail-image img"
        ).alt = `${product.name} 상세 정보`;

        // ⭐️ 1. 총가격을 업데이트하는 함수 정의
        // product.price를 사용해야 하므로 이 위치에 함수를 만듭니다.
        const updateTotalPrice = () => {
          const quantity = parseInt($("#quantity").val());
          const totalPrice = product.price * quantity;
          const formattedTotalPrice = `${totalPrice.toLocaleString("ko-KR")}원`;
          $(".total-price").text(formattedTotalPrice); // .html() 대신 .text() 사용 권장
        };

        // ⭐️ 2. 수량 변경 이벤트 핸들러 등록
        // '+' 버튼 클릭 시
        $(".plus").click(function () {
          var $input = $(this).siblings("input#quantity");
          var currentVal = parseInt($input.val());
          $input.val(currentVal + 1);
          updateTotalPrice(); // 수량 변경 후 총가격 업데이트
        });

        // '-' 버튼 클릭 시
        $(".minus").click(function () {
          var $input = $(this).siblings("input#quantity");
          var currentVal = parseInt($input.val());
          if (currentVal > 1) {
            $input.val(currentVal - 1);
            updateTotalPrice(); // 수량 변경 후 총가격 업데이트
          }
        });

        // 사용자가 직접 수량을 입력하거나 수정할 때를 위한 이벤트 핸들러
        $("#quantity").on("input", function () {
          // 1. $(this)를 사용해 현재 요소의 값을 가져옵니다.
          let currentVal = parseInt($(this).val());

          // 2. 입력값이 숫자가 아니거나 1보다 작으면, updateTotalPrice가 NaN을 계산하지 않도록 방지
          //    (아래 updateTotalPrice 함수가 알아서 처리한다면 이 부분은 생략 가능)
          if (isNaN(currentVal) || currentVal < 0) {
            // 값이 유효하지 않을 때는 총가격을 0 또는 기본값으로 표시하거나,
            // 아무 동작도 하지 않을 수 있습니다. 여기서는 일단 넘어갑니다.
            // 사용자가 '0'을 입력하는 과정일 수 있으므로 강제로 바꾸지 않는 것이 좋습니다.
            return;
          }

          // 3. 현재 입력된 유효한 수량을 기준으로 총가격을 업데이트합니다.
          updateTotalPrice();
        });
        // ⭐️ 3. 페이지 로드 시 초기 총가격을 계산하여 표시
        updateTotalPrice();

        $(".btn-cart").on("click", function () {
          // 1. 로그인 상태 확인
          const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
          if (!currentUser) {
            alert("장바구니 기능은 로그인 후 이용 가능합니다.");
            // 선택: 로그인 페이지로 보내거나, 메인 페이지의 로그인 모달을 열도록 유도
            location.href = "index.html";
            return;
          }

          // 2. 옵션 선택 확인
          const selectedColor = $("#color-select").val();
          const selectedSize = $("#size-select").val();

          if (!selectedColor || !selectedSize) {
            alert("색상과 사이즈를 모두 선택해주세요.");
            return;
          }

          const selectedQuantity = parseInt($("#quantity").val());
          const cartKey = `cart_${currentUser.id}`; // 사용자별 고유 장바구니 키

          // 3. localStorage에서 현재 사용자의 장바구니 정보 가져오기
          let userCart = JSON.parse(localStorage.getItem(cartKey)) || [];

          // 4. 동일한 상품, 동일한 옵션이 이미 장바구니에 있는지 확인
          const existingItemIndex = userCart.findIndex(
            (item) =>
              item.id === product.id &&
              item.color === selectedColor &&
              item.size === selectedSize
          );

          if (existingItemIndex > -1) {
            // 이미 있다면: 수량만 추가
            userCart[existingItemIndex].quantity += selectedQuantity;
          } else {
            // 없다면: 새로운 상품으로 추가
            const cartItem = {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              color: selectedColor,
              size: selectedSize,
              quantity: selectedQuantity,
            };
            userCart.push(cartItem);
          }

          // 5. 업데이트된 장바구니 정보를 localStorage에 다시 저장
          localStorage.setItem(cartKey, JSON.stringify(userCart));

          // 6. 확인 창 띄우기
          const userChoice = confirm(
            "상품이 장바구니에 담겼습니다.\n장바구니로 이동하시겠습니까?"
          );
          if (userChoice) {
            location.href = "cart.html";
          }
        });
      } else {
        displayError("상품을 찾을 수 없습니다.");
      }
    })
    .catch((error) => {
      console.error("데이터 로딩 중 오류 발생:", error);
      displayError("데이터를 불러오는 데 실패했습니다.");
    });
});

/**
 * 에러 메시지를 화면에 표시하는 함수
 * @param {string} message - 표시할 에러 메시지
 */
function displayError(message) {
  // ⭐️ 수정된 부분: 실제 HTML에 있는 클래스 이름으로 변경
  const purchaseInfoDiv = document.querySelector(".product-purchase-info");
  if (purchaseInfoDiv) {
    // 상품 구매 관련 정보를 모두 지우고 에러 메시지를 표시
    purchaseInfoDiv.innerHTML = `<p class="error-message" style="color: red; font-size: 1.2em;">${message}</p>`;
  }

  // 상세 정보 탭 영역도 숨깁니다.
  const extraInfoDiv = document.querySelector(".product-extra-info");
  if (extraInfoDiv) {
    extraInfoDiv.style.display = "none";
  }
}

// 모든 탭 링크와 탭 콘텐츠를 가져옵니다.
const tabLinks = document.querySelectorAll(".tab-link");
const tabContents = document.querySelectorAll(".tab-content");

// 각 탭 링크에 클릭 이벤트를 추가합니다.
tabLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // 클릭된 탭의 data-tab 속성 값을 가져옵니다 (예: "details").
    const tabId = link.getAttribute("data-tab");

    // 1. 모든 탭 링크와 콘텐츠에서 'active' 클래스를 제거합니다.
    tabLinks.forEach((item) => item.classList.remove("active"));
    tabContents.forEach((item) => item.classList.remove("active"));

    // 2. 클릭된 탭 링크와 해당하는 콘텐츠에만 'active' 클래스를 추가합니다.
    link.classList.add("active");
    document.getElementById(tabId).classList.add("active");
  });
});
// ========================================================
$(document).ready(function () {
  // --- 변수 선언 (product.html에 맞게 일부만 사용) ---
  const $userMenu = $("header div").last(); // product.html의 헤더 구조에 맞게 선택

  // --- 함수 선언 ---

  /** 로그인 상태에 따라 헤더 메뉴를 업데이트하는 함수 */
  function updateHeaderUI(user) {
    // 로그아웃 상태일 때
    if (!user) {
      const loggedOutMenu = `
        <a href="./signup.html">회원가입</a>
        <a id="login">로그인</a>
        <a href="./cart.html">장바구니</a>
      `;
      $userMenu.html(loggedOutMenu);
      // product.html에는 로그인 모달이 없으므로, 로그인 클릭 시 메인으로 보내는 것을 고려해볼 수 있습니다.
      $("#login").on("click", () => {
        alert("로그인은 메인 페이지에서 가능합니다.");
        location.href = "index.html";
      });
    }
    // 로그인 상태일 때
    else {
      const loggedInMenu = `
        <span class="welcome-msg" style="font-weight:bold;">${user.name}님 환영합니다!</span>
        <a id="logout">로그아웃</a>
        <a href="./cart.html">장바구니</a>
      `;
      $userMenu.html(loggedInMenu);
      // 로그아웃 버튼에 클릭 이벤트 연결
      $("#logout").on("click", handleLogout);
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

  // --- 페이지 로드 시 초기 실행 ---
  // 페이지가 로드될 때 세션 스토리지에 로그인 정보가 있는지 확인
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  updateHeaderUI(currentUser); // 세션 정보에 따라 UI 업데이트
});
