import { View } from "react-native";
import {
  UpcomingPerformanceDate,
  getBoxofficeStDate,
} from "../../utils/getCurrentDate";

const BoxOfficeScreen = () => {
  const searchParamsList = [
    { stdate: getBoxofficeStDate(), eddate: UpcomingPerformanceDate(1) },
  ];
  return (
    <View>
      <Text>박스오피스 스크린</Text>
      <Text>{UpcomingPerformanceDate(0)}</Text>
      <Text>{getBoxofficeStDate}</Text>
    </View>
  );
};

export default BoxOfficeScreen;
