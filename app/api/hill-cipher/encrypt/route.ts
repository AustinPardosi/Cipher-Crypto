import { NextRequest, NextResponse } from "next/server";
import { create, all } from "mathjs";

const config = {};
const math = create(all, config);

const cleanText = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/[^a-zA-Z]/g, "");
};

const hillEncode = (text: string, matrix: number[][]) => {
  let encryptedText = "";

  // Clean the text
  const cleanedText = cleanText(text);

  // Convert cleaned text to numerical values
  const textNums = cleanedText
    .split("")
    .map((char) => char.charCodeAt(0) - "a".charCodeAt(0));

  // Split textNums into blocks of size equal to matrix length
  const blockSize = matrix.length;
  for (let i = 0; i < textNums.length; i += blockSize) {
    const block = textNums.slice(i, i + blockSize);

    // Perform matrix multiplication in mod 26 space
    const resultBlock = math
      .multiply(matrix, block)
      .map((value) => math.mod(value, 26));

    // Convert numbers back to letters and append to encryptedText
    encryptedText += resultBlock
      .map((num) => String.fromCharCode(num + "a".charCodeAt(0)))
      .join("");
  }

  return encryptedText;
};

export async function POST(req: NextRequest, res: NextResponse) {
  const requestBody = await req.json();
  const { text, matrix } = requestBody;

  if (!text || !matrix) {
    return NextResponse.json(
      { error: "Missing text or matrix" },
      { status: 400 }
    );
  }

  try {
    const encryptedText = hillEncode(text, matrix);
    return NextResponse.json({ data: encryptedText }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to encrypt the text." },
      { status: 500 }
    );
  }
}
