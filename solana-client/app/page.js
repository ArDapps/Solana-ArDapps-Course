import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import React from "react";

const Home = () => {
  const userAddress = "dv4ACNkpYPcE3aKmYDqZm9G5EB3J4MRoeE7WNDRBVJB";
  const connection = new Connection(clusterApiUrl("devnet"));
  //const connection = new Connection(clusterApiUrl("mainnet-beta"));

  console.log(connection);

  const getBalance = async () => {
    const address = new PublicKey(userAddress);

    const balance = await connection.getBalance(address);

    const convertINSOl = balance / LAMPORTS_PER_SOL;

    console.log("=========>LAM===>", balance);
    console.log("=========>SOL===>", convertINSOl);
  };

  getBalance();

  return <div>Home Page</div>;
};

export default Home;
