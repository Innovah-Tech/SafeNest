"use client";

import { useState } from "react";
import { HelpRequestForm } from "./_components/HelpRequestForm";
import { HelpRequestsList } from "./_components/HelpRequestsList";
import { PlatformStats } from "./_components/PlatformStats";
import { UserProfile } from "./_components/UserProfile";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ChartBarIcon, QuestionMarkCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const HelpPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<"requests" | "profile" | "stats">("requests");

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SafeNest Help Center
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Get help, provide assistance, and build your reputation
              </p>

              {/* Wallet Connection Status */}
              {connectedAddress ? (
                <div className="inline-flex items-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-6 py-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium mr-4">Wallet Connected</span>
                  <Address address={connectedAddress} />
                </div>
              ) : (
                <div className="inline-flex items-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-6 py-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-yellow-700 dark:text-yellow-300 font-medium">
                    Connect your wallet to get started
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "requests"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("requests")}
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Help Requests</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <UserIcon className="h-5 w-5" />
                <span>My Profile</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "stats"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("stats")}
              >
                <ChartBarIcon className="h-5 w-5" />
                <span>Platform Stats</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "requests" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-blue-500 mr-3" />
                    Create Help Request
                  </h2>
                  <HelpRequestForm />
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-purple-500 mr-3" />
                    Available Help Requests
                  </h2>
                  <HelpRequestsList />
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <UserIcon className="h-6 w-6 text-green-500 mr-3" />
                  My Profile
                </h2>
                <UserProfile />
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-orange-500 mr-3" />
                  Platform Statistics
                </h2>
                <PlatformStats />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HelpPage;
