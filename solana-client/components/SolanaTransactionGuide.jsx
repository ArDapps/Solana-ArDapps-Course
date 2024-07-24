"use client";
import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const SolanaTransactionGuide = () => {
  const handleTransaction = async () => {
    const suppliedToPubkey = process.argv[2] || null;

    if (!suppliedToPubkey) {
      console.log(`Please provide a public key to send to`);
      process.exit(1);
    }

    const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
    console.log(`suppliedToPubkey: ${suppliedToPubkey}`);
    const toPubkey = new PublicKey(suppliedToPubkey);
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    console.log(
      `✅ Loaded our own keypair, the destination public key, and connected to Solana`
    );

    const transaction = new Transaction();
    const LAMPORTS_TO_SEND = 5000;

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey,
      lamports: LAMPORTS_TO_SEND,
    });

    transaction.add(sendSolInstruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderKeypair,
    ]);
    console.log(
      `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `
    );
    console.log(`Transaction signature is ${signature}!`);
  };

  return (
    <div>
      <Head>
        <title>Solana Transaction Guide</title>
      </Head>
      <header>
        <h1>Solana Transaction Guide</h1>
      </header>
      <main>
        <section>
          <h2>Summary</h2>
          <p>
            All modifications to onchain data happen through transactions...
          </p>
          {/* More content here */}
        </section>
        <section>
          <h2>Lesson</h2>
          <h3>Transactions are atomic</h3>
          <p>
            Any modification to onchain data happens through transactions sent
            to programs...
          </p>
          {/* More content here */}
        </section>
        <section>
          <h3>Transactions contain instructions</h3>
          <p>
            The steps within a transaction on Solana are called instructions...
          </p>
          {/* More content here */}
        </section>
        <section>
          <h3>Lab</h3>
          <p>We’re going to create a script to send SOL to other students...</p>
          <button onClick={handleTransaction}>Send SOL</button>
        </section>
        <section>
          <h3>Challenge</h3>
          <p>Answer the following questions...</p>
          {/* More content here */}
        </section>
      </main>
    </div>
  );
};

export default SolanaTransactionGuide;
