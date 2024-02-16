"use client";

import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const AffineCipher = () => {
  const [inputText, setInputText] = useState("");
  const [keyA, setKeyA] = useState("");
  const [keyB, setKeyB] = useState("");
  const [result, setResult] = useState("");
  const router = useRouter();
  const [isDecode, setIsDecode] = useState(false);

  const handleRun = async () => {
    console.log(inputText);
    console.log(keyA);
    console.log(keyB);
    console.log("decode =", isDecode);
    if (isDecode) {
      await handleDecode();
    } else {
      console.log("MASUK");
      await handleEncode();
    }
  };

  // Handler to encode or decode the input text
  const handleEncode = async () => {
    // Use the encode API route
    try {
      console.log("MASUK 1");
      console.log(inputText, keyA, keyB);
      const response = await fetch(`/api/affine-cipher/encrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          text: inputText,
          keyA: parseInt(keyA),
          keyB: parseInt(keyB),
        }),
      });
      const data = await response.json();
      console.log("data =", data.data);
      if (response.ok) {
        setResult(data.data);
      } else {
        // Handle errors
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDecode = async () => {
    // Use the decode API route
    try {
      console.log("SINI");
      const response = await fetch(`/api/affine-cipher/decrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          text: inputText,
          keyA: parseInt(keyA),
          keyB: parseInt(keyB),
        }),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setResult(data.data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0C0D] text-[#D9D6D0] p-8">
      <div className="">
        <h1 className="text-4xl text-[#F244B5] font-bold mb-6">
          Affine Cipher
        </h1>
        <p className="py-2">
          The Affine cipher is a type of monoalphabetic substitution cipher,
          where each letter in an alphabet is mapped to its numeric equivalent,
          encrypted using a simple mathematical function, and then converted
          back to a letter. The formula used means that each letter encrypts to
          exactly one other letter, and back again, meaning the cipher is
          reversible.
        </p>
        <p className="py-2">
          It uses modular arithmetic to transform the integer that each
          plaintext letter corresponds to into another integer that correspond
          to a ciphertext letter. The encryption function for a single letter
          is:
        </p>
        <p className="py-2 italic">E(x) = (ax + b) mod m</p>
        <p className="py-2">
          where 'b' is the magnitude of the shift, 'a' and 'm' are coprime, and
          'm' is the size of the alphabet.
        </p>
        <div className="flex flex-col p-4 rounded-3xl bg-gray-800">
          <div className="py-2">
            <Label htmlFor="inputText" className="block mb-2 text-pink-300">
              Text
            </Label>
            <Textarea
              id="inputText"
              className="w-full p-2 mb-4 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></Textarea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="">
                <Label htmlFor="keyA" className="block mb-2 text-pink-300">
                  Key A (must be coprime with the alphabet size)
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
                  Key B (magnitude of the shift)
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
            <div className="flex gap-4 items-center justify-center">
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
            <div className="w-full flex justify-center items-center py-2">
              <Button
                className="px-4 py-2 bg-[#F24BC6] hover:bg-[#F244B5] rounded-md "
                onClick={handleRun}
              >
                Run
              </Button>
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
