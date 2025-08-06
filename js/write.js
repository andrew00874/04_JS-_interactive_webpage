
$(document).ready(function () {
  // --- 1. Cloudinary 설정 ---
  // 본인의 Cloudinary 대시보드에서 확인한 정보로 반드시 교체해주세요.
  const CLOUD_NAME = "dqhux9ivw"; // 👈 본인의 Cloud Name으로 변경
  const UPLOAD_PRESET = "web_upload"; // 👈 본인의 Unsigned Preset 이름으로 변경
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  // --- 2. 로그인 상태 확인 ---
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("글쓰기는 로그인 후 이용 가능합니다.");
    location.href = "index.html";
    return;
  }

  // --- 3. 이미지 선택 시 미리보기 기능 ---
  $("#postImage").on("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // FileReader API로 이미지 미리보기 생성
        $("#imagePreview").html(`<img src="${e.target.result}" style="max-width: 200px; border-radius: 8px;">`);
      };
      reader.readAsDataURL(file); // 파일을 Base64 데이터 URL로 읽기
    }
  });


  // --- 4. 폼 제출 이벤트 (핵심 로직) ---
  $("#writeForm").on("submit", async function (e) {
    e.preventDefault();
    $("#submitBtn").text("등록 중...").prop("disabled", true); // 버튼 비활성화

    const title = $("#postTitle").val();
    const content = $("#postContent").val();
    const imageFile = $("#postImage")[0].files[0];
    let imageUrl = ""; // Cloudinary 이미지 URL을 저장할 변수

    // A. 이미지가 첨부된 경우, Cloudinary에 업로드
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
        const response = await fetch(UPLOAD_URL, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.secure_url) {
          imageUrl = data.secure_url; // 업로드 성공 시 보안 URL 저장
        } else {
          throw new Error('Cloudinary upload failed.');
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드 중 오류가 발생했습니다.');
        $("#submitBtn").text("등록하기").prop("disabled", false); // 버튼 다시 활성화
        return; // 등록 절차 중단
      }
    }

    // B. 기존 게시글 데이터를 localStorage에서 가져오기
    let posts = JSON.parse(localStorage.getItem('boardPosts')) || [];

    // C. 새 게시글 객체 만들기 (이미지 URL 포함)
    const newPost = {
      id: Date.now(),
      title: title,
      content: content,
      author: currentUser.name,
      createdAt: new Date().toISOString(),
      imageUrl: imageUrl // 이미지가 없으면 빈 문자열("") 저장
    };

    // D. 새 게시글을 배열에 추가하고 localStorage에 저장
    posts.push(newPost);
    localStorage.setItem('boardPosts', JSON.stringify(posts));

    alert("게시글이 성공적으로 등록되었습니다.");
    location.href = 'board.html';
  });
});