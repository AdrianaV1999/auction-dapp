import React, { useState, useEffect } from "react";
import AuctionDetailsModal from "../AuctionDetailsModal/AuctionDetailsModal.js";
import AuctionFactoryABI from "../../contracts/AuctionFactory.json";
import "./AuctionList.css";
import { Link } from "react-router-dom";
const AuctionList = ({ web3, account, auctionFactoryAddress }) => {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const loadAuctions = async () => {
    try {
      const auctionFactory = new web3.eth.Contract(
        AuctionFactoryABI.abi,
        auctionFactoryAddress
      );

      const auctionsFromContract = await auctionFactory.methods
        .getAllAuctions()
        .call();
      setAuctions(auctionsFromContract);
    } catch (error) {
      console.error("Error while loading auction list:", error);
    }
  };

  useEffect(() => {
    if (web3) {
      loadAuctions();
    }
  }, [web3]);

  const openDetailsModal = (auction) => {
    setSelectedAuction(auction);
  };

  return (
    <div className="auction-list">
      <h1 className="auction-list-title">Auction dApp</h1>
      <div className="nav-links">
        <Link to="/">Aukcije</Link>
        <Link to="/moje-licitacije">Moje licitacije</Link>
      </div>

      {auctions.map((auction, index) => (
        <div
          key={index}
          className="auction-item"
          onClick={() => openDetailsModal(auction)}
        >
          Aukcija {index + 1}
        </div>
      ))}
      {selectedAuction && (
        <AuctionDetailsModal
          web3={web3}
          account={account}
          auction={selectedAuction}
          onClose={() => setSelectedAuction(null)}
        />
      )}
    </div>
  );
};

export default AuctionList;
