import { NextRequest, NextResponse } from "next/server";

export const ExtendedVigenereEncrypt = (text: string, key: string) => {
  const m = 256;
  let encryptedText = "";
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      let keyCharCode = key.charCodeAt(keyIndex % key.length);

      
      let encryptedCharCode = (charCode + keyCharCode) % m;
      let encryptedChar = String.fromCharCode(encryptedCharCode);
      
      encryptedText += encryptedChar;
      keyIndex++;
  }

  return {encryptedText};
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

  const encryptedText = ExtendedVigenereEncrypt(text, key);
  return NextResponse.json({ data: encryptedText.encryptedText, variant: "EXTENDED-VIGENERE" }, { status: 200 });
}