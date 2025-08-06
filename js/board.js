$(document).ready(function () {
  // --- 페이지 초기화 ---
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  loadAndRenderPosts(); // 게시글 목록 불러오기 및 표시

  // 글쓰기 버튼 클릭 시 로그인 상태 확인
  $(".write-btn").on("click", function (e) {
    if (!currentUser) {
      e.preventDefault(); // a 태그의 기본 동작(페이지 이동)을 막음
      alert("글쓰기는 로그인 후 이용 가능합니다.");
      location.href = "index.html"; // 로그인할 수 있도록 메인 페이지로 이동
    }
  });

  $("#posts-list").on("click", ".post-title-link", function (e) {
    e.preventDefault(); // 링크의 기본 이동 기능 막기

    const $contentRow = $(this).closest("tr").next(".post-content-row");

    // 다른 열려있는 내용은 닫기
    $(".post-content-row").not($contentRow).slideUp();

    // 클릭한 게시글의 내용만 열고 닫기 (토글)
    $contentRow.slideToggle();
  });

  // --- 함수 선언 ---

  /**
   * localStorage에서 'boardPosts' 키로 저장된 게시글 데이터를 가져와
   * board.html의 테이블(tbody#posts-list)에 동적으로 렌더링하는 함수
   */
  /** localStorage에서 게시글을 가져와 슬라이드 다운 형식으로 렌더링하는 함수 */
  function loadAndRenderPosts() {
    const $postsListContainer = $("#posts-list");
    const posts = JSON.parse(localStorage.getItem("boardPosts")) || [];

    if (posts.length === 0) {
      $postsListContainer.html(
        '<tr><td colspan="4">작성된 게시글이 없습니다.</td></tr>'
      );
      return;
    }

    $postsListContainer.empty();

    posts
      .slice()
      .reverse()
      .forEach((post, index) => {
        const postDate = new Date(post.createdAt).toLocaleDateString("ko-KR");

        // 1. 제목 줄 HTML
        const titleRowHTML = `
        <tr class="post-title-row">
          <td>${posts.length - index}</td>
          <td class="col-title">
            <a href="#" class="post-title-link">${post.title}</a>
          </td>
          <td>${post.author}</td>
          <td>${postDate}</td>
        </tr>
      `;

        // 2. 내용 줄 HTML (처음에는 숨겨져 있음)
        const contentRowHTML = `
        <tr class="post-content-row" style="display: none;">
          <td colspan="4">
            <div class="post-detail-content">
            ${
              post.imageUrl
                ? `<img src="${post.imageUrl}" alt="첨부 이미지">`
                : ""
            }
                <p>${post.content}</p>
            </div>
          </td>
        </tr>
      `;

        $postsListContainer.append(titleRowHTML + contentRowHTML);
      });
  }

  // ... (updateHeaderUI, handleLogout, applyTheme 함수는 이전과 동일하게 유지) ...
  /** 로그인 상태에 따라 헤더 메뉴를 업데이트하는 함수 */
  function updateHeaderUI(user) {
    const $userMenu = $(".user--menu");
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

  /** 로그아웃 처리를 담당하는 함수 */
  function handleLogout() {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      sessionStorage.removeItem("currentUser");
      updateHeaderUI(null);
      alert("로그아웃 되었습니다.");
    }
  }

  /** 다크모드 테마를 적용하는 함수 */
  function applyTheme() {
    if (localStorage.getItem("darkMode") === "enabled") {
      $("body").addClass("dark-mode");
    } else {
      $("body").removeClass("dark-mode");
    }
  }
});
