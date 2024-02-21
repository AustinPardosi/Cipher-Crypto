import { NextRequest, NextResponse } from "next/server";

const cleanText = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/[^a-zA-Z]/g, "");
};

const StringtoBase64 = (text: string) => {
  return Buffer.from(text).toString('base64');
}

const PlayfairDecrypt = (text: string, key: string) => {
    const generateMatrixKey = () => {
        let matrix: Array<Array<String>> = [];
        let keyIndex = 0;
        let alphabet = "abcdefghiklmnopqrstuvwxyz";
        let cleanedKey = cleanText(key);
        cleanedKey = cleanedKey.replace(/j/g, "i");
        // remove duplicate characters
        cleanedKey = cleanedKey
            .split('')
            .filter((item, pos, self) => self.indexOf(item) == pos )
            .join('');
        for (let i = 0; i < 5; i++) {
            matrix[i] = [];
            for (let j = 0; j < 5; j++) {
                if (keyIndex < cleanedKey.length) {
                    matrix[i][j] = cleanedKey[keyIndex];
                    alphabet = alphabet.replace(cleanedKey[keyIndex], "");
                    keyIndex++;
                } else {
                    matrix[i][j] = alphabet[0];
                    alphabet = alphabet.slice(1);
                }
            }
        }
        return matrix;
    };

    let matrixKey = generateMatrixKey();
    let cleanedText = cleanText(text);
    let decryptedText = "";

    for (let i = 0; i < cleanedText.length; i += 2) {
        let firstChar = cleanedText[i];
        let secondChar = cleanedText[i + 1];

        if (secondChar === undefined) {
            secondChar = "x";
        }
        if (firstChar === secondChar) {
            secondChar = "x";
            i--;
        }

        let firstCharRow = -1;
        let firstCharCol = -1;
        let secondCharRow = -1;
        let secondCharCol = -1;

        for (let j = 0; j < 5; j++) {
            if (matrixKey[j].indexOf(firstChar) !== -1) {
                firstCharRow = j;
                firstCharCol = matrixKey[j].indexOf(firstChar);
            }
            if (matrixKey[j].indexOf(secondChar) !== -1) {
                secondCharRow = j;
                secondCharCol = matrixKey[j].indexOf(secondChar);
            }
        }

        if (firstCharRow === secondCharRow) {
            decryptedText += matrixKey[firstCharRow][(firstCharCol + 4) % 5];
            decryptedText += matrixKey[secondCharRow][(secondCharCol + 4) % 5];
        } else if (firstCharCol === secondCharCol) {
            decryptedText += matrixKey[(firstCharRow + 4) % 5][firstCharCol];
            decryptedText += matrixKey[(secondCharRow + 4) % 5][secondCharCol];
        } else {
            decryptedText += matrixKey[firstCharRow][secondCharCol];
            decryptedText += matrixKey[secondCharRow][firstCharCol];
        }
    }
    return {decryptedText, formattedKey: matrixKey, formattedText: cleanedText};
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
    
    const decryptedText = PlayfairDecrypt(text, key);
    decryptedText.decryptedText = StringtoBase64(decryptedText.decryptedText);
    return NextResponse.json({ data: decryptedText.decryptedText, key: decryptedText.formattedKey, text: decryptedText.formattedText, variant: "PLAYFAIR" }, { status: 200 });
}