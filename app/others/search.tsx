import {
  View,
  Text,
  ActivityIndicator,
  useColorScheme,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import Styles from "@/constants/Styles";
import { CustomTextInput } from "@/components/Input";
import { getSearch } from "@/api/q";
import { SearchResult } from "@/types";
import { Colors } from "@/constants/Colors";
import StatusCards, { Empty } from "@/components/StatusCards";
import ResultCard from "@/components/Cards";
import SearchModal from "@/components/Modals";

const Search = () => {
  const [search, setSearch] = useState("");
  const theme = useColorScheme() ?? "light";
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<number | undefined>();
  const [state, setState] = useState<
    "idle" | "loading" | "load-more" | "error"
  >("idle");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [modalData, setModalData] = useState<SearchResult>();
  const searchFunction = async () => {
    setStatus(undefined);
    setState("loading");
    setPage(1);
    let result = await getSearch(search, 1);
    if (result.status == 503) {
      setStatus(result.status);
      setState("error");
      return;
    }
    setSearchResults(result.results);
    if (result.status == 200 && result.results.length == 0) {
      setStatus(result.status);
      setState("error");
      return;
    }
    setState("idle");
  };
  return (
    <ThemedView style={Styles.container}>
      {showModal && (
        <SearchModal setModalVisibility={setShowModal} modalData={modalData} />
      )}
      <CustomTextInput
        isSearch
        placeholderText="Search for a book..."
        setter={setSearch}
        submitFunction={searchFunction}
      />
      <ThemedView style={{ padding: 10 }} />
      {state == "loading" ? (
        <ActivityIndicator color={Colors[theme].icon} />
      ) : state == "error" ? (
        <StatusCards status={status} reloadAction={searchFunction} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ResultCard
              download_server={item.download_server}
              book_url={item.book_url}
              authors={item.authors}
              download_size={item.download_size}
              lang={item.lang}
              pages={item.pages}
              poster={item.poster}
              publisher={item.publisher}
              title={item.title}
              year={item.year}
              setModalData={setModalData}
              setModalVisibility={setShowModal}
            />
          )}
          contentContainerStyle={{ gap: 10 }}
          onEndReachedThreshold={0.7}
          onEndReached={async () => {
            setState("load-more");
            let results = await getSearch(search, page + 1);
            const newResults: SearchResult[] = results.results;
            setSearchResults((prevResults) => [...prevResults, ...newResults]);
            setPage(page + 1);
            if (results.results.length == 0 && results.status == 200) {
              setStatus(404);
              return;
            }
            setStatus(results.status);
          }}
          ListFooterComponent={
            status == 404 && searchResults?.length > 0 ? (
              <Empty />
            ) : state == "load-more" && status == 200 ? (
              <ActivityIndicator color={Colors.dark.icon} />
            ) : (
              <></>
            )
          }
          ListFooterComponentStyle={{ paddingBottom: 10 }}
        />
      )}
    </ThemedView>
  );
};

export default Search;
