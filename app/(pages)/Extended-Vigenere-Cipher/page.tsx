"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Wallpaper, FileCheck2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

const ExtendedVigenereCipher = () => {
  const [inputMode, setInputMode] = useState("text");
  const [inputText, setInputText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [key, setKey] = useState("");
  const { toast } = useToast();
  const [isDecode, setIsDecode] = useState(false);
  const [result, setResult] = useState("");

  const StringtoBase64 = (text: string) => {
    return Buffer.from(text).toString('base64');
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const target = e.target as FileReader;
        const content = target.result;
        setFileContent(content?.toString() || "");
        setFileExtension(file.name.split(".").pop());
      };
      reader.readAsText(file);
    }
  };

  const handleRun = async () => {
    const inputContent = inputMode === "text" ? inputText : fileContent;

    if (isDecode) {
      await handleDecrypt(inputContent);
    } else {
      await handleEncrypt(inputContent);
    }
  };

  const handleEncrypt = async (inputContent: String) => {
    try {
      const respone = await fetch("/api/extended-vigenere/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ text: inputContent, key: key }),
      });

      const data = await respone.json();
      if (respone.ok) {
        setResult(StringtoBase64(data.data));
        setFileSize(new Blob([data.data]).size);
        console.log(data.data);

      } else {
        toast({ variant: "destructive", title: data.error });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ variant: "destructive", title: String(error) });
    }
  };

  const handleDecrypt = async (inputContent: String) => {
    try {
      const respone = await fetch("/api/extended-vigenere/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ text: inputContent, key: key }),
      });

      const data = await respone.json();
      if (respone.ok) {

        setResult(StringtoBase64(data.data));
        setFileSize(new Blob([data.data]).size);
        console.log(data.data);

      } else {
        toast({ variant: "destructive", title: data.error });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ variant: "destructive", title: String(error) });
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
    element.download = `result.${inputMode === "text" ? "txt" : fileExtension}`;
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
            Vigenère Cipher (Extended)
          </h1>
        </div>

        {/* Description of Algorithm */}
        <p className="text-lg mb-6">
          The Vigenère (Extended) cipher is a method of encrypting alphabetic
          text by using a simple form of polyalphabetic substitution. A
          polyalphabetic cipher uses multiple substitution alphabets to encrypt
          the data. The key and text for this encrypting method is table of alphabets [256].
        </p>
        <p className="text-lg mb-6">
          This encryption is accept all printable ASCII characters.
        </p>

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

            <div className="flex flex-col">
              <Label htmlFor="key" className="mb-2 text-pink-300">
                Key
              </Label>
              <Input
                id="key"
                type="text"
                placeholder="Enter key here"
                onChange={(e) => setKey(e.target.value)}
                className="w-full p-2 bg-[#0B0C0D] border border-[#A6337E] rounded-md"
              />
            </div>

            <div className="grid grid-cols-3 items-center w-full px-1 py-3">
              <div className="col-span-1 flex gap-4 justify-start items-center">
                <p
                  className={
                    !isDecode ? "text-pink-400 font-bold" : "text-gray-400"
                  }
                >
                  Encrypt
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
                  Decrypt
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
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="result" className="block mb-2 text-pink-300">
              Result
            </Label>
            {inputMode === "text" ? (
              <div>
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
                    Download as txt ({fileSize} bytes)
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <FileCheck2 className="h-24 w-24 text-[#F244B5]" />
                <Button
                  className="px-8 py-2 bg-[#F24BC6] hover:bg-[#F244B5] rounded-md"
                  onClick={handleDownloadResult}
                >
                  Download as {fileExtension} file ({fileSize} bytes)
                </Button>
              </div> 
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExtendedVigenereCipher;
