"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface HelpRequest {
  id: number;
  requester: string;
  title: string;
  description: string;
  category: string;
  reward: bigint;
  isResolved: boolean;
  isPremium: boolean;
  createdAt: bigint;
  helper: string;
  solution: string;
  resolvedAt: bigint;
}

export const HelpRequestsList = () => {
  const { address } = useAccount();
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Read platform stats to get total requests
  const { data: platformStats } = useScaffoldReadContract({
    contractName: "SafeNest",
    functionName: "getPlatformStats",
  });

  const totalRequests = platformStats?.[0] || 0;

  // Fetch help requests
  useEffect(() => {
    const fetchHelpRequests = async () => {
      const requests: HelpRequest[] = [];

      // Fetch recent requests (last 10)
      for (let i = Math.max(0, Number(totalRequests) - 10); i < Number(totalRequests); i++) {
        try {
          // This would need to be implemented as a view function in the contract
          // For now, we'll simulate with mock data
          const mockRequest: HelpRequest = {
            id: i,
            requester: `0x${Math.random().toString(16).substr(2, 40)}`,
            title: `Help Request #${i + 1}`,
            description: `This is a sample help request description for request #${i + 1}`,
            category: ["smart-contracts", "frontend", "blockchain", "defi"][i % 4],
            reward: BigInt(0),
            isResolved: i % 3 === 0,
            isPremium: i % 4 === 0,
            createdAt: BigInt(Date.now() - i * 3600000), // 1 hour ago for each
            helper: i % 3 === 0 ? `0x${Math.random().toString(16).substr(2, 40)}` : "",
            solution: i % 3 === 0 ? `Solution for request #${i + 1}` : "",
            resolvedAt: i % 3 === 0 ? BigInt(Date.now() - i * 1800000) : BigInt(0),
          };
          requests.push(mockRequest);
        } catch (error) {
          console.error(`Error fetching request ${i}:`, error);
        }
      }

      setHelpRequests(requests.reverse()); // Show newest first
    };

    if (totalRequests > 0) {
      fetchHelpRequests();
    }
  }, [totalRequests]);

  const filteredRequests =
    selectedCategory === "all" ? helpRequests : helpRequests.filter(req => req.category === selectedCategory);

  const categories = ["all", "smart-contracts", "frontend", "blockchain", "defi", "nft", "security", "other"];

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Filter by Category</span>
        </label>
        <select
          className="select select-bordered"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Help Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No help requests found.</p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">{request.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="badge badge-outline">{request.category}</span>
                      {request.isPremium && <span className="badge badge-primary">Premium</span>}
                      {request.isResolved ? (
                        <span className="badge badge-success">Resolved</span>
                      ) : (
                        <span className="badge badge-warning">Open</span>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>
                        Requester: <Address address={request.requester} />
                      </p>
                      <p>Created: {new Date(Number(request.createdAt) * 1000).toLocaleDateString()}</p>
                      {request.reward > 0 && <p>Reward: {Number(request.reward) / 1e18} ETH</p>}
                    </div>

                    {request.isResolved && request.solution && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800">Solution:</h4>
                        <p className="text-green-700">{request.solution}</p>
                        <p className="text-sm text-green-600 mt-1">
                          Solved by: <Address address={request.helper} />
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!request.isResolved && address && (
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-primary">Provide Help</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
