import React, { useState, useEffect } from "react";
import AuctionABI from "../../contracts/Auction.json";
import "./AuctionDetails.css";

const AuctionDetailsModal = ({ auction, onClose, web3, account }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const calculateTimeLeft = (endTime) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeftInSeconds = Number(endTime) - currentTime;

    if (timeLeftInSeconds > 0) {
      const hours = Math.floor(timeLeftInSeconds / 3600);
      const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
      const seconds = timeLeftInSeconds % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return "Auction ended";
    }
  };

  const loadAuctionDetails = async () => {
    if (web3 && auction) {
      const auctionContract = new web3.eth.Contract(AuctionABI.abi, auction);
      const highestBid = await auctionContract.methods.highestBid().call();
      const highestBidder = await auctionContract.methods
        .highestBidder()
        .call();
      const auctionEndTime = await auctionContract.methods
        .auctionEndTime()
        .call();

      setHighestBid(highestBid);
      setHighestBidder(highestBidder);
      setTimeLeft(calculateTimeLeft(auctionEndTime));
    }
  };

  useEffect(() => {
    loadAuctionDetails();
    const auctionDataInterval = setInterval(loadAuctionDetails, 5000);

    const countdownInterval = setInterval(() => {
      if (web3 && auction) {
        const auctionContract = new web3.eth.Contract(AuctionABI.abi, auction);
        auctionContract.methods
          .auctionEndTime()
          .call()
          .then((endTime) => {
            setTimeLeft(calculateTimeLeft(endTime));
          });
      }
    }, 1000);

    return () => {
      clearInterval(auctionDataInterval);
      clearInterval(countdownInterval);
    };
  }, [web3, auction]);

  const placeBid = async () => {
    if (!web3 || !auction || !account) return alert("Missing data.");
    if (!bidAmount || Number(bidAmount) <= 0) return alert("Invalid bid.");

    try {
      const auctionContract = new web3.eth.Contract(AuctionABI.abi, auction);
      const bidAmountWei = web3.utils.toWei(String(bidAmount), "ether");
      const correctHexValue = web3.utils.toHex(Number(bidAmountWei));
      console.log("Bid Amount in Wei:", web3.utils.toWei(bidAmount, "ether"));
      console.log("Correct HEX Value:", web3.utils.toHex(bidAmountWei));

      console.log("Transaction Parameters:", {
        to: auction,
        from: account,
        value: correctHexValue,
        data: auctionContract.methods.bid().encodeABI(),
      });

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: auction,
            from: account,
            value: correctHexValue,
            data: auctionContract.methods.bid().encodeABI(),
          },
        ],
      });

      console.log("Bid placed. Hash:", txHash);
    } catch (error) {
      console.error("Bid error:", error);
    }
  };

  const endAuction = async () => {
    if (!web3 || !auction || !account) return alert("Missing data.");
    try {
      const auctionContract = new web3.eth.Contract(AuctionABI.abi, auction);
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: auction,
            from: account,
            data: auctionContract.methods.auctionEnd().encodeABI(),
          },
        ],
      });

      console.log("Auction ended. Hash:", txHash);
    } catch (error) {
      console.error("End error:", error);
    }
  };

  const withdraw = async () => {
    if (!web3 || !auction || !account) return alert("Missing data.");
    try {
      const auctionContract = new web3.eth.Contract(AuctionABI.abi, auction);
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: auction,
            from: account,
            data: auctionContract.methods.withdraw().encodeABI(),
          },
        ],
      });

      console.log("Withdraw successful. Hash:", txHash);
    } catch (error) {
      console.error("Withdraw error:", error);
    }
  };

  const getSecretMessage = async () => {
    if (!web3 || !auction) return alert("Missing data.");

    try {
      const auctionContract = new web3.eth.Contract(AuctionABI.abi, auction);
      const currentHighestBidder = await auctionContract.methods
        .highestBidder()
        .call();

      if (account.toLowerCase() !== currentHighestBidder.toLowerCase()) {
        return alert("Only winner can access the message.");
      }

      const secret = await auctionContract.methods
        .getSecretMessage()
        .call({ from: account });
      alert(`Secret Message: ${secret}`);
    } catch (error) {
      console.error("Secret error:", error);
      alert("Failed to get secret.");
    }
  };

  return (
    <div className="auction-details-modal">
      <h2 className="modal-title">Auction Details</h2>
      <p className="auction-info">Contract Address: {auction}</p>
      <p className="auction-info">Time Left: {timeLeft}</p>
      <p className="auction-info">
        Highest Bid:{" "}
        {highestBid ? web3.utils.fromWei(highestBid, "ether") : "0"} ETH
      </p>
      <p className="auction-info">Highest Bidder: {highestBidder}</p>

      {timeLeft !== "Auction ended" && (
        <div className="bid-section">
          <input
            type="number"
            className="bid-input"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Your Bid"
          />
          <button className="bid-button" onClick={placeBid}>
            Place Bid
          </button>
        </div>
      )}

      <button className="action-button" onClick={endAuction}>
        End Auction
      </button>
      <button className="action-button" onClick={withdraw}>
        Withdraw
      </button>
      {timeLeft === "Auction ended" && (
        <button className="action-button" onClick={getSecretMessage}>
          Get Secret Message
        </button>
      )}
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default AuctionDetailsModal;
