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

const SuperEncryption = () => {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [inputText, setInputText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [keySubstitution, setKeySubsitution] = useState("");
  const [keyTransposition, setKeyTransposition] = useState(0);
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
      const response = await fetch(`/api/super-encryption/encrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          text: currentInputText,
          keySubstitution: keySubstitution,
          keyTransposition: keyTransposition,
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
      const response = await fetch(`/api/super-encryption/decrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          text: currentInputText,
          keySubstitution: keySubstitution,
          keyTransposition: keyTransposition,
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
            Super Encryption
          </h1>
        </div>
        <p className="text-lg mb-6">
          Super Encryption combines the substitution cipher (Extended Vigenère
          Cipher) and the transposition cipher to enhance security. It&apos;s also
          known as a product cipher. Initially, the message is encrypted with a
          substitution cipher, followed by encryption with a transposition
          cipher or vice versa.
        </p>
        <div className="flex flex-col md:flex-row md:gap-8 gap-2">
          {/* Key Information */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6 flex-1">
            <h2 className="text-xl text-[#F244B5] mb-4">
              Encryption & Decryption Process
            </h2>
            <p className="italic">Encryption process:</p>
            <p className="italic ">1st Step (Substitution Cipher)</p>
            <p className="italic mb-2">2nd Step (Transposition Cipher)</p>
            <p className="italic mb-2">
              Decryption is the reverse process: Apply the inverse transposition
              first, then the inverse substitution, using the same keys to
              retrieve the original plaintext.
            </p>
          </div>

          {/* Detailed Explanation */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6 flex-1">
            <h3 className="text-xl text-[#F244B5] mb-4">Details</h3>
            <ul className="list-disc list-inside">
              <li>
                <strong>Key (for substitution)</strong> is the string key.
              </li>
              <li>
                <strong>k (for transposition)</strong> is an integer that is
                long for permutation
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col p-4 rounded-3xl bg-gray-800">
          <div className="py-2">
            <Label
              htmlFor="keySubstitution"
              className="block mb-2 text-pink-300"
            >
              Input Type
            </Label>
            <div className="flex gap-4 pb-2">
              <Button
                className={`px-4 py-2 rounded-md ${inputMode === "text" ? "bg-[#F244B5]" : "bg-gray-700"
                  }`}
                onClick={() => {
                  setInputMode("text");
                  setFileContent("");
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
                  onChange={handleFileChange}
                  className="bg-[#0B0C0D] file:text-pink-300 border-[#A6337E] "
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Label
                  htmlFor="keySubstitution"
                  className="block mb-2 text-pink-300"
                >
                  key (substitution)
                </Label>
                <Input
                  id="keySubstitution"
                  type="text"
                  className=" p-2 mb-4 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                  value={keySubstitution}
                  onChange={(e) => setKeySubsitution(e.target.value)}
                />
              </div>

              <div className="">
                <Label
                  htmlFor="keyTransposition"
                  className="block mb-2 text-pink-300"
                >
                  k (transposition)
                </Label>
                <Input
                  id="keyTransposition"
                  type="number"
                  className=" p-2 mb-6 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
                  value={keyTransposition}
                  onChange={(e) => setKeyTransposition(Number(e.target.value))}
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
                  onCheckedChange={(newCheckedValue) => {
                    setIsDecode(newCheckedValue);
                    setResult(""); // This will reset the result every time the switch is toggled
                  }}
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
    </main>
  );
};

export default SuperEncryption;
