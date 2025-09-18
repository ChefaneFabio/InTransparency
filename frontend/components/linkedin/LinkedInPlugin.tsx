'use client';

import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaUser, FaUsers, FaSearch, FaShare, FaTimes, FaCheck } from 'react-icons/fa';

interface LinkedInPluginProps {
  mode: 'plugin' | 'standalone';
  userId: string;
  userType: 'student' | 'recruiter' | 'university';
  position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
  expanded?: boolean;
  onClose?: () => void;
}

interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  pictureUrl?: string;
  profileUrl: string;
  connections?: number;
}

interface LinkedInConnection {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  pictureUrl?: string;
  connectionType: 'first' | 'second' | 'third';
  isInTransparencyUser?: boolean;
}

export default function LinkedInPlugin({
  mode = 'plugin',
  userId,
  userType,
  position = 'bottom-right',
  expanded = false,
  onClose
}: LinkedInPluginProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isConnected, setIsConnected] = useState(false);
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [connections, setConnections] = useState<LinkedInConnection[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'connections' | 'search' | 'invite'>('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LinkedInConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);

  useEffect(() => {
    checkLinkedInConnection();
  }, [userId]);

  const checkLinkedInConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/linkedin/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'linkedin-token': localStorage.getItem('linkedin-token') || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLinkedInProfile(data.profile);
        setIsConnected(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking LinkedIn connection:', error);
      return false;
    }
  };

  const connectToLinkedIn = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/linkedin/auth/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userType })
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.authUrl, '_blank', 'width=600,height=700');

        // Listen for auth completion
        const checkAuth = setInterval(async () => {
          const isConnectedNow = await checkLinkedInConnection();
          if (isConnectedNow) {
            clearInterval(checkAuth);
            setLoading(false);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/linkedin/connections', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'linkedin-token': localStorage.getItem('linkedin-token') || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections);
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    }
    setLoading(false);
  };

  const searchLinkedIn = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/linkedin/search/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'linkedin-token': localStorage.getItem('linkedin-token') || ''
        },
        body: JSON.stringify({ keywords: searchQuery })
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Error searching LinkedIn:', error);
    }
    setLoading(false);
  };

  const sendConnectionRequest = async (personId: string) => {
    try {
      const response = await fetch('/api/linkedin/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'linkedin-token': localStorage.getItem('linkedin-token') || ''
        },
        body: JSON.stringify({
          personId,
          message: `Hi! I found you through InTransparency. I'd love to connect!`
        })
      });

      if (response.ok) {
        alert('Connection request sent successfully!');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request');
    }
  };

  const inviteToInTransparency = async () => {
    if (selectedConnections.length === 0) {
      alert('Please select connections to invite');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/linkedin/intransparency/invite-connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'linkedin-token': localStorage.getItem('linkedin-token') || ''
        },
        body: JSON.stringify({
          connectionIds: selectedConnections,
          inviteMessage: userType === 'student'
            ? "Hi! I'm showcasing my academic projects on InTransparency. Check out how I'm connecting with industry professionals!"
            : "Hi! I'm using InTransparency to discover amazing student talent. Join me in finding the next generation of innovators!"
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${data.successfulSent} invites sent successfully!`);
        setSelectedConnections([]);
      }
    } catch (error) {
      console.error('Error sending invites:', error);
      alert('Failed to send invites');
    }
    setLoading(false);
  };

  const getPositionClasses = () => {
    if (mode === 'standalone') return '';

    const base = 'fixed z-50';
    switch (position) {
      case 'bottom-right': return `${base} bottom-4 right-4`;
      case 'top-right': return `${base} top-4 right-4`;
      case 'bottom-left': return `${base} bottom-4 left-4`;
      case 'top-left': return `${base} top-4 left-4`;
      default: return `${base} bottom-4 right-4`;
    }
  };

  const renderPluginToggle = () => (
    <div
      className={`${getPositionClasses()} transition-all duration-300 ${
        isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <button
        onClick={() => setIsExpanded(true)}
        className="bg-[#0077B5] hover:bg-[#005885] text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
        title="Open LinkedIn Integration"
      >
        <FaLinkedin className="text-2xl" />
      </button>
    </div>
  );

  const renderExpandedPlugin = () => (
    <div className={`${getPositionClasses()} ${mode === 'standalone' ? 'relative' : ''}`}>
      <div className={`bg-white rounded-lg shadow-2xl border ${
        mode === 'plugin' ? 'w-96 h-[500px]' : 'w-full h-full'
      } transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b bg-[#0077B5] text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <FaLinkedin className="text-xl" />
            <span className="font-semibold">LinkedIn Integration</span>
          </div>
          {mode === 'plugin' && (
            <button
              onClick={() => {
                setIsExpanded(false);
                onClose?.();
              }}
              className="text-white hover:bg-white hover:text-[#0077B5] p-1 rounded transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="flex-1 h-full overflow-hidden">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <FaLinkedin className="text-6xl text-[#0077B5] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connect Your LinkedIn</h3>
              <p className="text-gray-600 text-center mb-6 text-sm">
                {userType === 'student'
                  ? "Connect your LinkedIn to showcase your professional network and discover opportunities"
                  : userType === 'recruiter'
                  ? "Connect your LinkedIn to expand your talent search and networking capabilities"
                  : "Connect your LinkedIn to enhance university partnerships and student placement tracking"
                }
              </p>
              <button
                onClick={connectToLinkedIn}
                disabled={loading}
                className="bg-[#0077B5] hover:bg-[#005885] text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect LinkedIn'}
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex border-b">
                {['profile', 'connections', 'search', 'invite'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {tab === 'profile' && <FaUser className="mr-2" />}
                    {tab === 'connections' && <FaUsers className="mr-2" />}
                    {tab === 'search' && <FaSearch className="mr-2" />}
                    {tab === 'invite' && <FaShare className="mr-2" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'profile' && linkedInProfile && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {linkedInProfile.pictureUrl && (
                        <img
                          src={linkedInProfile.pictureUrl}
                          alt="Profile"
                          className="w-16 h-16 rounded-full"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">
                          {linkedInProfile.firstName} {linkedInProfile.lastName}
                        </h3>
                        {linkedInProfile.headline && (
                          <p className="text-sm text-gray-600">{linkedInProfile.headline}</p>
                        )}
                        {linkedInProfile.connections && (
                          <p className="text-sm text-blue-600">{linkedInProfile.connections} connections</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(linkedInProfile.profileUrl, '_blank')}
                      className="w-full bg-[#0077B5] text-white py-2 rounded-lg hover:bg-[#005885] transition-colors"
                    >
                      View LinkedIn Profile
                    </button>
                  </div>
                )}

                {activeTab === 'connections' && (
                  <div className="space-y-4">
                    <button
                      onClick={loadConnections}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Load Connections'}
                    </button>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {connections.map((connection) => (
                        <div key={connection.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            {connection.pictureUrl && (
                              <img
                                src={connection.pictureUrl}
                                alt=""
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium">
                                {connection.firstName} {connection.lastName}
                              </p>
                              {connection.headline && (
                                <p className="text-xs text-gray-600">{connection.headline}</p>
                              )}
                            </div>
                          </div>
                          {connection.isInTransparencyUser && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              InTransparency User
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'search' && (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search LinkedIn network..."
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && searchLinkedIn()}
                      />
                      <button
                        onClick={searchLinkedIn}
                        disabled={loading || !searchQuery.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <FaSearch />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {searchResults.map((person) => (
                        <div key={person.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            {person.pictureUrl && (
                              <img
                                src={person.pictureUrl}
                                alt=""
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium">
                                {person.firstName} {person.lastName}
                              </p>
                              {person.headline && (
                                <p className="text-xs text-gray-600">{person.headline}</p>
                              )}
                              <p className="text-xs text-blue-600">
                                {person.connectionType} degree connection
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => sendConnectionRequest(person.id)}
                            className="text-xs bg-[#0077B5] text-white px-3 py-1 rounded hover:bg-[#005885] transition-colors"
                          >
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'invite' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Select connections to invite to InTransparency
                      </p>
                    </div>

                    {connections.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-600 text-sm">Load your connections first</p>
                      </div>
                    )}

                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {connections.map((connection) => (
                        <div key={connection.id} className="flex items-center space-x-2 p-2 border rounded-lg">
                          <input
                            type="checkbox"
                            checked={selectedConnections.includes(connection.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedConnections([...selectedConnections, connection.id]);
                              } else {
                                setSelectedConnections(selectedConnections.filter(id => id !== connection.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          {connection.pictureUrl && (
                            <img
                              src={connection.pictureUrl}
                              alt=""
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {connection.firstName} {connection.lastName}
                            </p>
                            {connection.headline && (
                              <p className="text-xs text-gray-600">{connection.headline}</p>
                            )}
                          </div>
                          {connection.isInTransparencyUser && (
                            <FaCheck className="text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedConnections.length > 0 && (
                      <button
                        onClick={inviteToInTransparency}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : `Invite ${selectedConnections.length} Connection${selectedConnections.length > 1 ? 's' : ''}`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (mode === 'standalone') {
    return renderExpandedPlugin();
  }

  return (
    <>
      {renderPluginToggle()}
      {isExpanded && renderExpandedPlugin()}
    </>
  );
}