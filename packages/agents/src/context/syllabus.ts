import type { Document } from "@anvia/core";

// Course syllabus for Introduction to Programming (language-agnostic, examples in Python-like pseudocode).
const topic = (id: string, title: string, text: string): Document => ({
  id: `syllabus-${id}`,
  text: `${title}: ${text}`,
  additionalProps: { source: "syllabus", topic: id },
});

export const syllabusDocuments: readonly Document[] = [
  topic("variables", "Variables and types", "A variable is a named place that holds a value. Common types: integer, float, string, boolean. Assignment uses =. Types decide what operations are allowed (for example, 1 + 1 is 2 but \"1\" + \"1\" is \"11\")."),
  topic("conditionals", "Conditionals", "if, elif and else choose which code runs based on a boolean condition. Comparison operators: ==, !=, <, >, <=, >=. Combine conditions with and, or, not."),
  topic("loops", "Loops", "A for loop repeats code a known number of times or once per item in a collection. A while loop repeats while a condition is true. Beware of infinite loops: the condition must eventually become false. break exits a loop, continue skips to the next round."),
  topic("functions", "Functions", "A function is a named, reusable block of code. It takes parameters and can return a value. Defining a function does not run it; calling it does. Variables created inside a function are local to it."),
  topic("lists", "Lists and arrays", "A list stores an ordered collection of items. Indexes start at 0, so the last item of a list of length n is at index n-1. Common operations: append, remove, length, slicing, and looping over items."),
  topic("strings", "Strings", "A string is a sequence of characters, indexed from 0 like a list. Common operations: concatenation, length, slicing, upper/lower case, split and join, and checking whether a substring is present. Strings are immutable: operations return a new string."),
  topic("debugging", "Basic debugging", "Read the error message from the bottom up: it names the error type and the line. Reproduce the bug with the smallest input, print intermediate values, and change one thing at a time. Common beginner errors: off-by-one, wrong indentation, using a variable before assigning it, mixing types."),
  topic("complexity", "Intro to complexity", "Complexity describes how running time grows with input size n. One loop over n items is O(n). A loop inside a loop is O(n^2). Accessing a list item by index is O(1). Prefer simpler code first; optimize only when it is too slow."),
];
