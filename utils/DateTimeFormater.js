export function formatDate(dateNumber) {
  let dateString = dateNumber.toString();

  // (text 길이 8이상일시 통과)
  if (dateString.length !== 8) {
    return "유효하지 않은 날짜 형식입니다.";
  }

  let year = dateString.substring(0, 4);
  let month = dateString.substring(4, 6);
  let day = dateString.substring(6, 8);

  return `${year}-${month}-${day}`;
}
