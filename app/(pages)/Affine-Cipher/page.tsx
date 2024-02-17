"use client";

import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

const AffineCipher = () => {
  const [inputMode, setInputMode] = useState("text");
  const [inputText, setInputText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [keyA, setKeyA] = useState("");
  const [keyB, setKeyB] = useState("");
  const [result, setResult] = useState("");
  const [isDecode, setIsDecode] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const target = e.target as FileReader;
          const content = target.result;
          if (typeof content === "string") {
            setFileContent(content);
          } else {
            setFileContent("");
            toast({
              variant: "destructive",
              title: "File content is not a string.",
              description: "File content could not be read as text.",
            });
          }
        };
        reader.readAsText(file);
      } else {
        toast({
          variant: "destructive",
          title: "Wrong File Data Type",
          description: "Please upload a text (.txt) file.",
        });
      }
    }
  };

  const handleRun = async () => {
    const currentInputText = inputMode === "text" ? inputText : fileContent;
    if (isDecode) {
      await handleDecode(currentInputText);
    } else {
      await handleEncode(currentInputText);
    }
  };

  // Handler to encode or decode the input
  const handleEncode = async (currentInputText: String) => {
    // Use the encode API route
    try {
      const response = await fetch(`/api/affine-cipher/encrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          text: currentInputText,
          keyA: parseInt(keyA),
          keyB: parseInt(keyB),
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

  const handleDecode = async (currentInputText: String) => {
    // Use the decode API route
    try {
      const response = await fetch(`/api/affine-cipher/decrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          text: currentInputText,
          keyA: parseInt(keyA),
          keyB: parseInt(keyB),
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
            Affine Cipher
          </h1>
        </div>
        <p className="text-lg mb-6">
          The Affine cipher is a type of monoalphabetic substitution cipher that
          encrypts or decrypts letters in an alphabet using a simple
          mathematical function, leveraging modular arithmetic for reversible
          transformations.
        </p>
        <div className="flex flex-col md:flex-row md:gap-8 gap-2">
          {/* Key Information */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6 flex-1">
            <h2 className="text-xl text-[#F244B5] mb-4">Key Formulas</h2>
            <p className="italic mb-2">Encryption: C ≡ mP + b (mod n)</p>
            <p className="italic mb-2">
              Decryption: P ≡ m<sup>-1</sup>(C - b) (mod n)
            </p>
            <p>Key: m and b</p>
          </div>

          {/* Detailed Explanation */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6 flex-1">
            <h3 className="text-xl text-[#F244B5] mb-4">Details</h3>
            <ul className="list-disc list-inside">
              <li>n is the size of the alphabet.</li>
              <li>m is an integer that is relatively prime to n.</li>
              <li>b is the shift magnitude.</li>
              <li>
                Caesar cipher is a special case of the Affine cipher with m = 1.
              </li>
              <li>
                m<sup>-1</sup> is the multiplicative inverse of m (mod n),
                ensuring m.m<sup>-1</sup> ≡ 1 (mod n).
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
                className={`px-4 py-2 rounded-md ${
                  inputMode === "text" ? "bg-[#F244B5]" : "bg-gray-700"
                }`}
                onClick={() => {
                  setInputMode("text");
                  setFileContent("");
                }}
              >
                Text Input
              </Button>
              <Button
                className={`px-4 py-2 rounded-md ${
                  inputMode === "file" ? "bg-[#F244B5]" : "bg-gray-700"
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
                  onChange={handleFileChange}
                  className="bg-[#0B0C0D] file:text-pink-300 border-[#A6337E] "
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="">
                <Label htmlFor="keyA" className="block mb-2 text-pink-300">
                  m (must be coprime with the alphabet size)
                </Label>
                <Input
                  id="keyA"
                  type="number"
                  className="w-full p-2 mb-4 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                  value={keyA}
                  onChange={(e) => setKeyA(e.target.value)}
                />
              </div>

              <div className="">
                <Label htmlFor="keyB" className="block mb-2 text-pink-300">
                  b (magnitude of the shift)
                </Label>
                <Input
                  id="keyB"
                  type="number"
                  className="w-full p-2 mb-6 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                  value={keyB}
                  onChange={(e) => setKeyB(e.target.value)}
                />
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
          </div>

          <div>
            <Label htmlFor="result" className="block mb-2 text-pink-300">
              Result
            </Label>
            <Textarea
              id="result"
              readOnly
              className="w-full p-2 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
              value={result}
            ></Textarea>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AffineCipher;
