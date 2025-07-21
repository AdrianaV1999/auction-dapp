import React, { useEffect, useState } from "react";
import Web3 from "web3";
import AuctionFactoryABI from "../../contracts/AuctionFactory.json";
import BidHistory from "../BidHistory/BidHistory";
import "./BidHistory.css";

const auctionFactoryAddress = "0x2aBC2B248cB67f4b45B4793e770B00E048e4982d";

const BidHistoryPage = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(accounts[0]);
        });

      window.ethereum.on("accountsChanged", (newAccounts) => {
        setAccount(newAccounts[0]);
      });
    }
  }, []);

  useEffect(() => {
    const loadAuctions = async () => {
      if (!web3) return;
      const factoryContract = new web3.eth.Contract(
        AuctionFactoryABI.abi,
        auctionFactoryAddress
      );
      const auctionAddresses = await factoryContract.methods
        .getAllAuctions()
        .call();
      setAuctions(auctionAddresses);
    };
    if (web3 && account) {
      loadAuctions();
    }
  }, [web3, account]);

  return (
    <div style={{ padding: "20px" }}>
      <BidHistory web3={web3} account={account} auctions={auctions} />
    </div>
  );
};

export default BidHistoryPage;
