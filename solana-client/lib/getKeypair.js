import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export const getKeypairFromSecretKey = () => {
  const secretKeyString =
    "4o5769KKBVgPaBvebQgxsXjBzTGeVeLYgxXDsJBrVdyjyyyC3ffV9HgCxL29612912AepwQZsADv93oAmZiQA2wa";

  console.log(secretKeyString, "secretKeyString");
  if (!secretKeyString) {
    throw new Error("MY_PRIVATE_KEY environment variable not set");
  }
  const secretKey = bs58.decode(secretKeyString);
  return Keypair.fromSecretKey(secretKey);
};
