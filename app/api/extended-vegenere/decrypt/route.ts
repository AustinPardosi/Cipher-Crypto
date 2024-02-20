import { NextRequest, NextResponse } from "next/server";


const StringtoBase64 = (text: string) => {
  return Buffer.from(text).toString('base64');
}

const ExtendedVigenereDecrypt = (text: string, key: string) => {
    const m = 256;
    let encryptedText = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        
        let code = text.charCodeAt(i);
        let keyChar = key.charCodeAt(keyIndex % key.length); // sama dengan repeated key

        let encryptedChar = String.fromCharCode(((code - keyChar) % m) );
        
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

  const encryptedText = ExtendedVigenereDecrypt(text, key);
  encryptedText.encryptedText = StringtoBase64(encryptedText.encryptedText);
  return NextResponse.json({ data: encryptedText.encryptedText, variant: "EXTENDED-VIGENERE" }, { status: 200 });
}