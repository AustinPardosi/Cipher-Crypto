import { NextRequest, NextResponse } from "next/server";

const cleanText = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/[^a-zA-Z]/g, "");
};

const affineEncode = (text: string, a: number, b: number) => {
  // Implementation of Affine Cipher encryption
  const m = 26;
  let encryptedText = "";

  // Clean the text
  const cleanedText = cleanText(text);

  for (let i = 0; i < cleanedText.length; i++) {
    let char = cleanedText[i];

    if (char.match(/[a-z]/i)) {
      let code = cleanedText.charCodeAt(i);

      if (code >= 65 && code <= 90) {
        // Uppercase
        char = String.fromCharCode(((a * (code - 65) + b) % m) + 65);
      } else if (code >= 97 && code <= 122) {
        // Lowercase
        char = String.fromCharCode(((a * (code - 97) + b) % m) + 97);
      }
    }
    encryptedText += char;
  }
  return encryptedText;
};

export async function POST(req: NextRequest, res: NextResponse) {
  const requestBody = await req.json();
  const { text, keyA, keyB } = requestBody;

  if (!text || keyA === undefined || keyB === undefined) {
    return NextResponse.json(
      { error: "Missing text or keys" },
      { status: 400 }
    );
  }

  // Ensure keyA and keyB are numbers
  const a = parseInt(keyA, 10);
  const b = parseInt(keyB, 10);

  if (isNaN(a) || isNaN(b)) {
    return NextResponse.json({ error: "Invalid keys" }, { status: 400 });
  }

  const encryptedText = affineEncode(text, a, b);
  return NextResponse.json({ data: encryptedText }, { status: 200 });
}
