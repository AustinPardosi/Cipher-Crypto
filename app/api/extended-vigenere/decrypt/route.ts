import { NextRequest, NextResponse } from "next/server";


const ExtendedVigenereDecrypt = (encryptedText: string, key: string) => {
  const m = 256;
  let decryptedText = "";
  let keyIndex = 0;

  for (let i = 0; i < encryptedText.length; i++) {
      let encryptedCharCode = encryptedText.charCodeAt(i);
      let keyCharCode = key.charCodeAt(keyIndex % key.length);

      let decryptedCharCode = (encryptedCharCode - keyCharCode + m) % m;
      let decryptedChar = String.fromCharCode(decryptedCharCode);
      
      decryptedText += decryptedChar;
      keyIndex++;
  }

  return {decryptedText};
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

  const encryptedText = ExtendedVigenereDecrypt(text, key);
  return NextResponse.json({ data: encryptedText.decryptedText, variant: "EXTENDED-VIGENERE" }, { status: 200 });
}