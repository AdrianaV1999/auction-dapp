import React, { useEffect, useState } from "react";
import AuctionABI from "../../contracts/Auction.json";
import "./BidHistory.css";
import { Link } from "react-router-dom";

const BidHistory = ({ web3, account, auctions }) => {
  const [userBids, setUserBids] = useState([]);

  useEffect(() => {
    const loadBids = async () => {
      if (!web3 || !account || !auctions) return;

      let allUserBids = [];

      for (let i = 0; i < auctions.length; i++) {
        const auctionAddress = auctions[i];
        const auctionContract = new web3.eth.Contract(
          AuctionABI.abi,
          auctionAddress
        );

        try {
          const bids = await auctionContract.methods
            .getBidsByAddress(account)
            .call();

          bids.forEach((bid) => {
            allUserBids.push({
              auctionIndex: i + 1,
              amount: web3.utils.fromWei(bid.amount, "ether"),
              time: new Date(parseInt(bid.timestamp) * 1000).toLocaleString(),
            });
          });
        } catch (err) {
          console.error("Greška pri čitanju ponuda:", err);
        }
      }

      setUserBids(allUserBids);
    };

    loadBids();
  }, [web3, account, auctions]);

  return (
    <div className="bid-history-container">
      <h2>Moje licitacije</h2>
      <div className="nav-links">
        <Link to="/">Aukcije</Link>
        <Link to="/moje-licitacije">Moje licitacije</Link>
      </div>
      <div className="bids-list">
        {userBids.length === 0 ? (
          <p>Nema pronađenih licitacija.</p>
        ) : (
          <ul>
            {userBids.map((bid, index) => (
              <li key={index} className="bid-item">
                <strong>Aukcija:</strong> Aukcija {bid.auctionIndex}
                <br />
                <strong>Iznos:</strong> {bid.amount} ETH
                <br />
                <strong>Vreme:</strong> {bid.time}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BidHistory;
