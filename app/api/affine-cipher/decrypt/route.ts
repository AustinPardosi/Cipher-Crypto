import { NextRequest, NextResponse } from "next/server";

const cleanText = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/[^a-zA-Z]/g, "");
};

// Calculate the modular inverse of 'a' modulo 'm'
const modInverse = (a: number, m: number): number => {
  a = a % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return 1;
};

const affineDecode = (text: string, a: number, b: number): string => {
  // Implementation of Affine Cipher decryption
  const m = 26;
  let decodedText = "";
  const aInverse = modInverse(a, m);

  // Clean the text
  const cleanedText = cleanText(text);

  for (let i = 0; i < cleanedText.length; i++) {
    let char = cleanedText[i];

    if (char.match(/[a-z]/i)) {
      let code = cleanedText.charCodeAt(i);
      let decodedChar = "";

      if (code >= 65 && code <= 90) {
        // Uppercase
        decodedChar = String.fromCharCode(
          ((aInverse * (code - 65 - b + m)) % m) + 65
        );
      } else if (code >= 97 && code <= 122) {
        // Lowercase
        decodedChar = String.fromCharCode(
          ((aInverse * (code - 97 - b + m)) % m) + 97
        );
      }

      decodedText += decodedChar;
    } else {
      decodedText += char;
    }
  }

  return decodedText;
};

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  const { text, keyA, keyB } = requestBody;

  if (!text || keyA === undefined || keyB === undefined) {
    return new NextResponse(JSON.stringify({ error: "Missing text or keys" }), {
      status: 400,
    });
  }

  const a = parseInt(keyA, 10);
  const b = parseInt(keyB, 10);

  if (isNaN(a) || isNaN(b) || a <= 0 || b < 0) {
    return new NextResponse(JSON.stringify({ error: "Invalid keys" }), {
      status: 400,
    });
  }

  const decodedText = affineDecode(text, a, b);
  return new NextResponse(JSON.stringify({ data: decodedText }), {
    status: 200,
  });
}
