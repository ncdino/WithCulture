// 만원의 행복을 위한 가격 변환 함수

export const convertTicketPrice = (priceArray, isLow = false) => {
  // 입력 유효성 검사
  if (
    !Array.isArray(priceArray) ||
    priceArray.length === 0 ||
    typeof priceArray[0] !== "string"
  ) {
    console.error(
      "convertTicketPrice: 유효하지 않은 입력 - 예상된 배열 형식이 아닙니다.",
      priceArray
    );
    if (isLow) return 0;
    return [];
  }

  const priceString = priceArray[0];

  // 가격 문자열 분리
  // ", " 로 분리하거나, ", "가 없으면 전체 문자열을 요소로 갖는 배열로 만듦.
  const individualPriceStrings = priceString.includes(", ")
    ? priceString.split(", ")
    : [priceString];

  const numericPrices = individualPriceStrings.map((str) => {
    const match = str.match(/\d+/g);

    // 숫자 없는 문자열 처리
    if (!match) {
      console.warn(
        `convertTicketPrice: 가격 문자열 부분에서 숫자를 찾을 수 없습니다: "${str}"`
      );
      return 0;
    }

    const numStr = match.join("");
    const num = parseInt(numStr, 10);

    // parseInt 타입 유효성 검사
    if (isNaN(num)) {
      console.warn(
        `convertTicketPrice: 숫자로 변환 실패: "${str}" -> "${numStr}"`
      );
      return 0;
    }

    return num;
  });

  // result price 반환
  if (isLow) {
    if (numericPrices.length === 0) {
      return 0;
    }
    return Math.min(...numericPrices);
  } else {
    return numericPrices;
  }
};
