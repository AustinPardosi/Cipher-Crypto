import { NextRequest, NextResponse } from "next/server";
import { ExtendedVigenereDecrypt as VigereneDecrypt } from "../../extended-vigenere/decrypt/route";

const superDecode = (
  text: string,
  keySubstitution: string,
  keyTransposition: number
) => {
  // Calculate the number of rows and columns for the grid
  const columns = keyTransposition;
  const rows = Math.ceil(text.length / columns);
  let transposedText = "";

  // Create an array to simulate the grid for transposition
  let grid = new Array(rows).fill("").map(() => new Array(columns).fill(null));

  // Populate the grid with characters from the encrypted text by columns
  let index = 0;
  for (let col = 0; col < columns && index < text.length; col++) {
    for (let row = 0; row < rows && index < text.length; row++) {
      grid[row][col] = text[index++];
    }
  }

  // Read the grid by rows to get the transposed text
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (grid[row][col] !== null) {
        transposedText += grid[row][col];
      }
    }
  }

  // Remove any padding if you added padding during encryption
  // Assuming "_" was used for padding, and it's not part of the original text
  transposedText = transposedText.replace(/_+$/, "");

  // Finally, apply the Vigenère cipher for decryption
  const decryptedText = VigereneDecrypt(transposedText, keySubstitution).decryptedText;

  return decryptedText;
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

  const encryptedText = superDecode(
    text,
    keySubstitution,
    parseInt(keyTransposition)
  );
  return NextResponse.json({ data: encryptedText }, { status: 200 });
}
