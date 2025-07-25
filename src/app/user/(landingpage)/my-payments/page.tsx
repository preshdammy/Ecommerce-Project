
"use client";

import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

// GraphQL Queries and Mutations
const INIT_WALLET_FUNDING = gql`
  mutation InitWallet($amount: Float!) {
    initializeWalletFunding(amount: $amount) {
      authorization_url
      reference
    }
  }
`;

const VERIFY_WALLET_FUNDING = gql`
  mutation VerifyWallet($reference: String!) {
    verifyWalletFunding(reference: $reference) {
      balance
    }
  }
`;

const WITHDRAW_FUNDS = gql`
  mutation Withdraw($amount: Float!) {
    withdrawFunds(amount: $amount) {
      balance
    }
  }
`;

const GET_BALANCE = gql`
  query GetBalance {
    getWalletBalance {
      balance
    }
  }
`;

const MyPayment = () => {
  const [showFundModal, setShowFundModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");

  const [initWallet] = useMutation(INIT_WALLET_FUNDING);
  const [verifyWallet] = useMutation(VERIFY_WALLET_FUNDING);
  const [withdrawFunds] = useMutation(WITHDRAW_FUNDS);
  const [getWalletBalance, { data, refetch }] = useLazyQuery(GET_BALANCE);

  const handleFund = async () => {
    const amt = parseFloat(amount); // convert string to number
        if (isNaN(amt) || amt <= 0) {
            alert("Enter a valid amount");
            return;
        }
    try {
      const { data } = await initWallet({
        variables: { amount: amt }
      });

      const url = data.initializeWalletFunding.authorization_url;
      if (url) {
        window.location.href = url;  
      }
    } catch (error) {
      console.error("Funding error", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) return alert("Enter a valid amount");

      await withdrawFunds({ variables: { amount: amt } });
      await refetch();
      alert("Withdrawal successful");
      setShowWithdrawModal(false);
      setAmount("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Withdrawal failed");
    }
  };

  useEffect(() => {
    getWalletBalance();
  }, []);

  return (
    <>
      <div className="max-w-[1536px] bg-[#F8F8F8] pb-[20vh]">
        <div className="w-[85%] font-sans mx-auto pt-[20vh]">
          <div className="w-full">
            <h2 className="font-[400] text-[40px] text-[#55A7FF]">My Payments</h2>

            <div className="w-full mt-[8vh]">
              <div className="border-[#CCE5FF] w-[85%] mx-auto border-[1px] rounded-[10px] bg-white py-[30px]">
                <h2 className="font-[400] text-[24px] text-[#939090] ml-[35px]">
                  Total Wallet Balance
                </h2>
                <p className="text-center text-[#007BFF] text-[64px] mt-[20px]">
                  ₦
                  {data?.getWalletBalance?.balance?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }) ?? "0.00"}
                </p>

                <div className="flex gap-[25px] items-center justify-center mt-[30px]">
                  <button
                    className="bg-[#FF4C3B] border-[4px] border-[#F8F8F8] font-[600] text-[24px] py-[20px] px-[56px] rounded-[60px]"
                    onClick={() => setShowFundModal(true)}
                  >
                    Fund Wallet
                  </button>

                  <button
                    className="border-[#FF4C3B] border-[4px] font-[600] text-[24px] py-[20px] px-[56px] rounded-[60px]"
                    onClick={() => setShowWithdrawModal(true)}
                  >
                    Withdraw Funds
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-[20vh]">
            <h2 className="text-[#939090] font-[600] text-[24px]">Payment History</h2>

            <div className="w-full flex justify-between mt-[5vh]">
              <div className="w-[47%] border-[1px] border-[#007BFF] pb-[10vh] rounded-[15px]">
                <div className="h-[95px] bg-[#007BFF] flex items-center rounded-t-[15px]">
                  <span className="font-[600] text-[24px] text-white ml-[20px]">
                    My spending history
                  </span>
                </div>
                <div className="w-full mt-[8vh] h-[480px] overflow-y-auto">
                  <GroceryShoppingDiv />
                  <GroceryShoppingDiv />
                </div>
              </div>

              <div className="w-[47%] border-[1px] border-[#007BFF] pb-[10vh] rounded-[15px]">
                <div className="h-[95px] bg-[#007BFF] flex items-center rounded-t-[15px]">
                  <span className="font-[600] text-[24px] text-white ml-[20px]">
                    Incoming transactions
                  </span>
                </div>
                <div className="w-full mt-[8vh] h-[480px] overflow-y-auto">
                  <GroceryShoppingDiv />
                  <GroceryShoppingDiv />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-md w-[400px] text-center">
            <h2 className="text-[24px] font-semibold mb-4">Fund Wallet</h2>
            <input
              type="number"
              step="0.01"
              placeholder="Enter amount"
              className="w-full border p-2 mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="bg-[#007BFF] text-white px-6 py-2 rounded-md"
                onClick={handleFund}
              >
                Proceed
              </button>
              <button
                className="border border-gray-400 px-6 py-2 rounded-md"
                onClick={() => {
                  setAmount("");
                  setShowFundModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-md w-[400px] text-center">
            <h2 className="text-[24px] font-semibold mb-4">Withdraw Funds</h2>
            <input
              type="number"
              step="0.01"
              placeholder="Enter amount"
              className="w-full border p-2 mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="bg-[#FF4C3B] text-white px-6 py-2 rounded-md"
                onClick={handleWithdraw}
              >
                Proceed
              </button>
              <button
                className="border border-gray-400 px-6 py-2 rounded-md"
                onClick={() => {
                  setAmount("");
                  setShowWithdrawModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyPayment;

export const GroceryShoppingDiv = () => {
  return (
    <div className="flex items-center justify-between w-[85%] mx-auto border-b-[1px] border-[#D9D9D9] py-[5px]">
      <div className="flex items-center gap-[10px]">
        <div className="w-[82px] h-[82px] bg-[#D9D9D9] rounded-[50%]"></div>
        <div>
          <p className="text-[#55A7FF] font-[600] text-[16px]">Grocery Shopping</p>
          <p className="text-[#939090] font-[400] text-[16px]">16th Nov. 2022</p>
        </div>
      </div>
      <div>
        <span className="font-[600] text-[20px]">₦9,480.00</span>
      </div>
    </div>
  );
};

