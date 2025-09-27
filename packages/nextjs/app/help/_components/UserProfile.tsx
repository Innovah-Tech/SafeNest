"use client";

import { useState, useEffect } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

interface UserProfileData {
  name: string;
  bio: string;
  helpRequestsCount: bigint;
  helpProvidedCount: bigint;
  reputation: bigint;
  isVerified: boolean;
  skills: string[];
}

export const UserProfile = () => {
  const { address } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Read user profile
  const { data: userProfile, refetch: refetchProfile } = useScaffoldReadContract({
    contractName: "SafeNest",
    functionName: "getUserProfile",
    args: address ? [address] : undefined,
  });

  // Write contract functions
  const { writeContractAsync: updateProfile, isPending: isUpdatingProfile } = useScaffoldWriteContract({
    contractName: "SafeNest",
    functionName: "updateProfile",
  });

  const { writeContractAsync: registerAsHelper, isPending: isRegistering } = useScaffoldWriteContract({
    contractName: "SafeNest",
    functionName: "registerAsHelper",
  });

  // Update local state when profile data changes
  useEffect(() => {
    if (userProfile) {
      const profile = userProfile as UserProfileData;
      setName(profile.name || "");
      setBio(profile.bio || "");
      setSkills(profile.skills || []);
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (!address) return;

    try {
      await updateProfile({
        args: [name, bio],
      });
      setIsEditing(false);
      refetchProfile();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleRegisterAsHelper = async () => {
    if (!address || skills.length === 0) return;

    try {
      await registerAsHelper({
        args: [name, bio, skills],
      });
      refetchProfile();
      alert("Successfully registered as a helper!");
    } catch (error) {
      console.error("Error registering as helper:", error);
      alert("Failed to register as helper");
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  if (!address) {
    return (
      <div className="alert alert-warning">
        Please connect your wallet to view your profile.
      </div>
    );
  }

  const profile = userProfile as UserProfileData | undefined;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <h2 className="card-title">My Profile</h2>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <Address address={address} />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="input input-bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-lg">{profile?.name || "Not set"}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              {isEditing ? (
                <textarea
                  className="textarea textarea-bordered"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              ) : (
                <p className="text-gray-700">{profile?.bio || "No bio provided"}</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Skills</span>
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <button className="btn btn-sm" onClick={addSkill}>
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="badge badge-primary gap-2">
                        {skill}
                        <button
                          className="btn btn-xs btn-circle btn-ghost"
                          onClick={() => removeSkill(skill)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((skill, index) => (
                    <span key={index} className="badge badge-primary">
                      {skill}
                    </span>
                  )) || <p className="text-gray-500">No skills added</p>}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="stats stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Help Requests</div>
                <div className="stat-value text-primary">
                  {Number(profile?.helpRequestsCount || 0)}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Help Provided</div>
                <div className="stat-value text-secondary">
                  {Number(profile?.helpProvidedCount || 0)}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Reputation</div>
                <div className="stat-value text-accent">
                  {Number(profile?.reputation || 0)}
                </div>
              </div>
            </div>

            {/* Verification Status */}
            {profile?.isVerified && (
              <div className="alert alert-success">
                <span>✓ Verified Helper</span>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Updating..." : "Update Profile"}
                </button>
              </div>
            )}

            {!profile && (
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={handleRegisterAsHelper}
                  disabled={isRegistering || !name || skills.length === 0}
                >
                  {isRegistering ? "Registering..." : "Register as Helper"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
