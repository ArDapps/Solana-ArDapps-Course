"use client";
import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import {
  createCreateMetadataAccountV2Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { getKeypairFromSecretKey } from "../../lib/getKeypair";

const SolanaTokenGuide = () => {
  const [tokenMint, setTokenMint] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const [transactionSignature, setTransactionSignature] = useState("");
  const [message, setMessage] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  const isValidPublicKey = (key) => {
    try {
      new PublicKey(key);
      return true;
    } catch (error) {
      return false;
    }
  };

  const createTokenMint = async () => {
    setMessage("Creating token mint...");
    console.log("Creating token mint...");
    const connection = new Connection(clusterApiUrl("devnet"));
    const user = getKeypairFromSecretKey();

    try {
      const mint = await createMint(
        connection,
        user,
        user.publicKey,
        null,
        2 // Token with 2 decimal places
      );

      const mintPublicKey = mint.toBase58();
      setTokenMint(mintPublicKey);

      // Create token metadata
      const metadataAccount = await createTokenMetadata(
        connection,
        user,
        mintPublicKey,
        tokenName,
        tokenSymbol
      );

      setMessage(`Token Mint Created: ${mintPublicKey}`);
      console.log(`Token Mint Created: ${mintPublicKey}`);
      console.log(`Metadata Account: ${metadataAccount}`);
    } catch (error) {
      setMessage("Error creating token mint.");
      console.error("Error creating token mint:", error);
    }
  };

  const createTokenMetadata = async (connection, payer, mint, name, symbol) => {
    const metadataPDA = (
      await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          new PublicKey(mint).toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];

    const transaction = new Transaction().add(
      createCreateMetadataAccountV2Instruction(
        {
          metadata: metadataPDA,
          mint: new PublicKey(mint),
          mintAuthority: payer.publicKey,
          payer: payer.publicKey,
          updateAuthority: payer.publicKey,
        },
        {
          createMetadataAccountArgsV2: {
            data: {
              name,
              symbol,
              uri: "", // Add the URI for token metadata if you have one
              sellerFeeBasisPoints: 0,
              creators: null,
              collection: null,
              uses: null,
            },
            isMutable: true,
          },
        }
      )
    );

    await sendAndConfirmTransaction(connection, transaction, [payer]);

    return metadataPDA.toBase58();
  };

  const createTokenAccount = async () => {
    if (!tokenMint) {
      setMessage("Please create a token mint first.");
      console.error("Token mint not created yet.");
      return;
    }

    setMessage("Creating token account...");
    console.log("Creating token account...");
    const connection = new Connection(clusterApiUrl("devnet"));
    const user = getKeypairFromSecretKey();

    try {
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        user,
        new PublicKey(tokenMint),
        user.publicKey
      );
      setTokenAccount(tokenAccount.address.toBase58());
      setMessage(`Token Account Created: ${tokenAccount.address.toBase58()}`);
      console.log(`Token Account Created: ${tokenAccount.address.toBase58()}`);
    } catch (error) {
      setMessage("Error creating token account.");
      console.error("Error creating token account:", error);
    }
  };

  const mintTokens = async () => {
    if (!tokenMint || !tokenAccount) {
      setMessage("Please create a token mint and token account first.");
      console.error("Token mint or token account not created yet.");
      return;
    }

    if (!isValidPublicKey(tokenMint) || !isValidPublicKey(tokenAccount)) {
      setMessage("Invalid token mint or token account public key.");
      console.error("Invalid token mint or token account public key.");
      return;
    }

    setMessage("Minting tokens...");
    console.log("Minting tokens...");
    const connection = new Connection(clusterApiUrl("devnet"));
    const user = getKeypairFromSecretKey();

    try {
      const amount = 10 * Math.pow(10, 2); // Minting 10 tokens with 2 decimal places precision
      const transactionSignature = await mintTo(
        connection,
        user,
        new PublicKey(tokenMint),
        new PublicKey(tokenAccount),
        user,
        amount
      );
      setTransactionSignature(transactionSignature);
      setMessage(
        `Tokens Minted! Transaction Signature: ${transactionSignature}`
      );
      console.log(
        `Tokens Minted! Transaction Signature: ${transactionSignature}`
      );
    } catch (error) {
      setMessage("Error minting tokens.");
      console.error("Error minting tokens:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 m-4">
      <h1 className="text-3xl font-bold mb-4">Solana Token Guide</h1>
      <section className="mb-4">
        <h2 className="text-2xl font-semibold">Summary</h2>
        <p>All modifications to onchain data happen through transactions...</p>
      </section>
      <section className="mb-4">
        <h2 className="text-2xl font-semibold">Lesson</h2>
        <h3 className="text-xl font-medium">Creating Token Mint</h3>
        <input
          type="text"
          placeholder="Token Name"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Token Symbol"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={createTokenMint}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 transition"
        >
          Create Token Mint
        </button>
        {tokenMint && <p>Token Mint Created: {tokenMint}</p>}
      </section>
      <section className="mb-4">
        <h3 className="text-xl font-medium">Creating Token Account</h3>
        <button
          onClick={createTokenAccount}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition"
        >
          Create Token Account
        </button>
        {tokenAccount && <p>Token Account Created: {tokenAccount}</p>}
      </section>
      <section className="mb-4">
        <h3 className="text-xl font-medium">Mint Tokens</h3>
        <button
          onClick={mintTokens}
          className="bg-purple-500 text-white px-4 py-2 rounded mt-2 hover:bg-purple-700 transition"
        >
          Mint Tokens
        </button>
        {transactionSignature && (
          <p>Transaction Signature: {transactionSignature}</p>
        )}
      </section>
      {message && (
        <section className="mb-4">
          <h3 className="text-xl font-medium">Status</h3>
          <p>{message}</p>
        </section>
      )}
    </div>
  );
};

export default SolanaTokenGuide;
