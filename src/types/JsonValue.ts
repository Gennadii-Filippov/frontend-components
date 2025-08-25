export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonArray = Array<JsonValue>;

export type JsonValue = string | number | boolean | JsonObject | JsonArray;
