import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal"
import { useState, useEffect, useRef } from 'react'
import { providers } from "ethers"
import Core from 'web3modal'



const Home: NextPage = () => {
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const web3modalRef = useRef<null | Core>(null);

  const [ens, setEns] = useState("");
  const [address, setAddress] = useState("")

  const setENSOrAddress = async (address: string, web3Provider: any) => {
    var _ens = await web3Provider.lookupAddress(address);
    if (_ens) setEns(_ens)
    else setAddress(address);
  }

  const getProviderOrSigner = async () => {
    if (web3modalRef.current) {
      const provider = await (web3modalRef.current as any).connect();
      const web3Provider = new providers.Web3Provider(provider)

      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 4) {
        window.alert('Change the network to Rinkeby testnet');
        throw new Error("Change the network to Rinkeby")
      }
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      await setENSOrAddress(address, web3Provider)

      // returning the signer, it should have an address.
      return signer;
    }
  }

  const connectWallet = async () => {
    try {
      const signer =await getProviderOrSigner();
      console.log(signer);
      setWalletConnected(true)
    }
    catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      return <div>Wallet Connected</div>
    }
    return <button onClick={connectWallet} className={styles.button}>
      Connect your Wallet
    </button>
  }

  useEffect(() => {

    if (!walletConnected) {
      web3modalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
      })

      connectWallet();
    }

  }, [walletConnected])


  return (

    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by LearnWeb3 Punks
      </footer>
    </div>
  )
}

export default Home
