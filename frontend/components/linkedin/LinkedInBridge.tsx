'use client';

import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaSync, FaUsers, FaBriefcase, FaGraduationCap, FaChartLine, FaCheck, FaTimes } from 'react-icons/fa';

interface LinkedInBridgeProps {
  userType: 'student' | 'recruiter' | 'university';
  userId: string;
  onSyncComplete?: (data: any) => void;
}

interface SyncStatus {
  profile: 'pending' | 'syncing' | 'completed' | 'error';
  connections: 'pending' | 'syncing' | 'completed' | 'error';
  experience: 'pending' | 'syncing' | 'completed' | 'error';
  skills: 'pending' | 'syncing' | 'completed' | 'error';
}

interface SyncData {
  profileUpdates: number;
  newConnections: number;
  skillsAdded: number;
  experienceUpdated: number;
  matchesFound: number;
  opportunitiesIdentified: number;
}

export default function LinkedInBridge({ userType, userId, onSyncComplete }: LinkedInBridgeProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    profile: 'pending',
    connections: 'pending',
    experience: 'pending',
    skills: 'pending'
  });
  const [syncData, setSyncData] = useState<SyncData>({
    profileUpdates: 0,
    newConnections: 0,
    skillsAdded: 0,
    experienceUpdated: 0,
    matchesFound: 0,
    opportunitiesIdentified: 0
  });
  const [autoSync, setAutoSync] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check connection on mount
  useEffect(() => {
    checkLinkedInConnection();
  }, []); // Only run on mount

  // Handle auto-sync when connection status or auto-sync preference changes
  useEffect(() => {
    if (autoSync && isConnected) {
      startPeriodicSync();
    }
  }, [isConnected, autoSync]); // Keep this separate to avoid infinite loop

  const checkLinkedInConnection = async () => {
    try {
      const response = await fetch('/api/linkedin/validate-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'linkedin-token': localStorage.getItem('linkedin-token') || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.valid);
      }
    } catch (error) {
      console.error('Error checking LinkedIn connection:', error);
      setIsConnected(false);
    }
  };

  const startPeriodicSync = () => {
    // Sync every 30 minutes
    const interval = setInterval(async () => {
      if (isConnected && !isSyncing) {
        await performFullSync();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  };

  const performFullSync = async () => {
    if (!isConnected) return;

    setIsSyncing(true);
    const startTime = Date.now();

    try {
      // Step 1: Sync Profile
      setSyncStatus(prev => ({ ...prev, profile: 'syncing' }));
      const profileData = await syncProfile();
      setSyncStatus(prev => ({ ...prev, profile: 'completed' }));

      // Step 2: Sync Connections
      setSyncStatus(prev => ({ ...prev, connections: 'syncing' }));
      const connectionsData = await syncConnections();
      setSyncStatus(prev => ({ ...prev, connections: 'completed' }));

      // Step 3: Sync Experience
      setSyncStatus(prev => ({ ...prev, experience: 'syncing' }));
      const experienceData = await syncExperience();
      setSyncStatus(prev => ({ ...prev, experience: 'completed' }));

      // Step 4: Sync Skills
      setSyncStatus(prev => ({ ...prev, skills: 'syncing' }));
      const skillsData = await syncSkills();
      setSyncStatus(prev => ({ ...prev, skills: 'completed' }));

      // Update sync data
      setSyncData({
        profileUpdates: profileData.updates || 0,
        newConnections: connectionsData.newConnections || 0,
        skillsAdded: skillsData.skillsAdded || 0,
        experienceUpdated: experienceData.updates || 0,
        matchesFound: connectionsData.matches || 0,
        opportunitiesIdentified: profileData.opportunities || 0
      });

      setLastSyncTime(new Date());
      onSyncComplete?.(syncData);

      // Show success message
      console.log(`Sync completed in ${Date.now() - startTime}ms`);

    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(prev => ({
        profile: prev.profile === 'syncing' ? 'error' : prev.profile,
        connections: prev.connections === 'syncing' ? 'error' : prev.connections,
        experience: prev.experience === 'syncing' ? 'error' : prev.experience,
        skills: prev.skills === 'syncing' ? 'error' : prev.skills
      }));
    } finally {
      setIsSyncing(false);
    }
  };

  const syncProfile = async () => {
    const response = await fetch('/api/linkedin/sync/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'linkedin-token': localStorage.getItem('linkedin-token') || ''
      }
    });

    if (!response.ok) throw new Error('Profile sync failed');
    return await response.json();
  };

  const syncConnections = async () => {
    const response = await fetch('/api/linkedin/intransparency/match-connections', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'linkedin-token': localStorage.getItem('linkedin-token') || ''
      }
    });

    if (!response.ok) throw new Error('Connections sync failed');
    return await response.json();
  };

  const syncExperience = async () => {
    // Sync work experience for recruiters, education for students
    const endpoint = userType === 'student' ? 'education' : 'experience';
    const response = await fetch(`/api/linkedin/sync/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'linkedin-token': localStorage.getItem('linkedin-token') || ''
      }
    });

    if (!response.ok) throw new Error('Experience sync failed');
    return await response.json();
  };

  const syncSkills = async () => {
    const response = await fetch('/api/linkedin/sync/skills', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'linkedin-token': localStorage.getItem('linkedin-token') || ''
      }
    });

    if (!response.ok) throw new Error('Skills sync failed');
    return await response.json();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheck className="text-green-600" />;
      case 'syncing':
        return <FaSync className="text-blue-600 animate-spin" />;
      case 'error':
        return <FaTimes className="text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'syncing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSyncRecommendations = () => {
    if (userType === 'student') {
      return [
        'Sync your academic projects as experience entries',
        'Connect with classmates and professors',
        'Highlight technical skills from coursework',
        'Showcase internships and research projects'
      ];
    } else if (userType === 'recruiter') {
      return [
        'Import your professional network for talent discovery',
        'Sync company information and job postings',
        'Connect with university career services',
        'Highlight recruiting success stories'
      ];
    } else {
      return [
        'Sync university and department information',
        'Connect with alumni network',
        'Highlight student placement success',
        'Showcase university-industry partnerships'
      ];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border">
      <div className="bg-[#0077B5] text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaLinkedin className="text-2xl" />
            <div>
              <h3 className="font-semibold text-lg">LinkedIn Bridge</h3>
              <p className="text-blue-100 text-sm">Smart synchronization with your professional network</p>
            </div>
          </div>
          {isConnected && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">Connected</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {!isConnected ? (
          <div className="text-center py-8">
            <FaLinkedin className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect LinkedIn First</h3>
            <p className="text-gray-600 mb-4">
              Connect your LinkedIn account to enable smart synchronization
            </p>
            <button
              onClick={checkLinkedInConnection}
              className="bg-[#0077B5] text-white px-6 py-2 rounded-lg hover:bg-[#005885] transition-colors"
            >
              Check Connection
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sync Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={performFullSync}
                  disabled={isSyncing}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSyncing
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSyncing ? (
                    <>
                      <FaSync className="animate-spin mr-2" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <FaSync className="mr-2" />
                      Sync Now
                    </>
                  )}
                </button>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Auto-sync every 30 minutes</span>
                </label>
              </div>

              {lastSyncTime && (
                <div className="text-sm text-gray-700">
                  Last sync: {lastSyncTime.toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Sync Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'profile', label: 'Profile Data', icon: FaUsers },
                { key: 'connections', label: 'Network Connections', icon: FaUsers },
                { key: 'experience', label: userType === 'student' ? 'Education' : 'Experience', icon: userType === 'student' ? FaGraduationCap : FaBriefcase },
                { key: 'skills', label: 'Skills & Endorsements', icon: FaChartLine }
              ].map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border transition-all ${getStatusColor(syncStatus[key as keyof SyncStatus])}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="text-lg" />
                      <span className="font-medium">{label}</span>
                    </div>
                    {getStatusIcon(syncStatus[key as keyof SyncStatus])}
                  </div>
                  {syncStatus[key as keyof SyncStatus] === 'completed' && (
                    <div className="mt-2 text-sm">
                      {key === 'profile' && `${syncData.profileUpdates} updates`}
                      {key === 'connections' && `${syncData.newConnections} new connections`}
                      {key === 'experience' && `${syncData.experienceUpdated} entries updated`}
                      {key === 'skills' && `${syncData.skillsAdded} skills added`}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sync Results */}
            {Object.values(syncStatus).some(status => status === 'completed') && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Synchronization Results</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Profile Updates:</span>
                    <span className="font-semibold ml-1">{syncData.profileUpdates}</span>
                  </div>
                  <div>
                    <span className="text-green-700">New Connections:</span>
                    <span className="font-semibold ml-1">{syncData.newConnections}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Skills Added:</span>
                    <span className="font-semibold ml-1">{syncData.skillsAdded}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Matches Found:</span>
                    <span className="font-semibold ml-1">{syncData.matchesFound}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Opportunities:</span>
                    <span className="font-semibold ml-1">{syncData.opportunitiesIdentified}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sync Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">
                {userType === 'student' ? '🎓 Student' : userType === 'recruiter' ? '💼 Recruiter' : '🏫 University'} Sync Tips
              </h4>
              <ul className="space-y-2">
                {(getSyncRecommendations() || []).map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-blue-700">
                    <FaCheck className="text-blue-600 mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}