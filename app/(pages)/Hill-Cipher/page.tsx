"use client";

import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon } from "lucide-react";
import { create, all } from "mathjs";

const config = {};
const math = create(all, config);

const HillCipher = () => {
  const [inputMode, setInputMode] = useState("text");
  const [matrixMode, setMatrixMode] = useState("manual");
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState("");
  const [result, setResult] = useState("");
  const [isDecode, setIsDecode] = useState(false);
  const { toast } = useToast();
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrixValues, setMatrixValues] = useState(() =>
    Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0))
  );

  const increaseMatrixSize = () => {
    if (matrixSize >= 10) {
      toast({
        variant: "destructive",
        title: "Maximum manual matrix size reached",
        description:
          "Matrix size cannot be greater than 10. If you want to input more, use file key matrix input",
      });
      return;
    }
    const newSize = matrixSize + 1;
    const newValues = Array(newSize)
      .fill(0)
      .map((_, i) =>
        Array(newSize)
          .fill(0)
          .map((_, j) =>
            matrixValues[i] && matrixValues[i][j] ? matrixValues[i][j] : 0
          )
      );
    setMatrixSize(newSize);
    setMatrixValues(newValues);
  };

  const decreaseMatrixSize = () => {
    if (matrixSize > 2) {
      // Prevent matrix from being smaller than 2x2
      const newSize = matrixSize - 1;
      const newValues = matrixValues
        .map((row) => row.slice(0, newSize))
        .slice(0, newSize);
      setMatrixSize(newSize);
      setMatrixValues(newValues);
    }
  };

  const handleMatrixValueChange = (
    rowIndex: any,
    colIndex: any,
    value: any
  ) => {
    const newValues = matrixValues.map((row, i) =>
      row.map((cell, j) => {
        if (i === rowIndex && j === colIndex) {
          return parseInt(value) || 0; // Ensures that only numbers are stored
        }
        return cell;
      })
    );
    setMatrixValues(newValues);
  };

  const renderMatrixInputs = () => {
    return Array(matrixSize)
      .fill(0)
      .map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-2">
          {Array(matrixSize)
            .fill(0)
            .map((_, colIndex) => (
              <Input
                key={`input-${rowIndex}-${colIndex}`}
                type="number"
                value={matrixValues[rowIndex][colIndex]}
                onChange={(e) =>
                  handleMatrixValueChange(rowIndex, colIndex, e.target.value)
                }
                className="p-2 rounded-md bg-[#0B0C0D] border border-[#A6337E]"
              />
            ))}
        </div>
      ));
  };

  const handleRun = async () => {
    const matrix = math.matrix(matrixValues);
    const currentInputText = inputMode === "text" ? inputText : inputFile;
    try {
      if (isDecode) {
        await handleDecode(currentInputText, matrix.toArray() as number[][]);
      } else {
        await handleEncode(currentInputText, matrix.toArray() as number[][]);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
      });
    }
  };

  // Handler to encode or decode the input
  const handleEncode = async (currentInputText: String, matrix: number[][]) => {
    // Use the encode API route
    try {
      const response = await fetch(`/api/hill-cipher/encrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          text: currentInputText,
          matrix: matrix,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data.data);
      } else {
        // Handle errors
        toast({
          variant: "destructive",
          title: data.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: String(error),
      });
    }
  };

  const handleDecode = async (currentInputText: String, matrix: number[][]) => {
    // Use the decode API route
    try {
      const response = await fetch(`/api/hill-cipher/decrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          text: currentInputText,
          matrix: matrix,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
      } else {
        toast({
          variant: "destructive",
          title: data.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: String(error),
      });
    }
  };

  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setInputFile(content);
        if (matrixMode === "file") {
          try {
            const matrix = content
              .trim() // Remove whitespace from the start and end of the content
              .split("\n")
              .map((row) =>
                row
                  .trim() // Trim each row to remove whitespace
                  .split(",")
                  .filter((cell) => cell.trim() !== "") // Filter out empty strings
                  .map(Number)
              );
            setMatrixValues(matrix);
            setMatrixSize(matrix.length);
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Error reading matrix key file",
              description: "The file format is incorrect.",
            });
          }
        } else {
          // Handling for text input file
          setInputFile(content);
        }
      } else {
        setInputFile("");
        toast({
          variant: "destructive",
          title: "File content is not a string.",
          description: "File content could not be read as text.",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(result);
    toast({
      variant: "success",
      title: "Copied to clipboard",
    });
  }

  const handleDownloadResult = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "result.txt";
    document.body.appendChild(element);
    element.click();
  }

  return (
    <main className="min-h-screen bg-[#121212] text-[#E0E0E0] p-8 font-sans">
      <div className="max-w-8xl mx-auto">
        <div className="flex gap-4">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-transparent border-[#F244B5]"
              size="icon"
            >
              <ChevronLeftIcon className="h-4 w-4 text-[#F244B5]" />
            </Button>
          </Link>
          <h1 className="text-4xl text-[#F244B5] font-bold mb-4">
            Hill Cipher
          </h1>
        </div>
        <p className="text-lg mb-6">
          The Hill cipher is a polygraphic substitution cipher based on linear
          algebra. It encrypts blocks of text using matrix multiplication,
          providing a higher level of security than traditional single-character
          substitution ciphers.
        </p>
        <div className="flex flex-col md:flex-row md:gap-8 gap-2">
          {/* Key Information */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6 flex-1">
            <h2 className="text-xl text-[#F244B5] mb-4">Key Formulas</h2>
            <p className="italic mb-2">
              Encryption: <strong>C = KP (mod 26)</strong>
            </p>
            <p className="italic">
              Decryption:{" "}
              <strong>
                P = K<sup>-1</sup>C (mod 26)
              </strong>
            </p>
          </div>
          {/* Detailed Explanation */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6 flex-1">
            <h3 className="text-xl text-[#F244B5] mb-4">Details</h3>
            <ul className="list-disc list-inside">
              <li>
                <strong>K</strong> must be invertible, and{" "}
                <strong>
                  K<sup>-1</sup>
                </strong>{" "}
                exists in modulo 26.
              </li>
              <li>
                The determinant of <strong>K</strong> and 26 must be coprime.
              </li>
              <li>
                Each block of plaintext is represented as a column vector and
                multiplied by <strong>K</strong> to produce the ciphertext
                vector.
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col p-4 rounded-3xl bg-gray-800">
          <div className="py-2">
            <Label htmlFor="keyA" className="block mb-2 text-pink-300">
              Input Type
            </Label>
            <div className="flex gap-4 pb-2">
              <Button
                className={`px-4 py-2 rounded-md ${inputMode === "text" ? "bg-[#F244B5]" : "bg-gray-700"
                  }`}
                onClick={() => {
                  setInputMode("text");
                  setInputFile("");
                }}
              >
                Text Input
              </Button>
              <Button
                className={`px-4 py-2 rounded-md ${inputMode === "file" ? "bg-[#F244B5]" : "bg-gray-700"
                  }`}
                onClick={() => {
                  setInputMode("file");
                  setInputText("");
                }}
              >
                File Input
              </Button>
            </div>
            {inputMode === "text" ? (
              <div className="flex pb-4">
                <Textarea
                  id="inputText"
                  placeholder="Enter plaintext here"
                  className="w-full p-2 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center pb-4">
                <Input
                  type="file"
                  onChange={handleFileInputChange}
                  className="bg-[#0B0C0D] file:text-pink-300 border-[#A6337E] "
                />
              </div>
            )}
            <div className="flex gap-4">
              <div className="flex flex-col w-full">
                <Label htmlFor="keyA" className="block mb-2 text-pink-300">
                  Key Matrix
                </Label>
                <div className="flex gap-4 pb-2">
                  <Button
                    className={`px-4 py-2 rounded-md ${matrixMode === "manual" ? "bg-[#F244B5]" : "bg-gray-700"
                      }`}
                    onClick={() => {
                      setMatrixMode("manual");
                    }}
                  >
                    Manual
                  </Button>
                  <Button
                    className={`px-4 py-2 rounded-md ${matrixMode === "file" ? "bg-[#F244B5]" : "bg-gray-700"
                      }`}
                    onClick={() => {
                      setMatrixMode("file");
                    }}
                  >
                    File
                  </Button>
                </div>
                {matrixMode === "manual" ? (
                  <div className="flex flex-col pb-4 w-full">
                    <div className="flex items-center gap-2">
                      <Label>Current Matrix Size: {matrixSize} </Label>
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={increaseMatrixSize}
                          className="p-0 w-5 h-5"
                        >
                          <ChevronUpIcon className=" text-[#F244B5]" />
                        </Button>
                        <Button
                          onClick={decreaseMatrixSize}
                          className="p-0 w-5 h-5"
                        >
                          <ChevronDownIcon className=" text-[#F244B5]" />
                        </Button>
                      </div>
                    </div>
                    <div className="py-4 max-w-screen max-h-screen">
                      {renderMatrixInputs()}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center pb-4">
                    <Input
                      type="file"
                      onChange={handleFileInputChange}
                      className="bg-[#0B0C0D] file:text-pink-300 border-[#A6337E] "
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 items-center w-full px-1">
              <div className="col-span-1 flex gap-4 justify-start items-center">
                <p
                  className={
                    !isDecode ? "text-pink-400 font-bold" : "text-gray-400"
                  }
                >
                  Encode
                </p>
                <Switch
                  checked={isDecode}
                  onCheckedChange={setIsDecode}
                  className="border-2 border-[#D9D6CD]"
                />
                <p
                  className={
                    isDecode ? "text-pink-400 font-bold" : "text-gray-400"
                  }
                >
                  Decode
                </p>
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <Button
                  className="px-8 py-2 bg-[#F24BC6] hover:bg-[#F244B5] rounded-md"
                  onClick={handleRun}
                >
                  Run
                </Button>
              </div>
              {/* The third column is empty and acts as a spacer */}
              <div className="col-span-1"></div>
            </div>

            <div className="pt-2">
              <Label htmlFor="result" className="block mb-2 text-pink-300">
                Result
              </Label>
              <Textarea
                id="result"
                readOnly
                className="w-full p-2 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                value={result}
              ></Textarea>
              <div className="flex justify-start gap-4 pt-4">
                <Button
                  className="px-8 py-2 bg-[#F24BC6] hover:bg-[#F244B5] rounded-md"
                  onClick={handleCopyResult}
                >
                  Copy
                </Button>
                <Button
                  className="px-8 py-2 bg-[#F24BC6] hover:bg-[#F244B5] rounded-md"
                  onClick={handleDownloadResult}
                >
                  Download as txt
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HillCipher;
