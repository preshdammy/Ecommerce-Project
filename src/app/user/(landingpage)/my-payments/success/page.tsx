"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { gql, useMutation } from "@apollo/client";

const VERIFY_WALLET_FUNDING = gql`
  mutation VerifyWallet($reference: String!) {
    verifyWalletFunding(reference: $reference) {
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



const WalletSuccessPage = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const router = useRouter();

  const [showSuccess, setShowSuccess] = useState(false);

  const [verifyWallet, { data, loading, error }] = useMutation(VERIFY_WALLET_FUNDING, {
    refetchQueries: ["getBalance"], // or your actual wallet query name
  });

  useEffect(() => {
    if (reference) {
      verifyWallet({ variables: { reference } });
    }
  }, [reference, verifyWallet]);

  useEffect(() => {
    if (data?.verifyWalletFunding?.balance !== undefined) {
      setShowSuccess(true);
      const timeout = setTimeout(() => {
        router.push("/user/my-payments");
      }, 2000);
  
      return () => clearTimeout(timeout);
    }
  }, [data, router]);
  

  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-white p-4">
      {loading && <p className="text-lg font-semibold">Verifying transaction...</p>}

      {error && (
        <p className="text-red-500 text-center font-medium">
          Something went wrong: {error.message}
        </p>
      )}

      {showSuccess && (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-ping-slow">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-700 text-lg font-semibold">Payment Verified!</p>
          <p className="text-gray-600 text-sm">Redirecting to your wallet...</p>
        </div>
      )}
    </div>
  );
};

export default WalletSuccessPage;
