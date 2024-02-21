import { NextRequest, NextResponse } from "next/server";
import {
  REFLECTOR_B,
  ROTORS,
  encryptThroughRotor,
  parsePlugboardConfig,
  reflectThroughReflector,
  rotateRotors,
} from "../encrypt/route";

// Assuming ROTORS, REFLECTOR_B, parsePlugboardConfig, encryptThroughRotor, reflectThroughReflector, rotateRotors functions are defined as in the previous snippet

// The main function to decode the input text (essentially the same as encoding due to Enigma's symmetric nature)
const enigmaDecode = (
  inputText: string,
  initialRotorPositions: string[],
  plugboardConfig: string
): string => {
  let decryptedText = "";
  const plugboardMap = parsePlugboardConfig(plugboardConfig);
  let rotorPositions = [...initialRotorPositions]; // Initial rotor positions for decoding

  for (let char of inputText.toUpperCase()) {
    if (!/[A-Z]/.test(char)) {
      decryptedText += char; // Non-alphabetic characters are not encrypted/decrypted
      continue;
    }

    // Plugboard substitution
    char = plugboardMap.get(char) || char;

    // Rotate rotors before decryption (same as encryption)
    rotorPositions = rotateRotors(rotorPositions);

    // Decrypt through rotors and reflector (reverse order after reflector)
    let decryptedChar = encryptThroughRotor(
      char,
      ROTORS.I.wiring,
      26 - (rotorPositions[0].charCodeAt(0) - "A".charCodeAt(0)) // Reverse rotor I encryption
    );
    decryptedChar = encryptThroughRotor(
      decryptedChar,
      ROTORS.II.wiring,
      26 - (rotorPositions[1].charCodeAt(0) - "A".charCodeAt(0)) // Reverse rotor II encryption
    );
    decryptedChar = encryptThroughRotor(
      decryptedChar,
      ROTORS.III.wiring,
      26 - (rotorPositions[2].charCodeAt(0) - "A".charCodeAt(0)) // Reverse rotor III encryption
    );

    // Reflector reflection (same as in encryption since it's symmetric)
    decryptedChar = reflectThroughReflector(decryptedChar, REFLECTOR_B);

    // Final plugboard substitution (same as initial due to symmetry)
    decryptedChar = plugboardMap.get(decryptedChar) || decryptedChar;

    decryptedText += decryptedChar;
  }

  return decryptedText;
};

export async function POST(req: NextRequest, res: NextResponse) {
  const requestBody = await req.json();
  const { inputText, rotorPositions, plugboardConfig } = requestBody;
  //   console.log(inputText);
  //   console.log(rotorPositions);
  //   console.log(plugboardConfig);

  // Ensure the types are as expected; you might need more thorough validation in a real app
  if (
    typeof inputText !== "string" ||
    !Array.isArray(rotorPositions) ||
    typeof plugboardConfig !== "string"
  ) {
    return new Response(JSON.stringify({ error: "Invalid input types" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const decryptedText = enigmaDecode(
    inputText,
    rotorPositions,
    plugboardConfig
  );
  return NextResponse.json({ data: decryptedText }, { status: 200 });
}
