import { XMLParser } from "fast-xml-parser";

const replaceHttpWithHttps = (obj) => {
  {
    if (!obj || typeof obj !== "object") {
      return;
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (typeof value === "string" && value.startsWith("http://")) {
          obj[key] = value.replace("http://", "https://");
        } else if (typeof value === "object") {
          replaceHttpWithHttps(value);
        }
      }
    }
  }
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  isArray: (name, jpath, isLeafNode, isAttribute) => {
    if (name === "item" || name === "db" || name === "boxof") return true;
    return false;
  },
});

export const EntityEncoding = (text) => {
  if (typeof text !== "string") {
    return text;
  }

  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
};

const EXHIBITION_API_KEY = process.env.EXPO_PUBLIC_EXHIBITION_API_KEY;
const EXHIBITION_BASE_URI =
  "https://apis.data.go.kr/B553457/nopenapi/rest/publicperformancedisplays";

export const fetchExhibition = async ({ queryKey, pageParam = 1 }) => {
  const [_key, { endpoint, params }] = queryKey;

  const query = new URLSearchParams({
    serviceKey: EXHIBITION_API_KEY,
    type: "xml",
    PageNo: pageParam,
    numOfrows: 10,
    ...params,
  }).toString();

  const url = `${EXHIBITION_BASE_URI}/${endpoint}?${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
    }

    const textData = await response.text();

    // XML -> JSON 변환
    const jsonData = parser.parse(textData);

    console.log(
      `exhibition 데이터 확인 (jsonData.response.body.items.item) : ${JSON.stringify(
        jsonData.response.body.items.item
      )}`
    );

    // 공연 데이터 추출
    let items = jsonData.response.body.items.item || [];
    const totalCount = parseInt(jsonData.response.body.totalCount, 10);

    // API 응답에서의 numOfRows 값 확인
    const apiNumOfRows = parseInt(jsonData.response.body.numOfRows, 10) || 10;

    if (items.length > 0 && items[0].title) {
      items = items.map((item) => {
        if (item.title && typeof item.title === "string") {
          item.title = EntityEncoding(item.title);
        }
        return item;
      });
    }

    // 현재까지 가져온 아이템 수 계산
    const fetchedItems = pageParam * apiNumOfRows;
    // 다음 페이지 존재 여부 확인
    const hasMorePages = fetchedItems < totalCount;

    const nextPage = hasMorePages ? pageParam + 1 : undefined;

    return {
      items: items,
      nextPage,
    };
  } catch (error) {
    console.error("exhibition 데이터 가져오기 실패:", error);
    return { items: [], nextPage: undefined };
  }
};

const performance_key = process.env.EXPO_PUBLIC_PERFORMANCE_API_KEY;
const PERFORMANCE_BASE_URI = "https://kopis.or.kr/openApi/restful";

export const fetchPerformances = async ({ queryKey }) => {
  const [_key, { item_id, endpoint, params, urlStructure, hallId }] = queryKey;

  // console.log("🟢 fetchPerformances - 받은 파라미터:", {
  //   item_id,
  //   endpoint,
  //   params,
  //   urlStructure,
  //   hallId,
  // });

  const query = new URLSearchParams({
    service: performance_key,
    ...params,
  }).toString();

  const formattedItemId = Array.isArray(item_id) ? item_id[0] : item_id;

  let url = "";

  if (urlStructure === "기본") {
    url = `${PERFORMANCE_BASE_URI}/${endpoint}?${query}`;
  } else if (urlStructure === "상세") {
    url = `${PERFORMANCE_BASE_URI}/${endpoint}/${formattedItemId}?${query}`;
  } else if (urlStructure === "concerthall") {
    url = `${PERFORMANCE_BASE_URI}/${endpoint}/${hallId}?${query}`;
  } else {
    url = `${PERFORMANCE_BASE_URI}/${endpoint}?${query}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`공연 HTTP 오류! 상태 코드: ${response.status}`);
    }

    const textData = await response.text();

    // XML -> JSON 변환 using fast-xml-parser
    const jsonData = parser.parse(textData);

    // console.log("jsonData : ", jsonData);

    // 공연 데이터 추출
    let items = jsonData.dbs.db || [];

    if (!Array.isArray(items)) {
      items = [items];
    }

    // console.log(`fetched items (Stringify): ${JSON.stringify(items)}`);

    items.forEach((item) => replaceHttpWithHttps(item));

    return {
      items: items,
    };
  } catch (error) {
    console.error("performance 데이터 가져오기 실패: ", error);
    return { items: [] };
  }
};

export const boxOfficeRequest = async ({ queryKey }) => {
  // console.log("queryKey 값 확인:", queryKey);

  const [_key, { endpoint, params }] = queryKey;

  const query = new URLSearchParams({
    service: performance_key,
    ...params,
  }).toString();

  // console.log("Box office 쿼리 확인: ", query);

  let url;
  url = `${PERFORMANCE_BASE_URI}/${endpoint}?${query}`;

  // console.log(
  //   `비교 예시) request URL : https://kopis.or.kr/openApi/restful/boxoffice?service={서비스키}&ststype=day&date=20171218&catecode=AAAA&area=11&srchseatscale=100`
  // );
  // console.log("현재 Box office url 확인 : ", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`공연 HTTP 오류! 상태 코드: ${response.status}`);
    }

    const textData = await response.text();

    // XML -> JSON 변환
    const jsonData = parser.parse(textData);

    // console.log(jsonData);
    // console.log(
    //   `jsonData.boxofs.boxof 데이터 확인 : ${JSON.stringify(
    //     jsonData.boxofs.boxof
    //   )}`
    // );

    // 공연 데이터 추출
    let basedate = jsonData.boxofs.basedate || [];
    let items = jsonData.boxofs.boxof || [];

    if (!Array.isArray(items)) {
      items = [items];
    }

    items.forEach((item) => replaceHttpWithHttps(item));

    // console.log(
    //   `box office items: ${JSON.stringify(
    //     items
    //   )}, 기준일(basedate) : ${basedate}`
    // );

    return {
      items: items,
      basedate: basedate,
    };
  } catch (error) {
    console.error("box office 데이터 가져오기 실패:", error);
    return { items: [], basedate: [] };
  }
};
