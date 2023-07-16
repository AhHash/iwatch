import { StyleSheet, Text, View } from "react-native";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { updateCommitment } from "../../features/commitments/commitmentsThunk";
import Commitment from "../../models/Commitment";
import EpisodeCounter from "./EpisodeCounter";
import CustomButton from "../ui/CustomButton";
import { globalColors } from "../../constants/styles";

const CommitmentButtons = ({
  commitment: commitmentData,
  limitEpisodeContainer,
  readOnlyInput,
}) => {
  const dispatch = useDispatch();

  const commitment = { ...commitmentData };

  const showEpisodesButtons =
    commitment.type != "movie" && commitment.status == "watching";
  const showWatchButtons =
    commitment.type != "movie" && commitment.status == "yet to watch";
  const showRewatchButton =
    commitment.type != "movie" && commitment.status == "finished";
  const showMarkAsUndoneButton =
    commitment.type == "movie" && commitment.status == "finished";
  const showMarkAsDoneButton =
    commitment.type == "movie" &&
    (commitment.status == "watching" || commitment.status == "yet to watch");

  const updateCommitmentHandler = useCallback(
    (updatedCommitment) => {
      dispatch(
        updateCommitment(
          new Commitment(
            updatedCommitment.name,
            updatedCommitment.imgUri,
            updatedCommitment.imgLocal,
            updatedCommitment.totalEpisodes,
            updatedCommitment.currentEpisode,
            updatedCommitment.category,
            updatedCommitment.description,
            updatedCommitment.status,
            updatedCommitment.type,
            updatedCommitment.id
          )
        )
      );
    },
    [dispatch, updateCommitment]
  );

  return (
    <>
      {showEpisodesButtons && (
        <View
          style={[
            styles.commitmentEpisodeButtonsContainer,
            limitEpisodeContainer &&
              styles.limitedCommitmentEpisodeButtonsContainer,
          ]}
        >
          <Text style={styles.episodeText}>Current Episode</Text>
          <View style={styles.episodeCounter}>
            <EpisodeCounter
              readOnlyInput={readOnlyInput}
              initialValue={commitment.currentEpisode}
              onValueChange={(value) => {
                commitment.currentEpisode = value;
                if (value >= commitment.totalEpisodes) {
                  commitment.status = "finished";
                }
                updateCommitmentHandler(commitment);
              }}
              upperLimit={commitment.totalEpisodes}
            />
            <Text
              style={styles.totalEpisodesCount}
            >{`/ ${commitment.totalEpisodes}`}</Text>
          </View>
        </View>
      )}

      {showRewatchButton && (
        <View style={styles.buttonContainer}>
          <CustomButton
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => {
              commitment.currentEpisode = 0;
              commitment.status = "watching";
              updateCommitmentHandler(commitment);
            }}
          >
            <Text>Rewatch</Text>
          </CustomButton>
        </View>
      )}

      {showWatchButtons && (
        <View style={styles.buttonContainer}>
          <CustomButton
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => {
              commitment.currentEpisode = 0;
              commitment.status = "watching";
              updateCommitmentHandler(commitment);
            }}
          >
            <Text>Watch</Text>
          </CustomButton>
        </View>
      )}

      {showMarkAsDoneButton && (
        <View style={styles.buttonContainer}>
          <CustomButton
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => {
              commitment.currentEpisode = commitment.totalEpisodes;
              commitment.status = "finished";
              updateCommitmentHandler(commitment);
            }}
          >
            <Text>Mark as Done</Text>
          </CustomButton>
        </View>
      )}

      {showMarkAsUndoneButton && (
        <View style={styles.buttonContainer}>
          <CustomButton
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => {
              commitment.currentEpisode = 0;
              commitment.status = "yet to watch";
              updateCommitmentHandler(commitment);
            }}
          >
            <Text>Unwatch</Text>
          </CustomButton>
        </View>
      )}
    </>
  );
};

export default CommitmentButtons;

const styles = StyleSheet.create({
  commitmentEpisodeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 10,
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: "1.9%",
  },
  limitedCommitmentEpisodeButtonsContainer: {
    flex: 5,
    marginHorizontal: 0,
    columnGap: 0,
    marginBottom: 0,
  },
  episodeText: {
    flex: 2,
    color: globalColors.textMain,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  episodeCounter: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  totalEpisodesCount: {
    color: globalColors.textMain,
    fontSize: 24,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 8,
    minWidth: "60%",
  },
  buttonText: {
    textAlign: "center",
  },
});
