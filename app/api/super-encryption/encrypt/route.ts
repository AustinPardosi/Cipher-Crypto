import { NextRequest, NextResponse } from "next/server";
import { ExtendedVigenereEncrypt as VigereneEncrypt } from "../../extended-vigenere/encrypt/route";

const superEncode = (
  text: string,
  keySubstitution: string,
  keyTransposition: number
) => {
  // First, apply the Vigenère cipher for substitution
  const encryptedTextSubstitution = VigereneEncrypt(
    text,
    keySubstitution
  ).encryptedText;

  // Determine the padding needed to make the text divisible by keyTransposition
  const paddingLength =
    keyTransposition - (encryptedTextSubstitution.length % keyTransposition);
  const paddedText = encryptedTextSubstitution + "_".repeat(paddingLength);

  let transposedText = "";
  const rows = Math.ceil(paddedText.length / keyTransposition);
  const grid = Array.from({ length: rows }, () =>
    Array(keyTransposition).fill(null)
  );

  // Fill the grid with characters from the padded substituted text
  for (let i = 0; i < paddedText.length; i++) {
    const row = Math.floor(i / keyTransposition);
    const col = i % keyTransposition;
    grid[row][col] = paddedText[i];
  }

  // Read the text out in columns to get the transposed text
  for (let col = 0; col < keyTransposition; col++) {
    for (let row = 0; row < rows; row++) {
      if (grid[row][col] !== null) {
        transposedText += grid[row][col];
      }
    }
  }

  return transposedText;
};

export async function POST(req: NextRequest, res: NextResponse) {
  const requestBody = await req.json();
  const { text, keySubstitution, keyTransposition } = requestBody;

  if (
    !text ||
    keySubstitution === undefined ||
    keyTransposition === undefined
  ) {
    return NextResponse.json(
      { error: "Missing text or keys" },
      { status: 400 }
    );
  }

  const encryptedText = superEncode(
    text,
    keySubstitution,
    parseInt(keyTransposition)
  );
  return NextResponse.json({ data: encryptedText }, { status: 200 });
}
