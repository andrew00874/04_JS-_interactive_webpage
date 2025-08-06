// js/board.js
$(function () {
  // 햄버거 메뉴 토글 기능
  $(".nav-toggle").click(function () {
    $(".header-right-group").toggleClass("is-active");
  });
});

$(document).ready(function () {
  // --- 페이지네이션 변수 ---
  let currentPage = 1; // 현재 페이지
  const postsPerPage = 10; // 페이지 당 게시글 수

  // --- 페이지 초기화 ---
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  updateHeaderUI(currentUser);
  applyTheme();
  displayPosts(); // 페이지네이션을 포함한 함수로 변경

  // --- 이벤트 리스너 ---

  // (다크모드, 글쓰기 버튼 이벤트 리스너는 기존과 동일)
  $(document).on("click", "#darkmode", function () {
    /* ... */
  });
  $(".write-btn").on("click", function (e) {
    /* ... */
  });
  $("#posts-list").on("click", ".post-title-link", function (e) {
    /* ... */
  });

  // ★★★ 페이지 번호 버튼 클릭 이벤트 (이벤트 위임) ★★★
  $(".pagination").on("click", ".page-btn", function () {
    // 이미 활성화된 버튼을 클릭하면 아무것도 하지 않음
    if ($(this).hasClass("active")) return;

    // data-page 속성에서 페이지 번호를 가져와 숫자로 변환
    const page = parseInt($(this).data("page"));
    currentPage = page; // 현재 페이지 업데이트
    displayPosts(); // 해당 페이지의 게시글 다시 표시
  });

  // --- 함수 선언 ---

  /** 게시글 데이터를 가져와 현재 페이지에 맞게 표시하고 페이지네이션을 렌더링하는 메인 함수 */
  function displayPosts() {
    const allPosts = JSON.parse(localStorage.getItem("boardPosts")) || [];
    const reversedPosts = allPosts.slice().reverse(); // 최신글이 위로 오도록

    // 1. 현재 페이지에 표시할 게시글 계산
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = reversedPosts.slice(startIndex, endIndex);

    // 2. 게시글 렌더링
    renderPosts(postsToShow, allPosts.length);

    // 3. 페이지네이션 렌더링
    renderPagination(allPosts.length);
  }

  /** 계산된 게시글 목록을 화면에 렌더링하는 함수 */
  function renderPosts(posts, totalPostCount) {
    const $postsListContainer = $("#posts-list");
    $postsListContainer.empty();

    if (posts.length === 0) {
      $postsListContainer.html(
        '<tr><td colspan="4">작성된 게시글이 없습니다.</td></tr>'
      );
      return;
    }

    posts.forEach((post, index) => {
      const postNumber =
        totalPostCount - (currentPage - 1) * postsPerPage - index;
      const postDate = new Date(post.createdAt).toLocaleDateString("ko-KR");

      const titleRowHTML = `
        <tr class="post-title-row">
          <td>${postNumber}</td>
          <td class="col-title"><a href="#" class="post-title-link">${post.title}</a></td>
          <td>${post.author}</td>
          <td>${postDate}</td>
        </tr>`;

      const contentRowHTML = `
        <tr class="post-content-row" style="display: none;">
          <td colspan="4">
            <div class="post-detail-content">
              ${
                post.imageUrl
                  ? `<div class="post-image-wrapper"><img src="${post.imageUrl}" alt="첨부 이미지"></div>`
                  : ""
              }
              <p>${post.content}</p>
            </div>
          </td>
        </tr>`;

      $postsListContainer.append(titleRowHTML + contentRowHTML);
    });
  }

  /** 페이지네이션 버튼을 생성하고 렌더링하는 함수 */
  function renderPagination(totalPostCount) {
    const $paginationContainer = $(".pagination");
    $paginationContainer.empty();

    const totalPages = Math.ceil(totalPostCount / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const buttonHTML = `
        <button class="page-btn ${
          i === currentPage ? "active" : ""
        }" data-page="${i}">
          ${i}
        </button>`;
      $paginationContainer.append(buttonHTML);
    }
  }

  // ... (updateHeaderUI, handleLogout, applyTheme 등 나머지 함수는 기존과 동일하게 유지) ...
  function updateHeaderUI(user) {
    const $userMenu = $(".user-menu");
    if (!user) {
      const loggedOutMenu = `
        <a href="./signup.html">회원가입</a>
        <a id="login">로그인</a>
        <a href="./cart.html">장바구니</a>
      `;
      $userMenu.html(loggedOutMenu);
      $("#login").on("click", () => {
        alert("로그인은 메인 페이지에서 가능합니다.");
        location.href = "index.html";
      });
    } else {
      const loggedInMenu = `
        <span class="welcome-msg" style="font-weight:bold;">${user.name}님</span>
        <a id="logout">로그아웃</a>
        <a href="./cart.html">장바구니</a>
      `;
      $userMenu.html(loggedInMenu);
      $("#logout").on("click", handleLogout);
    }
  }

  function handleLogout() {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      sessionStorage.removeItem("currentUser");
      updateHeaderUI(null);
      alert("로그아웃 되었습니다.");
    }
  }

  function applyTheme() {
    if (localStorage.getItem("darkMode") === "enabled") {
      $("body").addClass("dark-mode");
    } else {
      $("body").removeClass("dark-mode");
    }
  }

  $("#posts-list").on("click", ".post-title-link", function (e) {
    e.preventDefault();
    const $contentRow = $(this).closest("tr").next(".post-content-row");
    $(".post-content-row").not($contentRow).slideUp();
    $contentRow.slideToggle();
  });
});
