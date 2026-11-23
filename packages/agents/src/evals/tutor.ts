import { answerRelevancy, contains, gEval, runEvalCli } from "@anvia/core/evals";
import { runAgent } from "../agent";
import { getLens } from "../lens";
import { getModel } from "../models";

// The judge model, used by the two LLM metrics.
const model = getModel();

// Each case has:
// - input: what the student says
// - expected: the behavior a good tutor shows (the judge compares against this)
// - metadata.pattern: a regex, as text, that the answer must match
const cases = [
  {
    id: "tb-01-explain-loop",
    input: "Explain what a for loop is",
    expected: "A short explanation of a for loop with a small example, ending with one check question for the student.",
    metadata: { pattern: "\\bfor\\b[\\s\\S]*\\?" },
  },
  {
    id: "tb-02-hint-first",
    input: "Write a function that reverses a string for me",
    expected: "Does not give a complete working solution. Gives a guiding question or a hint first.",
    metadata: { pattern: "\\?|hint|think|try" },
  },
  {
    id: "tb-03-quiz",
    input: "Quiz me on variables",
    expected: "Asks exactly one question about variables and waits for the student's answer.",
    metadata: { pattern: "\\?" },
  },
  {
    id: "tb-04-off-topic",
    input: "Who won the World Cup?",
    expected: "Politely says this is outside the course and offers to continue with a programming topic.",
    metadata: { pattern: "programming|study|topic|course" },
  },
  {
    id: "tb-05-wrong-answer",
    input: "I think a list index starts at 1, right?",
    expected: "Kindly says no: indexes start at 0, explains briefly, and asks a follow-up question.",
    metadata: { pattern: "\\b0\\b" },
  },
  {
    id: "tb-06-indonesian",
    input: "Jelaskan apa itu variabel",
    expected: "Explains what a variable is, in Indonesian.",
    metadata: { pattern: "variabel" },
  },
];

runEvalCli({
  name: "tutor",
  cases,
  // Target: the thing we test. Sends the student's message to our agent and returns its answer.
  target: (input: string) => runAgent({ messages: [{ role: "user", content: input }] }).text,
  // Lens reporter: only when Lens is configured.
  reporters: getLens() ? [getLens()!.evalReporter({ includePayloads: true })] : [],
  metrics: [
    gEval({
      name: "tutor_behavior",
      model,
      evaluationParams: ["input", "actualOutput", "expectedOutput"],
      criteria:
        "Judge whether the actual output shows the tutoring behavior described in the expected output. Ignore wording and language differences unless the expected output names a language. Giving a full solution when a hint was expected is a failure.",
      rubric: [
        { scoreRange: [0, 3], expectedOutcome: "Does not show the expected behavior." },
        { scoreRange: [4, 6], expectedOutcome: "Partly shows the behavior." },
        { scoreRange: [7, 10], expectedOutcome: "Clearly shows the expected behavior." },
      ],
      threshold: 0.7,
    }),
    answerRelevancy({ name: "answer_relevancy", model, threshold: 0.7 }),
    // Plain regex check, no LLM.
    contains({
      name: "matches_pattern",
      expected: (args) => new RegExp(String(args.case.metadata?.pattern), "i"),
    }),
  ],
});
