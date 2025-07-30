$(function () {
  $("#darkmode").click(() => {
    $("body").toggleClass("dark-mode");
  });
});
// 💡 페이지가 로드되면 상품 데이터를 가져와서 화면에 표시합니다.
document.addEventListener("DOMContentLoaded", () => {
  // data 폴더에 있는 products.json 파일을 가져옵니다.
  // fetch의 경로 '../data/products.json'는 html 파일 위치를 기준으로 합니다.
  // 만약 home.html이 루트 폴더에 있다면 '/data/products.json' 또는 'data/products.json'으로 변경해야 합니다.
  fetch("../json/product.json")
    .then((response) => response.json()) // 응답을 JSON 형태로 파싱합니다.
    .then((products) => {
      // JSON 데이터가 성공적으로 로드되면, 상품 목록을 화면에 렌더링합니다.
      const productContainer = document.querySelector(".products");

      // 기존 상품 목록을 비웁니다.
      productContainer.innerHTML = "";

      // 모든 상품에 대해 HTML 요소를 생성합니다.
      products.forEach((product) => {
        const productItem = document.createElement("article");
        productItem.className = "product-item";

        // toLocaleString('ko-KR')을 사용해 숫자를 1,000 단위 콤마가 있는 통화 형식으로 변환합니다.
        const formattedPrice = `${product.price.toLocaleString("ko-KR")}원`;

        productItem.innerHTML = `
          <a href="./product.html?id=${product.id}">
            <img
              src="${product.image}"
              alt="${product.name}"
            />
            <div class="product-info">
              <h3 class="product-name">${product.name}</h3>
              <p class="product-price">${formattedPrice}</p>
            </div>
          </a>
        `;
        productContainer.appendChild(productItem);
      });
    })
    .catch((error) => console.error("상품 데이터를 불러오는 중 오류 발생:", error));
});