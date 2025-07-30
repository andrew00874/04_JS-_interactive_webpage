document.addEventListener("DOMContentLoaded", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const productId = urlParams.get("id");

  if (!productId) {
    displayError("상품 ID가 유효하지 않습니다.");
    return;
  }

  fetch("../json/product.json")
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
        document.querySelector(".product-price").textContent = `${product.price.toLocaleString("ko-KR")}원`;
        document.querySelector(".product-image img").src = product.image;
        document.querySelector(".product-image img").alt = product.name;

        // 상세 정보 표시
        const detailsContent = document.querySelector("#details");
        detailsContent.querySelector("p").textContent = product.description;
        detailsContent.querySelector(".product-detail-image img").src = product.detail_img;
        detailsContent.querySelector(".product-detail-image img").alt = `${product.name} 상세 정보`;

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
    extraInfoDiv.style.display = 'none';
  }
}