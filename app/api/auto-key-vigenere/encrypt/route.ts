import { NextRequest, NextResponse } from "next/server";

const cleanText = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/[^a-zA-Z]/g, "");
};


const AutoKeyVigereneEncrypt = (text: string, key: string) => {
  const m = 26;
  let encryptedText = "";
  let keyIndex = 0;

  let cleanedPlainText = cleanText(text);
  let cleanKey = cleanText(key);
  let cleanedKey = cleanKey + cleanedPlainText.substring(0, cleanedPlainText.length - cleanKey.length);
  
  for (let i = 0; i < cleanedPlainText.length; i++) {
    let textChar = cleanedPlainText[i];
    let keyChar = cleanedKey[keyIndex];
    let textCharCode = textChar.charCodeAt(0);
    let keyCharCode = keyChar.charCodeAt(0);
    let keyIndexChar = keyCharCode - 97;
    let textIndexChar = textCharCode - 97;

    let encryptedCharCode = (textIndexChar + keyIndexChar) % m + 97;

    encryptedText += String.fromCharCode(encryptedCharCode);
    keyIndex++;
  }
  return { encryptedText, cleanedPlainText, cleanedKey };
};

export async function POST(req: NextRequest, res: NextResponse) {
  const requestBody = await req.json();
  const { text, key } = requestBody;

  if (!text || !key) {
    return NextResponse.json(
      { error: "Missing text or key" },
      { status: 400 }
    );
  }

  const encryptedText = AutoKeyVigereneEncrypt(text, key);
  return NextResponse.json({ data: encryptedText.encryptedText, key: encryptedText.cleanedKey, plainText: encryptedText.cleanedPlainText, variant: "VIGENERE-AUTO-KEY" }, { status: 200 });
}