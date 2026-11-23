import { OpenAIClient } from "@anvia/openai";

export const DEFAULT_MODEL_ID = process.env.LLM_MODEL ?? "deepseek-v4-flash-0731";

let client: OpenAIClient | undefined;

function getClient(): OpenAIClient {
  if (!client) {
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) throw new Error("Set LLM_API_KEY.");
    const baseUrl = process.env.LLM_BASE_URL;
    if (!baseUrl) throw new Error("Set LLM_BASE_URL.");
    client = new OpenAIClient({ apiKey, baseUrl });
  }
  return client;
}

export function getModel(modelId: string = DEFAULT_MODEL_ID) {
  return getClient().completionModel({ modelId, api: "chat" });
}
