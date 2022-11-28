import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center w-screen h-screen relative">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="items-center h-screen max-w-4xl justify-start flex bg-[#0090CD] flex-col">
        <div className="z-10 h-screen max-w-4xl absolute top-0 left-0"></div>
        <div className="z-10 h-screen max-w-4xl absolute top-0 right-0"></div>
        <div className="z-0 rounded-full h-[360px] w-[360px] bg-[#87D2EC] absolute -top-24 left-[340px]"></div>
        <div className="z-0 rounded-full h-[360px] w-[360px] bg-[#87D2EC] absolute top-1/4 right-[300px]"></div>
        <div className="z-0 rounded-full h-[360px] w-[360px] bg-[#87D2EC] absolute -bottom-24 left-[330px]"></div>
        <h1 className="z-10 text-[#0009DC] mt-24" style={{ fontSize: 57 }}>
          ASTAR SNS
        </h1>
        <div className="flex-row flex items-center mb-11 mt-7">
          <Image
            className="z-10 w-24 h-24"
            src="/unchain_logo.png"
            alt="unchain_logo"
            width={30}
            height={30}
          />
          <Image
            className="w-10 h-7"
            src="/cross_mark_2_logo-removebg.png"
            alt="cross_logo"
            width={30}
            height={30}
          />
          <Image
            className="z-10 w-24 h-24"
            src="/Astar_logo.png"
            alt="astar_logo"
            width={30}
            height={30}
          />
        </div>
        <div className="z-10 mt-16 mb-16 text-3xl items-center flex flex-col text-[#0009DC]">
          <div>SHARE YOUR</div>
          <div>WONDERFUL DAILY LIFE</div>
          <div>ON ASTAR</div>
        </div>
        <button
          className="z-10 text-3xl text-white items-center flex justify-center h-20 w-72 bg-[#003AD0] hover:bg-blue-700  py-2 px-4 rounded-full"
          onClick={() => {
            router.push("home");
          }}
        >
          Connect Wallet
        </button>

        <Image
          className="rotate-[17deg] h-14 w-16 top-16 left-[530px] absolute "
          src="/cross_star_6_logo-removebg.png"
          alt="astar_logo"
          width={40}
          height={40}
        />
        <Image
          className="rotate-[40deg] h-10 w-10 top-8 right-1/3 absolute "
          src="/cross_star_6_logo-removebg.png"
          alt="astar_logo"
          width={35}
          height={30}
        />
        <Image
          className="rotate-[35deg] h-15 w-16 bottom-16 left-1/3 absolute "
          src="/cross_star_6_logo-removebg.png"
          alt="astar_logo"
          width={40}
          height={40}
        />
        <Image
          className="rotate-[35deg] h-24 w-24 fill-black bottom-80 left-1/3 absolute "
          src="/cross_star_2_logo-removebg.png"
          alt="astar_logo"
          width={100}
          height={200}
        />
        <Image
          className="rotate-[25deg] h-24 w-24 fill-black bottom-48 right-1/3 absolute "
          src="/cross_star_2_logo-removebg.png"
          alt="astar_logo"
          width={100}
          height={200}
        />
      </main>
    </div>
  );
};

export default Home;
