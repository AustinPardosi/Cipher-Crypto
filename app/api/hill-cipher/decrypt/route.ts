import { NextRequest, NextResponse } from "next/server";
import * as math from "mathjs";

const cleanText = (text: string): string => {
  return text.toLowerCase().replace(/[^a-z]/g, "");
};

const modInverse = (a: number, m: number): number | null => {
  a = a % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return null;
};

// Calculate the minor of a matrix
function minor(matrix: number[][], i: number, j: number): number[][] {
  return matrix
    .filter((_, rowIndex) => rowIndex !== i)
    .map((row) => row.filter((_, colIndex) => colIndex !== j));
}

// Calculate the determinant of a matrix
function determinant(matrix: number[][]): number {
  if (matrix.length === 1) return matrix[0][0];
  if (matrix.length === 2)
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  return matrix[0].reduce(
    (sum, element, index) =>
      sum +
      element *
        (index % 2 === 0 ? 1 : -1) *
        determinant(minor(matrix, 0, index)),
    0
  );
}

// Calculate the cofactor of a matrix element
function cofactor(matrix: number[][], i: number, j: number): number {
  return ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor(matrix, i, j));
}

// Transpose a matrix
function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

// Calculate the adjoint of a matrix
function adjoint(matrix: number[][]): number[][] {
  const adj = Array.from(Array(matrix.length), () =>
    new Array(matrix.length).fill(0)
  );
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      adj[j][i] = cofactor(matrix, i, j); 
    }
  }
  return adj;
}

// Calculate the modular inverse of a matrix
const calculateModularInverseMatrix = (
  matrixInput: number[][],
  mod: number
): number[][] | null => {
  const det = determinant(matrixInput);
  const detMod = ((det % mod) + mod) % mod;
  const detInv: number | null = modInverse(detMod, mod);

  if (detInv === null) {
    throw new Error(`Matrix determinant is not invertible in modulo ${mod}`);
  }

  const adj = adjoint(matrixInput);
  return adj.map((row) =>
    row.map((value) => (((value * detInv) % mod) + mod) % mod)
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
  } catch (error) {
    throw new Error("Matrix is not invertible in modulo 26");
  }

  for (let i = 0; i < textNums.length; i += matrixInput.length) {
    const block = textNums.slice(i, i + matrixInput.length);
    const resultBlock = new Array(matrixInput.length)
      .fill(0)
      .map(
        (_, idx) =>
          matrixInverse[idx].reduce(
            (acc, curr, j) => acc + curr * (block[j] || 0),
            0
          ) % 26
      );

    decodedText += resultBlock
      .map((num) => String.fromCharCode(num + "a".charCodeAt(0)))
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
    console.log(error);
    return NextResponse.json(
      { error: "Failed to decrypt the text." },
      { status: 500 }
    );
  }
}
