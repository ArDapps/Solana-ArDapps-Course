import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

export default function Home() {
  // const [publicKey, setPublickKey] = useState("");
  // const [privateKey, setPrivateKey] = useState("");

  // const generateWallet = () => {
  //   const keypair = Keypair.generate();

  //   setPublickKey(keypair.publicKey.toBase58());
  //   setPrivateKey(keypair.secretKey);

  //   console.log(`The public key is: `, keypair.publicKey);
  //   console.log(`The secret key is: `, keypair.secretKey);
  // };

  console.log(process.env.NEXT_PUBLIC_MY_PRIVATE_KEY);

  const getMyAccountFromPrivateKey = async () => {
    const keypair = await getKeypairFromEnvironment(
      process.env.NEXT_PUBLIC_MY_PRIVATE_KEY
    );
    console.log(keypair);
  };

  getMyAccountFromPrivateKey();
  return (
    <main>
      <p className="bg-red-600 text-white text-3xl p-4 m-4">
        Welcome To Solana Course
      </p>
      {/* <p className="p-3 m-3  text-2xl">Wallet Publick Key: {publicKey}</p> */}
      {/* <button
        className="bg-black p-3 m-3 text-white rounded"
        onClick={generateWallet}
      >
        Generate Wallet
      </button> */}
      {/* <button
        className="bg-red-600 p-3 m-3 text-white rounded"
        onClick={getMyAccountFromPrivateKey}
      >
        MY Wallet
      </button> */}
    </main>
  );
}
