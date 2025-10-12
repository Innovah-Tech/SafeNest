"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const HelpRequestForm = () => {
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [reward, setReward] = useState("0");

  const { writeContractAsync: createHelpRequest, isPending } = useScaffoldWriteContract("SafeNest");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    try {
      const value = isPremium ? BigInt(parseFloat(reward) * 1e18) : BigInt(0);

      await createHelpRequest({
        functionName: "createHelpRequest",
        args: [title, description, category, isPremium],
        value: value,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setIsPremium(false);
      setReward("0");

      alert("Help request created successfully!");
    } catch (error) {
      console.error("Error creating help request:", error);
      alert("Failed to create help request");
    }
  };

  if (!address) {
    return <div className="alert alert-warning">Please connect your wallet to create a help request.</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              placeholder="Brief description of your problem"
              className="input input-bordered"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Detailed description of what you need help with"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="select select-bordered"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="smart-contracts">Smart Contracts</option>
              <option value="frontend">Frontend Development</option>
              <option value="blockchain">Blockchain</option>
              <option value="defi">DeFi</option>
              <option value="nft">NFT</option>
              <option value="security">Security</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Premium Request (with reward)</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isPremium}
                onChange={e => setIsPremium(e.target.checked)}
              />
            </label>
          </div>

          {isPremium && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Reward (ETH)</span>
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="0.01"
                className="input input-bordered"
                value={reward}
                onChange={e => setReward(e.target.value)}
                required={isPremium}
              />
            </div>
          )}

          <div className="form-control mt-6">
            <button type="submit" className={`btn btn-primary ${isPending ? "loading" : ""}`} disabled={isPending}>
              {isPending ? "Creating..." : "Create Help Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
