"use client";

import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import "@solana/wallet-adapter-react-ui/styles.css"; // Import default styles

const CreateToken = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [decimals, setDecimals] = useState("");

  const onClick = useCallback(
    async (form) => {
      if (!publicKey) {
        alert("Please connect your wallet first");
        return;
      }

      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const mintKeypair = Keypair.generate();
      const tokenATA = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey
      );

      const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports: lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          form.decimals,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
          publicKey,
          tokenATA,
          publicKey,
          mintKeypair.publicKey
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          tokenATA,
          publicKey,
          form.amount * Math.pow(10, form.decimals)
        )
      );

      await sendTransaction(createNewTokenTransaction, connection, {
        signers: [mintKeypair],
      });

      // Save the token metadata (name and symbol) off-chain, e.g., in your database or another storage solution
      console.log(
        "Token created with name:",
        form.tokenName,
        "and symbol:",
        form.symbol
      );
    },
    [publicKey, connection, sendTransaction]
  );

  return (
    <div className="container mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Token</h1>

      {!connected && (
        <div className="mb-6 text-center">
          <WalletMultiButton className="btn btn-primary" />
        </div>
      )}

      {connected && (
        <div>
          <input
            type="text"
            className="form-control block mb-4 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Token Name"
            onChange={(e) => setTokenName(e.target.value)}
          />
          <input
            type="text"
            className="form-control block mb-4 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Symbol"
            onChange={(e) => setSymbol(e.target.value)}
          />
          <input
            type="number"
            className="form-control block mb-4 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="number"
            className="form-control block mb-4 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Decimals"
            onChange={(e) => setDecimals(e.target.value)}
          />

          <button
            className="w-full py-2 px-4 text-white bg-gradient-to-r from-purple-600 to-green-400 rounded hover:from-pink-500 hover:to-yellow-500 transition ease-in-out"
            onClick={() =>
              onClick({
                decimals: Number(decimals),
                amount: Number(amount),
                tokenName: tokenName,
                symbol: symbol,
              })
            }
          >
            <span>Create Token</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateToken;
