import React, { useState, useEffect } from "react";
import AuctionList from "../AuctionList/AuctionList.js";
import CreateAuctionModal from "../CreateAuctionModal/CreateAuctionModal.js";
import Web3 from "web3";
import "./Main.css";

const auctionFactoryAddress = "0x2aBC2B248cB67f4b45B4793e770B00E048e4982d";

const Main = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        window.ethereum.on("accountsChanged", (newAccounts) => {
          setAccount(newAccounts[0]);
        });
      } else {
        console.log("MetaMask nije instaliran.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask: ", error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    } else {
      console.log("MetaMask nije instaliran.");
    }
  }, []);

  return (
    <div className="main-container">
      {!account && (
        <button className="connect-wallet-button" onClick={connectWallet}>
          Poveži se sa MetaMaskom
        </button>
      )}

      <AuctionList
        className="auction-list"
        web3={web3}
        account={account}
        auctionFactoryAddress={auctionFactoryAddress}
      />

      <button
        className="create-auction-button"
        onClick={() => setShowCreateModal(true)}
      >
        Napravi Aukciju
      </button>

      {showCreateModal && (
        <CreateAuctionModal
          className="create-auction-modal"
          web3={web3}
          account={account}
          onClose={() => setShowCreateModal(false)}
          auctionFactoryAddress={auctionFactoryAddress}
        />
      )}
    </div>
  );
};

export default Main;
