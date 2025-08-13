$(function () {
  // --- 공통 기능 및 변수 선언 ---
  const $userMenu = $(".user-menu");
  const $loginModal = $("#loginModal");
  let allProducts = [];
  const productContainer = $(".products");
  const suggestionsContainer = $("#suggestions-container");

  // --- 함수 정의 ---

  /** 테마 적용 함수 (다크모드) */
  function applyTheme() {
    if (localStorage.getItem("darkMode") === "enabled") {
      $("body").addClass("dark-mode");
    } else {
      $("body").removeClass("dark-mode");
    }
  }

  /** 상품 목록 렌더링 함수 */
  function renderProducts(products) {
    productContainer.empty();
    if (products.length === 0) {
      productContainer.html("<p>일치하는 상품이 없습니다.</p>");
      return;
    }
    products.forEach((product) => {
      const formattedPrice = `${product.price.toLocaleString("ko-KR")}원`;
      const productItem = `
        <article class="product-item">
          <a href="./product.html?id=${product.id}">
            <img src="${product.image}" alt="${product.name}" />
            <div class="product-info">
              <h3 class="product-name">${product.name}</h3>
              <p class="product-price">${formattedPrice}</p>
            </div>
          </a>
        </article>`;
      productContainer.append(productItem);
    });
  }

  /** 검색 실행 함수 */
  function performSearch() {
    const searchTerm = $("#search").val().trim().toLowerCase();
    if (searchTerm) {
      const searchedProduct = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
      renderProducts(searchedProduct);
    } else {
      renderProducts(allProducts);
    }
    $("#suggestions-container").slideUp(); // ID를 직접 사용해 숨김
  }

  /** 로그인 상태에 따른 헤더 UI 업데이트 */
  function updateHeaderUI(user) {
    $userMenu.empty();
    let menuHtml;
    if (!user) {
      // 로그아웃 상태 메뉴
      menuHtml = `
        <div class="search-container">
          <div class="search-box">
            <input type="text" id="search" placeholder="검색어 입력" />
            <i class="fa-solid fa-magnifying-glass" id="glass"></i>
          </div>
          <div id="suggestions-container"></div>
        </div>
        <a href="./signup.html">회원가입</a>
        <a id="login">로그인</a>
        <a href="./cart.html">장바구니</a>
      `;
    } else {
      // 로그인 상태 메뉴
      menuHtml = `
        <div class="search-container">
          <div class="search-box">
            <input type="text" id="search" placeholder="검색어 입력" />
            <i class="fa-solid fa-magnifying-glass" id="glass"></i>
          </div>
          <div id="suggestions-container"></div>
        </div>
        <span class="welcome-msg">${user.name}님</span>
        <a id="logout">로그아웃</a>
        <a href="./cart.html">장바구니</a>
      `;
    }
    $userMenu.html(menuHtml);
    attachCommonEventListeners();
  }
  
  /** 로그아웃 처리 함수 */
  function handleLogout() {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      sessionStorage.removeItem("currentUser");
      updateHeaderUI(null);
      alert("로그아웃 되었습니다.");
    }
  }
  
  /** 로그인 처리 함수 */
  function handleLogin(event) {
      event.preventDefault();
      const id = $("#login-id").val();
      const pw = $("#login-pw").val();
      if (!id || !pw) {
        alert("아이디와 비밀번호를 모두 입력해주세요.");
        return;
      }
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const foundUser = users.find(user => user.id === id && user.pw === pw);
      if (foundUser) {
        alert(`${foundUser.name}님, 환영합니다!`);
        sessionStorage.setItem("currentUser", JSON.stringify(foundUser));
        updateHeaderUI(foundUser);
        $loginModal.fadeOut(300);
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
  }

  /** 공통 이벤트 리스너 부착 함수 */
  function attachCommonEventListeners() {
      $("#login").on("click", () => $loginModal.css("display", "flex").fadeIn(300));
      $("#logout").on("click", handleLogout);
      
      $("#search").on("input", function () {
        const searchTerm = $(this).val().trim();
        const suggestionsContainer = $("#suggestions-container");
        suggestionsContainer.empty();

        if (searchTerm.length === 0) {
            suggestionsContainer.slideUp();
            return;
        }

        const matchedProducts = allProducts.filter(p => p.name.includes(searchTerm));

        if (matchedProducts.length > 0) {
            const list = $("<ul></ul>");
            const regex = new RegExp(`(${searchTerm})`, 'gi'); // 'gi'는 전체에서, 대소문자 구분 없이 찾으라는 의미입니다.

            matchedProducts.forEach(product => {
                // ⭐ 검색어를 <strong> 태그로 감싸서 볼드 처리
                const highlightedName = product.name.replace(regex, '<strong>$1</strong>');
                const listItem = $("<li></li>").html(highlightedName); // .text() 대신 .html() 사용
                
                listItem.on("click", function () {
                    $("#search").val(product.name);
                    suggestionsContainer.slideUp();
                    performSearch();
                });
                list.append(listItem);
            });
            suggestionsContainer.html(list).slideDown();
        } else {
            suggestionsContainer.slideUp();
        }
      });
      
      $("#search").on("blur", () => setTimeout(() => $("#suggestions-container").slideUp(), 150));
      $("#glass").on("click", performSearch);
      $("#search").on("keypress", e => {
        if (e.which === 13) performSearch();
      });
  }

  // --- 초기 실행 코드 ---
  applyTheme();

  $.get("./json/product.json", function (products) {
    allProducts = products;
    renderProducts(allProducts);
    $("#nav-new").click(e => { e.preventDefault(); renderProducts(allProducts.filter(p => p.isNew)); });
    $("#nav-best").click(e => { e.preventDefault(); renderProducts(allProducts.filter(p => p.isBest)); });
    $("#nav-outer").click(e => { e.preventDefault(); renderProducts(allProducts.filter(p => p.category === "아우터")); });
    $("#nav-top").click(e => { e.preventDefault(); renderProducts(allProducts.filter(p => p.category === "상의")); });
    $("#nav-bottom").click(e => { e.preventDefault(); renderProducts(allProducts.filter(p => p.category === "하의")); });
  }).fail(error => console.error("상품 데이터 로딩 오류:", error));

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  updateHeaderUI(currentUser);

  $("#darkmode").click(() => {
    $("body").toggleClass("dark-mode");
    localStorage.setItem("darkMode", $("body").hasClass("dark-mode") ? "enabled" : "");
  });
  $(".nav-toggle").click(() => $(".header-right-group").toggleClass("is-active"));
  $("#closeModal, #loginModal").on("click", function(e) { if(this === e.target) { $loginModal.fadeOut(300); } });
  $("#loginForm").on("submit", handleLogin);
});