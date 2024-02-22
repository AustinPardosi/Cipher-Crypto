import { NextRequest, NextResponse } from "next/server";


export const ExtendedVigenereDecrypt = (encryptedText: string, key: string) => {
  let decryptedText = "";
  let keyIndex = 0;

  for (let i = 0; i < encryptedText.length; i++) {
      let char = encryptedText[i];

      let charCode = encryptedText.charCodeAt(i);
      let keyChar = key.charCodeAt(keyIndex % key.length); 
      
      let decryptedCharCode;
      if (charCode >= 32 && charCode <= 126) {
          decryptedCharCode = (charCode - 32 - (keyChar - 32) + (126 - 32 + 1)) % (126 - 32 + 1) + 32;
      } else {
          decryptedCharCode = charCode;
      }

      let decryptedChar = String.fromCharCode(decryptedCharCode);
      decryptedText += decryptedChar;

      keyIndex++;
  }

  return { decryptedText };
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