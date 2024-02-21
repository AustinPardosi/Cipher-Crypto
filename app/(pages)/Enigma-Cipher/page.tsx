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

const EnigmaCipher = () => {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [inputText, setInputText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [keySubsitution, setKeyA] = useState("");
  const [keyTransposition, setKeyB] = useState("");
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
    // try {
    //   const response = await fetch(`/api/affine-cipher/encrypt`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json; charset=UTF-8",
    //     },
    //     body: JSON.stringify({
    //       text: currentInputText,
    //       keySubsitution: parseInt(keySubsitution),
    //       keyTransposition: parseInt(keyTransposition),
    //     }),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     setResult(data.data);
    //   } else {
    //     // Handle errors
    //     toast({
    //       variant: "destructive",
    //       title: data.error,
    //     });
    //   }
    // } catch (error) {
    //   toast({
    //     variant: "destructive",
    //     title: String(error),
    //   });
    // }
  };

  const handleDecode = async (currentInputText: String) => {
    // Use the decode API route
    // try {
    //   const response = await fetch(`/api/affine-cipher/decrypt`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json; charset=UTF-8",
    //     },
    //     body: JSON.stringify({
    //       text: currentInputText,
    //       keySubsitution: parseInt(keySubsitution),
    //       keyTransposition: parseInt(keyTransposition),
    //     }),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     setResult(data.data);
    //   } else {
    //     toast({
    //       variant: "destructive",
    //       title: data.error,
    //     });
    //   }
    // } catch (error) {
    //   toast({
    //     variant: "destructive",
    //     title: String(error),
    //   });
    // }
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
            Enigma Cipher
          </h1>
        </div>
        <p className="text-lg mb-6">
          The Enigma cipher is an electro-mechanical rotor cipher machine used
          during World War II for the encryption and decryption of secret
          messages. It does not simply rely on a monoalphabetic substitution
          cipher but employs a complex system of rotors, a plugboard, and a
          reflector to achieve an exceptionally high level of encryption
          security. Each key press advances the rotor, changing the encryption
          alphabet, which makes the cipher polyalphabetic.
        </p>

        <div className="flex flex-col md:flex-row md:gap-8 gap-2">
          {/* Key Information */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6 flex-1">
            <h2 className="text-xl text-[#F244B5] mb-4">
              Encryption & Decryption Process
            </h2>
            <p className="italic">
              The Enigma encryption and decryption involve several key
              components:
            </p>
            <ol className="list-decimal text-md list-inside">
              <li>Input through a keyboard.</li>
              <li>
                Signal passed through the plugboard (Steckerbrett) where wires
                may swap pairs of letters.
              </li>
              <li>
                Signal enters the rotor assembly and passes through each of the
                three rotors in sequence.
              </li>
              <li>
                The signal is reflected back by the reflector (Umkehrwalze),
                then it passes through the rotors again in reverse order.
              </li>
              <li>Signal goes through the plugboard again.</li>
              <li>Output shown on the lampboard.</li>
            </ol>
            <p className="italic">
              Decryption follows the same path in reverse, with the Enigma
              machine set to the same initial configuration used for encryption.
            </p>
          </div>

          {/* Detailed Explanation */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6 flex-1">
            <h3 className="text-xl text-[#F244B5] mb-4">Component Details</h3>
            <ul className="text-md list-disc list-inside">
              <li>
                <strong>Rotors:</strong> The heart of the Enigma machine, each
                rotor scrambles the 26 letters of the alphabet. As a key is
                pressed, the rightmost rotor moves one position, changing the
                electrical pathway and thus the substitution alphabet.
              </li>
              <li>
                <strong>Plugboard (Steckerbrett):</strong> Allows for the manual
                swapping of letters before and after the rotors process the
                signal, increasing the cipher's complexity.
              </li>
              <li>
                <strong>Reflector (Umkehrwalze):</strong> Causes the signal to
                be reversed back through the rotors, ensuring that the machine
                can both encrypt and decrypt using the same settings.
              </li>
            </ul>
            <p>
              The combination of these elements, along with the daily-changing
              rotor starting positions (the day key), made the Enigma cipher
              remarkably secure for its time.
            </p>
          </div>
        </div>

        <div className="flex flex-col p-4 rounded-3xl bg-gray-800">
          <div className="py-2">
            <Label
              htmlFor="keySubsitution"
              className="block mb-2 text-pink-300"
            >
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
            <div className="flex flex-col space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="">
                  <Label
                    htmlFor="keySubsitution"
                    className="block mb-2 text-pink-300"
                  >
                    Rotor 1
                  </Label>
                  <p>EKMFLGDQVZNTOWYHXUSPAIBRCJ</p>
                </div>

                <div className="">
                  <Label
                    htmlFor="keyTransposition"
                    className="block mb-2 text-pink-300"
                  >
                    Order
                  </Label>
                  <Input
                    id="keyTransposition"
                    type="number"
                    className=" p-2 mb-6 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                    value={keyTransposition}
                    onChange={(e) => setKeyB(e.target.value)}
                  />
                </div>

                <div className="">
                  <Label
                    htmlFor="keyTransposition"
                    className="block mb-2 text-pink-300"
                  >
                    Initialize Position
                  </Label>
                  <Input
                    id="keyTransposition"
                    type="number"
                    className=" p-2 mb-6 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                    value={keyTransposition}
                    onChange={(e) => setKeyB(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="">
                  <Label
                    htmlFor="keySubsitution"
                    className="block mb-2 text-pink-300"
                  >
                    Rotor 2
                  </Label>
                  <p>EKMFLGDQVZNTOWYHXUSPAIBRCJ</p>
                </div>

                <div className="">
                  <Label
                    htmlFor="keyTransposition"
                    className="block mb-2 text-pink-300"
                  >
                    Order
                  </Label>
                  <Input
                    id="keyTransposition"
                    type="number"
                    className=" p-2 mb-6 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                    value={keyTransposition}
                    onChange={(e) => setKeyB(e.target.value)}
                  />
                </div>

                <div className="">
                  <Label
                    htmlFor="keyTransposition"
                    className="block mb-2 text-pink-300"
                  >
                    Initialize Position
                  </Label>
                  <Input
                    id="keyTransposition"
                    type="number"
                    className=" p-2 mb-6 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                    value={keyTransposition}
                    onChange={(e) => setKeyB(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="">
                  <Label
                    htmlFor="keySubsitution"
                    className="block mb-2 text-pink-300"
                  >
                    Rotor 3
                  </Label>
                  <p>EKMFLGDQVZNTOWYHXUSPAIBRCJ</p>
                </div>

                <div className="">
                  <Label
                    htmlFor="keyTransposition"
                    className="block mb-2 text-pink-300"
                  >
                    Order
                  </Label>
                  <Input
                    id="keyTransposition"
                    type="number"
                    className=" p-2 mb-6 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                    value={keyTransposition}
                    onChange={(e) => setKeyB(e.target.value)}
                  />
                </div>

                <div className="">
                  <Label
                    htmlFor="keyTransposition"
                    className="block mb-2 text-pink-300"
                  >
                    Initialize Position
                  </Label>
                  <Input
                    id="keyTransposition"
                    type="number"
                    className=" p-2 mb-6 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                    value={keyTransposition}
                    onChange={(e) => setKeyB(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Label htmlFor="keySubsitution" className="block text-pink-300">
                Reflektor
              </Label>
              <p>EKMFLGDQVZNTOWYHXUSPAIBRCJ</p>
            </div>
            <div className="flex gap-4 items-center">
              <Label htmlFor="keySubsitution" className="block text-pink-300">
                Plugboard
              </Label>
              <Input
                id="keyTransposition"
                type="text"
                className=" p-2 mb-6 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                value={keyTransposition}
                onChange={(e) => setKeyB(e.target.value)}
              />
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

export default EnigmaCipher;
