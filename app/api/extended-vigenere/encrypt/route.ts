import { NextRequest, NextResponse } from "next/server";

export const ExtendedVigenereEncrypt = (text: string, key: string) => {
  let encryptedText = "";
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
      let char = text[i];

      let charCode = text.charCodeAt(i);
      let keyChar = key.charCodeAt(keyIndex % key.length); 
      
      let encryptedCharCode;
      if (charCode >= 32 && charCode <= 126) {
          encryptedCharCode = (charCode - 32 + keyChar - 32) % (126 - 32 + 1) + 32;
      } else {
          encryptedCharCode = charCode;
      }

      let encryptedChar = String.fromCharCode(encryptedCharCode);
      encryptedText += encryptedChar;

      keyIndex++;
  }

  return { encryptedText };
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