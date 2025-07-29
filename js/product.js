// 가짜 데이터베이스(DB) 역할을 하는 자바스크립트 객체
const productData = {
    '1': {
        name: "[MADE] 쿨링 와이드 밴딩 팬츠",
        price: "29,900원",
        image: "https://image.msscdn.net/thumbnails/images/goods_img/20210428/1924274/1924274_17152551704806_big.jpg?w=1200",
        description: "시원한 소재로 만들어진 와이드 밴딩 팬츠입니다. 착용감이 매우 편안합니다.",
        detail_img: "https://suare.diskn.com/y7RoVShZY3"
    },
    '2': {
        name: "여름 오버핏 반팔 티셔츠",
        price: "18,000원",
        image: "https://image.msscdn.net/thumbnails/images/goods_img/20240326/3993145/3993145_17153177813685_big.jpg?w=1200",
        description: "어떤 코디에도 잘 어울리는 기본 오버핏 반팔 티셔츠입니다.",
        detail_img: "https://alvinclo.speedgabia.com/nmd60/ast4505_4.jpg"
    }
    // 여기에 다른 상품 정보를 계속 추가할 수 있습니다.
};


// 💡 페이지가 로드되면 아래 코드가 실행됩니다.
// 💡 페이지가 로드되면 아래 코드가 실행됩니다.
document.addEventListener('DOMContentLoaded', () => {
    // 1. 현재 페이지의 URL에서 쿼리 스트링(?id=1)을 가져옵니다.
    const queryString = window.location.search;

    // 2. 쿼리 스트링을 쉽게 다룰 수 있는 객체로 만듭니다.
    const urlParams = new URLSearchParams(queryString);

    // 3. 'id'라는 이름의 파라미터 값을 가져옵니다. (결과: '1' 또는 '2')
    const productId = urlParams.get('id');

    // 4. 추출한 ID에 해당하는 상품 정보를 가짜 DB에서 찾습니다.
    const product = productData[productId];

    // 5. 상품 정보가 존재하면, HTML 요소에 내용을 채워 넣습니다.
    if (product) {
        document.querySelector('.product-name').textContent = product.name;
        document.querySelector('.product-price').textContent = product.price;
        document.querySelector('.product-image img').src = product.image;
        document.querySelector('.product-image img').alt = product.name;

        // [수정] 상세 설명과 상세 이미지를 표시합니다.
        document.querySelector('#details p').textContent = product.description;

        // [오타 수정] '.product-detail-ima ge' -> '.product-detail-image'
        document.querySelector('.product-detail-image img').src = product.detail_img;
        document.querySelector('.product-detail-image img').alt = `${product.name} 상세 정보`;

    } else {
        // 만약 해당하는 ID의 상품이 없으면
        document.querySelector('.product-name').textContent = "상품을 찾을 수 없습니다.";
        document.querySelector('.product-purchase-info').innerHTML = ""; // 가격, 옵션 등 숨기기
    }
});