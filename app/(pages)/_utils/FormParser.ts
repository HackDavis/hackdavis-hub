import Submission from "@typeDefs/submission";
import { TrackScore } from "@typeDefs/submission";

export function PackScores(dynamicQuestions: { [key: string]: number }) {
  const pairs = Object.entries(dynamicQuestions);
  const scoreDict: { [key: string]: { [question: string]: number } } = {};

  for (const [fullQuestion, value] of pairs) {
    const [category, question] = fullQuestion.split("::");
    if (category in scoreDict) {
      scoreDict[category][question] = value;
    } else {
      scoreDict[category] = { [question]: value };
    }
  }
  return Object.entries(scoreDict).map(([category, scores]) => ({
    trackName: category,
    rawScores: scores,
    finalTrackScore: null,
  }));
}

export function FlattenScores(dynamicQuestions: any) {
  return Object.fromEntries(
    dynamicQuestions
      .map((trackScore: TrackScore) => {
        const trackScores = Object.entries(trackScore.rawScores).map(
          ([question, score]) => [
            `${trackScore.trackName}::${question}`,
            score,
          ],
        );
        return trackScores;
      })
      .flat(),
  );
}

export function UpdateSubmission(
  submission: Submission,
  baseQuestions: any,
  dynamicQuestions: any,
) {
  return {
    ...submission,
    ...baseQuestions,
    scores: PackScores(dynamicQuestions),
    is_scored: true,
  };
}
