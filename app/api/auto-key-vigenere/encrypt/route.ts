import { NextRequest, NextResponse } from "next/server";

const cleanText = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/[^a-zA-Z]/g, "");
};

const StringtoBase64 = (text: string) => {
  return Buffer.from(text).toString('base64');
}

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
    let encryptedCharCode = (textCharCode + keyCharCode) % m + 65;
    encryptedText += String.fromCharCode(encryptedCharCode);
    keyIndex++;
  }
  return { encryptedText, cleanedPlainText, cleanKey };
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
  encryptedText.encryptedText = StringtoBase64(encryptedText.encryptedText);
  return NextResponse.json({ data: encryptedText.encryptedText, key: encryptedText.cleanKey, plainText: encryptedText.cleanedPlainText, variant: "VIGENERE-AUTO-KEY" }, { status: 200 });
}