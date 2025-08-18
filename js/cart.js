// js/cart.js

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
});

$(document).ready(function () {
  // 1. 로그인 상태 확인 및 UI 업데이트
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  updateHeaderForCart(currentUser);

  if (!currentUser) {
    $("#cart-items-container").html(
      "<p>장바구니를 보려면 로그인이 필요합니다.</p>"
    );
    $(".cart-summary, .cart-actions").hide();
    return;
  }

  // 2. 사용자별 장바구니 데이터 불러오기
  const cartKey = `cart_${currentUser.id}`;
  const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

  const $container = $("#cart-items-container");
  if (cartItems.length === 0) {
    $container.html("<p>장바구니가 비어있습니다.</p>");
    $(".cart-summary, .cart-actions").hide();
    return;
  }

  // 3. 장바구니 아이템들을 화면에 렌더링
  renderCartItems(cartItems);
  calculateTotalPrice(cartItems);
});

function renderCartItems(items) {
  const $container = $("#cart-items-container");
  $container.empty(); // 컨테이너 비우기

  items.forEach((item) => {
    const itemPrice = (item.price * item.quantity).toLocaleString("ko-KR");
    const itemHTML = `
            <div class="cart-item">
                <div class="cart-item-image">
                    <a href="../html/product.html?id=${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                    </a>
                </div>
                <div class="cart-item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-options">색상: ${item.color} / 사이즈: ${item.size}</div>
                </div>
                <div class="item-quantity">${item.quantity}개</div>
                <div class="item-price">${itemPrice}원</div>
                </div>
        `;
    $container.append(itemHTML);
  });
}

function calculateTotalPrice(items) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  $("#cart-total-price").text(`${total.toLocaleString("ko-KR")}원`);
}

// cart.html 전용 헤더 업데이트 함수
function updateHeaderForCart(user) {
  const $userMenu = $(".user-menu");
  if (!user) {
    const loggedOutMenu = `<a href="../html/signup.html">회원가입</a> <a href="../index.html">로그인</a>`;
    $userMenu.html(loggedOutMenu);
  } else {
    const loggedInMenu = `
            <span class="welcome-msg">${user.name}님</span>
            <a id="logout">로그아웃</a>`;
    $userMenu.html(loggedInMenu);
    $("#logout").on("click", () => {
      if (confirm("로그아웃 하시겠습니까?")) {
        sessionStorage.removeItem("currentUser");
        location.reload();
      }
    });
  }
}
