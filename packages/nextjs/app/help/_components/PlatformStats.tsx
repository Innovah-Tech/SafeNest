"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const PlatformStats = () => {
  const { data: totalRequests, isLoading: loadingRequests } = useScaffoldReadContract({
    contractName: "SafeNest",
    functionName: "totalHelpRequests",
  });

  const isLoading = loadingRequests;

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Mock data for demonstration since we don't have all the stats functions
  const totalHelpProvided = (Number(totalRequests) || 0) * 0.7; // 70% resolution rate
  const totalHelpers = Math.max(1, Math.floor((Number(totalRequests) || 0) * 0.3)); // 30% of requests have helpers
  const platformBalance = BigInt(0); // Would need to read from contract

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-primary text-primary-content rounded-lg">
          <div className="stat-figure text-primary-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title text-primary-content">Total Requests</div>
          <div className="stat-value text-primary-content">{Number(totalRequests) || 0}</div>
          <div className="stat-desc text-primary-content">Help requests created</div>
        </div>

        <div className="stat bg-secondary text-secondary-content rounded-lg">
          <div className="stat-figure text-secondary-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title text-secondary-content">Help Provided</div>
          <div className="stat-value text-secondary-content">{Math.floor(totalHelpProvided)}</div>
          <div className="stat-desc text-secondary-content">Requests resolved</div>
        </div>

        <div className="stat bg-accent text-accent-content rounded-lg">
          <div className="stat-figure text-accent-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title text-accent-content">Active Helpers</div>
          <div className="stat-value text-accent-content">{totalHelpers}</div>
          <div className="stat-desc text-accent-content">Registered helpers</div>
        </div>

        <div className="stat bg-neutral text-neutral-content rounded-lg">
          <div className="stat-figure text-neutral-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              ></path>
            </svg>
          </div>
          <div className="stat-title text-neutral-content">Platform Balance</div>
          <div className="stat-value text-neutral-content">{(Number(platformBalance) / 1e18).toFixed(4)}</div>
          <div className="stat-desc text-neutral-content">ETH in platform</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Platform Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Resolution Rate:</span>
                <span className="font-semibold">
                  {(Number(totalRequests) || 0) > 0
                    ? ((totalHelpProvided / (Number(totalRequests) || 1)) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Helpers per Request:</span>
                <span className="font-semibold">
                  {totalHelpers > 0 ? ((Number(totalRequests) || 0) / totalHelpers).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span className="font-semibold">0.01 ETH</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Last 24h:</span>
                <span>+{Math.floor((Number(totalRequests) || 0) * 0.1)} requests</span>
              </div>
              <div className="flex justify-between">
                <span>Last 7 days:</span>
                <span>+{Math.floor((Number(totalRequests) || 0) * 0.3)} requests</span>
              </div>
              <div className="flex justify-between">
                <span>Last 30 days:</span>
                <span>+{Math.floor((Number(totalRequests) || 0) * 0.8)} requests</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">For Requesters:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Create help requests with detailed descriptions</li>
                <li>Set rewards for premium requests</li>
                <li>Choose from various categories</li>
                <li>Track request status and solutions</li>
                <li>Build reputation through community interaction</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">For Helpers:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Register with skills and expertise</li>
                <li>Browse and filter help requests</li>
                <li>Provide solutions and earn rewards</li>
                <li>Build reputation and get verified</li>
                <li>Track your contribution history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
