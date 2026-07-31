/**
 * Safely extracts and parses JSON from an LLM response string.
 * Handles markdown code fences, conversational prefix/suffix text,
 * literal control characters (newlines/tabs), trailing commas, and unescaped quotes in string content.
 */
export function parseLLMJson(rawInput) {
  if (!rawInput) {
    throw new Error("Empty response received from LLM");
  }

  if (typeof rawInput !== "string") {
    return rawInput;
  }

  let text = rawInput.trim();

  // Step 1: Strip markdown code fences if wrapped in ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    text = codeBlockMatch[1].trim();
  }

  // Step 2: Extract content from outer JSON boundaries `{ ... }` or `[ ... ]`
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");

  let jsonCandidate = text;

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    if (firstBracket !== -1 && firstBracket < firstBrace && lastBracket > lastBrace) {
      jsonCandidate = text.substring(firstBracket, lastBracket + 1);
    } else {
      jsonCandidate = text.substring(firstBrace, lastBrace + 1);
    }
  }

  // Step 3: Direct parse attempt
  try {
    return JSON.parse(jsonCandidate);
  } catch (err1) {
    // Continue to repair strategies
  }

  // Step 4: Sanitize trailing commas and control characters
  let sanitized = jsonCandidate;
  // Remove trailing commas in objects and arrays
  sanitized = sanitized.replace(/,\s*([}\]])/g, "$1");
  // Fix raw unescaped newlines/tabs inside JSON double-quoted string values
  sanitized = fixControlCharsInStrings(sanitized);

  try {
    return JSON.parse(sanitized);
  } catch (err2) {
    // Step 5: Fallback extraction specifically for file objects { name, content }
    const fallbackFiles = extractFilesWithRegex(text);
    if (fallbackFiles && fallbackFiles.length > 0) {
      return { files: fallbackFiles };
    }
    throw new Error(`Failed to parse LLM JSON response: ${err2.message}`);
  }
}

/**
 * Escapes literal raw newlines, carriage returns, and tabs inside JSON string literals.
 */
function fixControlCharsInStrings(jsonStr) {
  let result = "";
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];

    if (inString) {
      if (isEscaped) {
        result += ch;
        isEscaped = false;
      } else if (ch === "\\") {
        result += ch;
        isEscaped = true;
      } else if (ch === '"') {
        result += ch;
        inString = false;
      } else if (ch === "\n") {
        result += "\\n";
      } else if (ch === "\r") {
        result += "\\r";
      } else if (ch === "\t") {
        result += "\\t";
      } else {
        result += ch;
      }
    } else {
      if (ch === '"') {
        inString = true;
      }
      result += ch;
    }
  }
  return result;
}

/**
 * Fallback regex extractor for file entries if JSON parsing fails due to unescaped quotes in content.
 */
function extractFilesWithRegex(text) {
  const files = [];
  const fileRegex = /"(?:name|file)"\s*:\s*"([^"]+)"\s*,\s*"content"\s*:\s*"/g;
  let match;

  while ((match = fileRegex.exec(text)) !== null) {
    const fileName = match[1];
    const contentStartIndex = match.index + match[0].length;

    let contentEndIndex = -1;
    let isEscaped = false;

    for (let i = contentStartIndex; i < text.length; i++) {
      const ch = text[i];
      if (isEscaped) {
        isEscaped = false;
      } else if (ch === "\\") {
        isEscaped = true;
      } else if (ch === '"') {
        const rest = text.slice(i + 1).trim();
        if (rest.startsWith("}") || rest.startsWith(",") || rest.startsWith("]")) {
          contentEndIndex = i;
          break;
        }
      }
    }

    if (contentEndIndex !== -1) {
      let rawContent = text.substring(contentStartIndex, contentEndIndex);
      rawContent = rawContent
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");

      files.push({
        name: fileName,
        content: rawContent,
      });
    }
  }

  return files;
}
