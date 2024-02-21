import { NextRequest, NextResponse } from "next/server";

var Matrix = require("node-matrices");

const cleanText = (text: string): string => {
  return text.toLowerCase().replace(/[^a-z]/g, "");
};

function modInverse(a: number, m: number): number | null {
  a = a % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return null;
}

function calculateModularInverseMatrix(
  matrixInput: number[][],
  mod: number
): number[][] | null {
  let matrix = new Matrix(matrixInput);
  //   matrix = matrix.data;
  console.log("matrix", matrix);
  // Assuming determinant returns a number; you need to handle if not
  let det = matrix.determinant() % 26;
  det = ((det % mod) + mod) % mod;
  console.log("det", det);
  const detInv: number | null = modInverse(det, mod);
  console.log("detInv", detInv);

  if (detInv === null) {
    throw new Error(`Matrix determinant is not invertible in modulo ${mod}`);
  }

  try {
    console.log("matrix", matrix);
    const invMatrix = matrix.inverse();
    console.log("invMatrix", invMatrix);
    // Assuming map exists and works as expected; adjust if the API differs
    return invMatrix.map((row: number[]) =>
      row.map((value: number) => Math.round(value * detInv) % mod)
    );
  } catch (error) {
    console.error("Error inverting matrix:", error);
    return null;
  }
}

Matrix.prototype.mod = function (this: any, mod: number): number[][] {
  return this.map((row: number[]) =>
    row.map((value: number) => Math.round(value) % mod)
  );
};

const hillDecode = (text: string, matrixInput: number[][]): string => {
  let decodedText = "";

  const cleanedText = cleanText(text);
  console.log("cleanedText", cleanedText);

  const textNums: number[] = cleanedText
    .split("")
    .map((char) => char.charCodeAt(0) - "a".charCodeAt(0));
  console.log("textNums", textNums);

  let matrixInverse: number[][];
  try {
    const result = calculateModularInverseMatrix(matrixInput, 26);
    if (result === null) {
      throw new Error("Matrix is not invertible in modulo 26");
    }
    matrixInverse = result;
    console.log("result", matrixInverse);
  } catch (error) {
    console.log("error", error);
    throw new Error("Matrix is not invertible in modulo 26");
  }

  for (let i = 0; i < textNums.length; i += matrixInput.length) {
    const block = textNums.slice(i, i + matrixInput.length);
    const resultBlock = new Matrix([block])
      .multiply(new Matrix(matrixInverse))
      .mod(26)
      .toArray()[0];

    decodedText += resultBlock
      .map((num: number) => String.fromCharCode(num + "a".charCodeAt(0)))
      .join("");
  }

  return decodedText;
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
    const decodedText = hillDecode(text, matrix);
    return NextResponse.json({ data: decodedText }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to decrypt the text." },
      { status: 500 }
    );
  }
}
