import type { Document } from "@anvia/core";
import { studyTechniqueDocuments } from "./study-techniques";
import { syllabusDocuments } from "./syllabus";

// Static context attached to every agent run.
export const staticContext: readonly Document[] = [...syllabusDocuments, ...studyTechniqueDocuments];
