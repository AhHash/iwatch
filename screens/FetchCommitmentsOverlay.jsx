import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { fetchCommitments, getSeriesDetails } from "../util/fetchFromDB";
import { useLayoutEffect, useMemo, useState } from "react";
import Commitment from "../models/Commitment";
import CommitmentsList from "../components/commitments/CommitmentsList";
import { placeholderImages } from "../constants/styles";

const FetchCommitmentsOverlay = ({ navigation: { navigate } }) => {
  const [searchInput, setSearchInput] = useState("");
  const [commitments, setCommitments] = useState([]);

  useLayoutEffect(() => {
    setCommitments([]);
  }, []);

  const search = useMemo(() => {
    let id = 0;
    const callerFunction = (query) => {
      clearTimeout(id);
      if (query.length >= 3) {
        id = setTimeout(async () => {
          const result = await fetchCommitments(query);
          const initialCommitments = result.results.slice(0, 10);

          const resultCommitments = await Promise.all(
            initialCommitments.map(async (result) => {
              if (result.media_type == "movie") {
                const commitment = new Commitment(
                  result.name || result.original_name || result.original_title,
                  result.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                    : placeholderImages.commitment,
                  0,
                  1,
                  0,
                  null,
                  result.overview,
                  "yet to watch",
                  "movie"
                );
                commitment.date = result.release_date.split("-")[0];
                return commitment;
              } else if (result.media_type == "tv") {
                try {
                  const seriesDetails = await getSeriesDetails(result.id);
                  console.log(result);

                  const commitment = new Commitment(
                    result.name ||
                      result.original_name ||
                      result.original_title,
                    result.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                      : placeholderImages.commitment,
                    0,
                    seriesDetails.number_of_episodes,
                    0,
                    null,
                    result.overview,
                    "yet to watch",
                    "multi-episode"
                  );
                  commitment.date = result.release_date.split("-")[0];
                  return commitment;
                } catch (error) {}
              }
            })
          );
          const filteredCommitments = resultCommitments.filter(
            (commitment) => commitment
          );
          setCommitments(filteredCommitments);
        }, 1000);
      }
    };
    return callerFunction;
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.row}>
          <TextInput
            style={[styles.inputText]}
            value={searchInput}
            onChangeText={(text) => {
              setSearchInput(text);
              search(text);
            }}
            placeholder="Type a commitment's name..."
          />
        </View>
        <View style={styles.listContainer}>
          <CommitmentsList
            data={commitments}
            itemOnPress={(commitment) => {
              navigate("Manage", {
                mode: "add",
                type: "commitment",
                data: commitment,
              });
            }}
            reverse
            hideStatus
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FetchCommitmentsOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    paddingVertical: 20,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 4,
  },
  rowTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputText: {
    backgroundColor: "#2c2c2c",
    fontSize: 24,
    padding: 12,
    color: "white",
  },
  listContainer: {
    flex: 1,
    paddingVertical: 10,
    marginBottom: "5%",
    borderRadius: 4,
    overflow: "hidden",
  },
});
