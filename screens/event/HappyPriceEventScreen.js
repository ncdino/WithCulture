import { SafeAreaView } from "react-native";

const HappyPriceEventScreen = ({ route, navigation }) => {
  const params = route.params || {};

  const { data, isLoading, isError } = useQuery({
    queryKey: ["performances", { endpoint: endpoint, params: searchParams }],
    queryFn: fetchPerformances,
    enabled: !!searchParams && Object.keys(searchParams).length > 0,
  });

  return <SafeAreaView></SafeAreaView>
};

export default HappyPriceEventScreen;
