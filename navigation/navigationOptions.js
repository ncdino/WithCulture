import React from "react";
import Header from "../components/Header/Header";


export const getCommonHeaderOptions = (navigation, title = null) => ({
  headerTitle: () =>
    title ? (
      <Header.DetailTitle navigation={navigation} title={title} />
    ) : (
      <Header.Logo navigation={navigation} />
    ),
  headerRight: () => <Header.Actions navigation={navigation} />,
  headerShown: true,
});
