import { NextRequest, NextResponse } from "next/server";

const cleanText = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/[^a-zA-Z]/g, "");
};

// decrypt function of vigerene cipher

export const VigereneDecrypt = (text: string, key: string) => {
  const m = 26;
  let decryptedText = "";
  let keyIndex = 0;
  const cleanedText = cleanText(text);
  const cleanedKey = cleanText(key);
  for (let i = 0; i < cleanedText.length; i++) {
    let char = cleanedText[i];
    if (char.match(/[a-z]/i)) {
      let code = cleanedText.charCodeAt(i);
      let keyChar = cleanedKey.charCodeAt(keyIndex % cleanedKey.length);
      let keyIndexChar = keyChar - 97;
      let codeIndexChar = code - 97;
      let decryptedChar = String.fromCharCode(
        ((codeIndexChar - keyIndexChar + m) % m) + 97
      );
      decryptedText += decryptedChar;
      keyIndex++;
    } else {
      decryptedText += char;
    }
  }
  return { decryptedText, cleanedKey, cleanedText };
};

export async function POST(req: NextRequest, res: NextResponse) {
  const requestBody = await req.json();
  const { text, key } = requestBody;

  if (!text || !key) {
    return NextResponse.json({ error: "Missing text or key" }, { status: 400 });
  }

  const decryptedText = VigereneDecrypt(text, key);
  return NextResponse.json({ data: decryptedText }, { status: 200 });
}
