"use client";

import React, { useState } from "react";

const VaultInputTest = () => {
  const [depositAmounts, setDepositAmounts] = useState<string[]>(["", "", ""]);
  const [withdrawAmounts, setWithdrawAmounts] = useState<string[]>(["", "", ""]);

  const vaultNames = ["Micro-Savings", "Pension Nest", "Emergency Vault"];

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Vault Input Test</h2>
      <p className="text-gray-600 mb-4">Test that all 3 vaults can accept input independently</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vaultNames.map((name, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{name}</h3>

            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-600">Deposit Amount:</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="input input-bordered input-sm w-full"
                  value={depositAmounts[index]}
                  onChange={e => {
                    const newAmounts = [...depositAmounts];
                    newAmounts[index] = e.target.value;
                    setDepositAmounts(newAmounts);
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">Value: &quot;{depositAmounts[index]}&quot;</div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Withdraw Amount:</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="input input-bordered input-sm w-full"
                  value={withdrawAmounts[index]}
                  onChange={e => {
                    const newAmounts = [...withdrawAmounts];
                    newAmounts[index] = e.target.value;
                    setWithdrawAmounts(newAmounts);
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">Value: &quot;{withdrawAmounts[index]}&quot;</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2">Current State:</h4>
        <div className="text-sm">
          <div>Deposit Amounts: [{depositAmounts.join(", ")}]</div>
          <div>Withdraw Amounts: [{withdrawAmounts.join(", ")}]</div>
        </div>
      </div>

      <div className="mt-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log("Deposit amounts:", depositAmounts);
            console.log("Withdraw amounts:", withdrawAmounts);
            alert(`Deposit: [${depositAmounts.join(", ")}]\nWithdraw: [${withdrawAmounts.join(", ")}]`);
          }}
        >
          Log Current State
        </button>
      </div>
    </div>
  );
};

export default VaultInputTest;
