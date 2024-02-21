import { NextRequest, NextResponse } from "next/server";

// Define rotor wirings, reflector, and turnover positions
export const ROTORS = {
  I: { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", turnover: "Q" },
  II: { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", turnover: "E" },
  III: { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", turnover: "V" },
};

export const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

// Parse plugboard configuration to a Map
export const parsePlugboardConfig = (config: string): Map<string, string> => {
  const map = new Map<string, string>();
  config
    .toUpperCase()
    .split(" ")
    .forEach((pair) => {
      if (pair.length === 2) {
        const [a, b] = pair.split("");
        map.set(a, b);
        map.set(b, a);
      }
    });
  return map;
};

// Encrypt a letter through a rotor
export const encryptThroughRotor = (
  letter: string,
  rotor: string,
  offset: number
): string => {
  const letterPosition =
    (letter.charCodeAt(0) - "A".charCodeAt(0) + offset) % 26;
  return rotor[letterPosition];
};

// Reflect a letter through the reflector
export const reflectThroughReflector = (
  letter: string,
  reflector: string
): string => {
  const letterPosition = letter.charCodeAt(0) - "A".charCodeAt(0);
  return reflector[letterPosition];
};

// Rotate rotor positions, considering double-stepping mechanism
export const rotateRotors = (positions: string[]): string[] => {
  let newPos = [...positions];
  // Right rotor rotates every key press
  newPos[2] = String.fromCharCode(
    ((newPos[2].charCodeAt(0) - 65 + 1) % 26) + 65
  );

  // Check for middle rotor turnover
  if (positions[2] === ROTORS.III.turnover) {
    newPos[1] = String.fromCharCode(
      ((newPos[1].charCodeAt(0) - 65 + 1) % 26) + 65
    );
  }

  // Check for left rotor turnover (double-stepping mechanism)
  if (positions[1] === ROTORS.II.turnover) {
    newPos[0] = String.fromCharCode(
      ((newPos[0].charCodeAt(0) - 65 + 1) % 26) + 65
    );
    newPos[1] = String.fromCharCode(
      ((newPos[1].charCodeAt(0) - 65 + 1) % 26) + 65
    ); // Middle rotor also steps when left rotor steps
  }

  return newPos;
};

// The main function to encode the input text
export const enigmaEncode = (
  inputText: string,
  initialRotorPositions: string[],
  plugboardConfig: string
): string => {
  let encryptedText = "";
  const plugboardMap = parsePlugboardConfig(plugboardConfig);
  let rotorPositions = [...initialRotorPositions]; // Initial rotor positions

  for (let char of inputText.toUpperCase()) {
    if (!/[A-Z]/.test(char)) {
      encryptedText += char; // Non-alphabetic characters are not encrypted
      continue;
    }

    // Plugboard substitution
    char = plugboardMap.get(char) || char;

    // Rotate rotors before encryption
    rotorPositions = rotateRotors(rotorPositions);
    console.log(rotorPositions);

    // Encrypt through rotors and reflector
    let encryptedChar = encryptThroughRotor(
      char,
      ROTORS.III.wiring,
      rotorPositions[2].charCodeAt(0) - "A".charCodeAt(0)
    );
    encryptedChar = encryptThroughRotor(
      encryptedChar,
      ROTORS.II.wiring,
      rotorPositions[1].charCodeAt(0) - "A".charCodeAt(0)
    );
    encryptedChar = encryptThroughRotor(
      encryptedChar,
      ROTORS.I.wiring,
      rotorPositions[0].charCodeAt(0) - "A".charCodeAt(0)
    );

    // Reflector reflection
    encryptedChar = reflectThroughReflector(encryptedChar, REFLECTOR_B);

    // Final plugboard substitution
    encryptedChar = plugboardMap.get(encryptedChar) || encryptedChar;

    encryptedText += encryptedChar;
  }

  return encryptedText;
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
  const encryptedText = enigmaEncode(
    inputText,
    rotorPositions,
    plugboardConfig
  );
  return NextResponse.json({ data: encryptedText }, { status: 200 });
}
