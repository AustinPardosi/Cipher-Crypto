import { NextRequest, NextResponse } from "next/server";

const cleanText = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/[^a-zA-Z]/g, "");
};



const AutoKeyVigereneDecrypt = (text: string, key: string) => {
  console.log("Masukkk")
  const m = 26;
  let encryptedText = "";
  let keyIndex = 0;

  let cleanedCipherText = cleanText(text);
  let cleanKey = cleanText(key);

  /**
   * Hanya sebagai tambahan, seolah penagaanan "catch" jika key lebih pendek dari plaintext
   * Karena kalau key.length == ciperText.length, maka tidak perlu diulang
   */
  let cleanedKey = cleanKey + cleanedCipherText.substring(0, cleanedCipherText.length - cleanKey.length); 
  
  for (let i = 0; i < cleanedCipherText.length; i++) {
    let textChar = cleanedCipherText[i];
    let keyChar = cleanedKey[keyIndex];
    let textCharCode = textChar.charCodeAt(0);
    let keyCharCode = keyChar.charCodeAt(0);
    let keyIndexChar = keyCharCode - 97;
    let textIndexChar = textCharCode - 97;
    
    let encryptedCharCode = (textIndexChar - keyIndexChar + m) % m + 97;
    encryptedText += String.fromCharCode(encryptedCharCode);
    keyIndex++;
  }
  return { encryptedText, cleanedCipherText, cleanKey };
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

  const encryptedText = AutoKeyVigereneDecrypt(text, key);
  return NextResponse.json({ data: encryptedText.encryptedText, key: encryptedText.cleanKey, text: encryptedText.cleanedCipherText }, { status: 200 });
}