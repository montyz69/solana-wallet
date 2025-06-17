import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import axios from "axios";
import { Button } from "@/components/ui/button";
import "./App.css";
export function SolanaWallet({ mnemonic }: { mnemonic: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [accountInfo, setAccountInfo] = useState<Record<string, any>>({});

  const handleAddWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      const pubkeyStr = keypair.publicKey.toBase58();

      setCurrentIndex((prev) => prev + 1);
      setPublicKeys((prev) => [...prev, pubkeyStr]);
    } catch (error) {
      console.error("Error deriving wallet:", error);
    }
  };

  const handleFetchBalance = async (pubkey: string) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_VERCEL_ENV_FETCHBALANCE,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [pubkey],
        }
      );

      const lamports = response.data.result?.value || 0;
      setBalances((prev) => ({ ...prev, [pubkey]: lamports / 1e9 }));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleFetchAccountInfo = async (pubkey: string) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_VERCEL_ENV_FETCHINFO,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "getAccountInfo",
          params: [pubkey],
        }
      );

      const info = response.data.result;
      setAccountInfo((prev) => ({ ...prev, [pubkey]: info }));
    } catch (error) {
      console.error("Error fetching account info:", error);
    }
  };

  return (
    <div>
      {mnemonic == "" ? null : (
        <Button
          style={{ margin: "10px" }}
          onClick={handleAddWallet}
          className="add-wallet-btn"
        >
          Add Wallet
        </Button>
      )}

      {publicKeys.map((pubkey) => (
        <div
          key={pubkey}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <div>
            <strong>Public Key:</strong> {pubkey}
          </div>

          <Button
            style={{ margin: "10px" }}
            onClick={() => handleFetchBalance(pubkey)}
          >
            Get Balance
          </Button>
          {balances[pubkey] !== undefined && (
            <div>
              <strong>Balance:</strong> {balances[pubkey]} SOL
            </div>
          )}

          <Button
            style={{ margin: "10px" }}
            onClick={() => handleFetchAccountInfo(pubkey)}
          >
            Get Account Info
          </Button>
          {accountInfo[pubkey] && (
            <div style={{ whiteSpace: "pre-wrap", fontSize: "small" }}>
              <strong>Account Info:</strong>{" "}
              {JSON.stringify(accountInfo[pubkey], null, 2)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
