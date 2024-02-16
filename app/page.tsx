import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image
        src={"/image/bg-image.jpg"}
        alt="background image"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <div className="z-10 flex flex-col items-center p-4">
        <h1
          className="text-7xl font-bold text-[#D9D6D0]"
          style={{ textShadow: "2px 2px 4px #7e57c2" }}
        >
          CIPHER CRYPTO
        </h1>
        <h2 className="text-xl text-[#D9D6D0] ">
          Embark on a journey to master the art of secrecy
        </h2>
        <div className="flex flex-wrap justify-center items-center overflow-y-auto w-7/8 py-12 gap-4">
          <Link href="/Vigenere-Cipher-Standard">
            <Button
              variant="outline"
              className="bg-transparent border-2 text-[#D9D6D0] border-[#D9D6D0] hover:bg-[#F24BC6] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              Vigenere Cipher Standard
            </Button>
          </Link>
          <Link href="/Auto-Key-Vigenere-Cipher">
            <Button
              variant="outline"
              className="bg-transparent border-2 text-[#D9D6D0] border-[#D9D6D0] hover:bg-[#F24BC6] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              Auto-Key Vigenere Cipher
            </Button>
          </Link>
          <Link href="/Extended-Vigenere-Cipher">
            <Button
              variant="outline"
              className="bg-transparent border-2 text-[#D9D6D0] border-[#D9D6D0] hover:bg-[#F24BC6] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              Extended Vigenere Cipher
            </Button>
          </Link>
          <Link href="/Playfair-Cipher">
            <Button
              variant="outline"
              className="bg-transparent border-2 text-[#D9D6D0] border-[#D9D6D0] hover:bg-[#F24BC6] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              Playfair Cipher
            </Button>
          </Link>
          <Link href="/Affine-Cipher">
            <Button
              variant="outline"
              className="bg-transparent border-2 text-[#D9D6D0] border-[#D9D6D0] hover:bg-[#F24BC6] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              Affine Cipher
            </Button>
          </Link>
          <Link href="/Hill-Cipher">
            <Button
              variant="outline"
              className="bg-transparent border-2 text-[#D9D6D0] border-[#D9D6D0] hover:bg-[#F24BC6] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              Hill Cipher
            </Button>
          </Link>
          <Link href="/Super-Encryption">
            <Button
              variant="outline"
              className="bg-transparent border-2 text-[#D9D6D0] border-[#D9D6D0] hover:bg-[#F24BC6] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              Super Encryption (Extended Vigenere Cipher + Cipher Transposition)
            </Button>
          </Link>
          <Link href="/Enigma-Cipher">
            <Button
              variant="outline"
              className="bg-transparent border-2 text-[#D9D6D0] border-[#D9D6D0] hover:bg-[#F24BC6] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              Enigma Cipher
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
