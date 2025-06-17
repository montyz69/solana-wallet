import "./seed.css";
import { generateMnemonic } from "bip39";
import { useState } from "react";
import { SolanaWallet } from "../gen-sol-wallete/App";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Seed() {
  const [mnemonic, setMnemonic] = useState("");
  const words = mnemonic ? mnemonic.split(" ") : [];

  function exportseed (){
    const element = document.createElement("a");
    const file = new Blob([mnemonic], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "seed.txt";
    document.body.appendChild(element); 
    element.click();
  };
  return (
    <div className="container">

      <Card>
  <CardHeader>
    <CardTitle>Manthan's Wallet</CardTitle>
    <CardDescription>Lets you Create a Solana Wallet</CardDescription>
  </CardHeader>
  <CardContent>
    <Button
        className="generate-btn"
        onClick={async () => {
          const mn = await generateMnemonic();
          setMnemonic(mn);
        }}
      >
        Create Seed Phrase
      </Button>
      <div className="mnemonic-grid">
        {words.map((word, index) => (
          <Button key={index} className="mnemonic-word">
            {word}
          </Button>
        ))}
      </div>
  </CardContent>
  <CardFooter>
    {
      mnemonic !== ""
        ? <Button onClick={exportseed}>Export Seed Phrase</Button> : null
    }
  </CardFooter>
</Card>
      <SolanaWallet mnemonic={mnemonic} />
    </div>
  );
}
