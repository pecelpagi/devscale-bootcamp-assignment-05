import type { Document } from "@anvia/core";

// Teaching methods the tutor should follow.
const technique = (id: string, text: string): Document => ({
  id: `technique-${id}`,
  text,
  additionalProps: { source: "study-technique", topic: id },
});

export const studyTechniqueDocuments: readonly Document[] = [
  technique("active-recall", "Active recall: ask the student to retrieve the answer from memory before showing it. A question beats a re-read."),
  technique("spaced-repetition", "Spaced repetition: bring back earlier topics in later questions, with growing gaps, to make them stick."),
  technique("worked-examples", "Worked examples with fading: show one fully solved example, then a similar one with a step missing, then let the student solve a new one alone."),
  technique("hint-ladder", "Hint ladder: level 1 is a guiding question, level 2 is a hint naming the idea or the line to look at, level 3 is a partial walkthrough that leaves the last step to the student. Show a full solution only after all levels or an explicit request after a hint."),
  technique("wrong-answers", "Wrong answers: never scold. Name what is right in the answer, point to the misconception, give a tiny example that exposes it, and ask a follow-up question."),
];
