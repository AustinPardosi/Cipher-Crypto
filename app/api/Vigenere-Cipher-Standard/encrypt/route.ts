import { NextRequest, NextResponse } from "next/server";

const cleanText = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/[^a-zA-Z]/g, "");
};

export const VigereneEncrypt = (text: string, key: string) => {
    const m = 26;
    let encryptedText = "";
    let keyIndex = 0;

    const cleanedText = cleanText(text);
    const cleanedKey = cleanText(key);

    for (let i = 0; i < cleanedText.length; i++) {
        let char = cleanedText[i];

        if (char.match(/[a-z]/i)) {
            let code = cleanedText.charCodeAt(i);
            let keyChar = cleanedKey.charCodeAt(keyIndex % cleanedKey.length); // sama dengan repeated key

            let keyIndexChar = keyChar - 97;
            let codeIndexChar = code - 97;

            let encryptedChar = String.fromCharCode(((codeIndexChar + keyIndexChar) % m) + 97);
            
            encryptedText += encryptedChar;
            keyIndex++;
        } else {
            encryptedText += char;
        }
    }

    return {encryptedText, cleanedKey , cleanedText};
}

export async function POST(req: NextRequest, res: NextResponse) {
  const requestBody = await req.json();
  const { text, key } = requestBody;

  if (!text || !key) {
    return NextResponse.json(
      { error: "Missing text or key" },
      { status: 400 }
    );
  }

  const encryptedText = VigereneEncrypt(text, key);
  return NextResponse.json({ data: encryptedText.encryptedText, key: encryptedText.cleanedKey, plainText: encryptedText.cleanedText }, { status: 200 });
}