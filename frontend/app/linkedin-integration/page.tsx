'use client';

import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaUsers, FaSearch, FaNetworkWired, FaChartLine, FaHandshake, FaBullhorn, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import LinkedInPlugin from '../../components/linkedin/LinkedInPlugin';

interface NetworkingStats {
  totalConnections: number;
  inTransparencyUsers: number;
  newConnectionsThisMonth: number;
  messagesSent: number;
  responseRate: number;
  jobOpportunities: number;
}

interface NetworkingOpportunity {
  id: string;
  type: 'student' | 'recruiter' | 'professional';
  name: string;
  title: string;
  company?: string;
  university?: string;
  mutualConnections: number;
  matchScore: number;
  skills: string[];
  profilePicture?: string;
}

export default function LinkedInIntegrationPage() {
  const [mode, setMode] = useState<'plugin' | 'standalone'>('standalone');
  const [userType, setUserType] = useState<'student' | 'recruiter' | 'university'>('student');
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<NetworkingStats>({
    totalConnections: 0,
    inTransparencyUsers: 0,
    newConnectionsThisMonth: 0,
    messagesSent: 0,
    responseRate: 0,
    jobOpportunities: 0
  });
  const [opportunities, setOpportunities] = useState<NetworkingOpportunity[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'networking' | 'opportunities' | 'analytics'>('overview');

  useEffect(() => {
    loadNetworkingData();
  }, []);

  const loadNetworkingData = async () => {
    // Mock data - in production, this would fetch from API
    setStats({
      totalConnections: 847,
      inTransparencyUsers: 123,
      newConnectionsThisMonth: 28,
      messagesSent: 45,
      responseRate: 67,
      jobOpportunities: 12
    });

    setOpportunities([
      {
        id: '1',
        type: 'recruiter',
        name: 'Sarah Johnson',
        title: 'Senior Technical Recruiter',
        company: 'Google',
        mutualConnections: 15,
        matchScore: 95,
        skills: ['JavaScript', 'React', 'Node.js'],
        profilePicture: 'https://via.placeholder.com/150'
      },
      {
        id: '2',
        type: 'student',
        name: 'Alex Chen',
        title: 'CS Student',
        university: 'Stanford University',
        mutualConnections: 8,
        matchScore: 88,
        skills: ['Python', 'Machine Learning', 'Data Science'],
        profilePicture: 'https://via.placeholder.com/150'
      },
      {
        id: '3',
        type: 'professional',
        name: 'Michael Rodriguez',
        title: 'Senior Software Engineer',
        company: 'Microsoft',
        mutualConnections: 23,
        matchScore: 92,
        skills: ['C#', '.NET', 'Azure'],
        profilePicture: 'https://via.placeholder.com/150'
      }
    ]);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0077B5] to-blue-700 text-white p-8 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <FaLinkedin className="text-4xl" />
          <div>
            <h1 className="text-3xl font-bold">LinkedIn Integration</h1>
            <p className="text-blue-100">Bridge your professional network with academic excellence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <FaUsers className="text-2xl mb-2" />
            <h3 className="font-semibold">Smart Networking</h3>
            <p className="text-sm text-blue-100">Find relevant connections across universities and companies</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <FaHandshake className="text-2xl mb-2" />
            <h3 className="font-semibold">Bridge Builder</h3>
            <p className="text-sm text-blue-100">Connect students with industry professionals seamlessly</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <FaBullhorn className="text-2xl mb-2" />
            <h3 className="font-semibold">Opportunity Engine</h3>
            <p className="text-sm text-blue-100">Discover and share career opportunities through your network</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Connections</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalConnections}</p>
            </div>
            <FaUsers className="text-blue-600 text-xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">InTransparency Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.inTransparencyUsers}</p>
            </div>
            <FaNetworkWired className="text-green-600 text-xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-purple-600">{stats.newConnectionsThisMonth}</p>
            </div>
            <FaChartLine className="text-purple-600 text-xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-orange-600">{stats.messagesSent}</p>
            </div>
            <FaBullhorn className="text-orange-600 text-xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-teal-600">{stats.responseRate}%</p>
            </div>
            <FaHandshake className="text-teal-600 text-xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Opportunities</p>
              <p className="text-2xl font-bold text-red-600">{stats.jobOpportunities}</p>
            </div>
            <FaBriefcase className="text-red-600 text-xl" />
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Integration Mode</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setMode('plugin')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'plugin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Plugin Mode
          </button>
          <button
            onClick={() => setMode('standalone')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'standalone'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Standalone Mode
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {mode === 'plugin'
            ? 'LinkedIn integration appears as a floating widget on InTransparency pages'
            : 'Full-featured LinkedIn networking interface integrated into InTransparency'
          }
        </p>
      </div>

      {/* User Type Selection */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">User Experience</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setUserType('student')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              userType === 'student'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaGraduationCap />
            <span>Student View</span>
          </button>
          <button
            onClick={() => setUserType('recruiter')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              userType === 'recruiter'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaBriefcase />
            <span>Recruiter View</span>
          </button>
          <button
            onClick={() => setUserType('university')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              userType === 'university'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaUsers />
            <span>University View</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderNetworkingTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">LinkedIn Networking Hub</h2>
        <LinkedInPlugin
          mode={mode}
          userId="demo-user"
          userType={userType}
          expanded={true}
        />
      </div>
    </div>
  );

  const renderOpportunitiesTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Networking Opportunities</h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {opportunities.length} matches
          </span>
        </div>

        <div className="grid gap-4">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img
                  src={opportunity.profilePicture}
                  alt=""
                  className="w-16 h-16 rounded-full"
                />

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg">{opportunity.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      opportunity.type === 'student'
                        ? 'bg-green-100 text-green-800'
                        : opportunity.type === 'recruiter'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {opportunity.type}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-1">{opportunity.title}</p>
                  {opportunity.company && (
                    <p className="text-gray-600 text-sm mb-2">at {opportunity.company}</p>
                  )}
                  {opportunity.university && (
                    <p className="text-gray-600 text-sm mb-2">at {opportunity.university}</p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>{opportunity.mutualConnections} mutual connections</span>
                    <span className="text-green-600 font-medium">{opportunity.matchScore}% match</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {opportunity.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {opportunity.skills.length > 3 && (
                      <span className="text-gray-500 text-xs">+{opportunity.skills.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="bg-[#0077B5] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#005885] transition-colors">
                      Connect on LinkedIn
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                      Invite to InTransparency
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Networking Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Connection Growth</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold text-blue-600">+{stats.newConnectionsThisMonth}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="font-semibold text-green-600">{stats.responseRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Messages Sent</span>
                <span className="font-semibold text-orange-600">{stats.messagesSent}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Network Composition</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="font-semibold">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Recruiters</span>
                  <span className="font-semibold">Growing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Professionals</span>
                  <span className="font-semibold">Engaged</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Top Universities</h3>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stanford</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">MIT</span>
                  <span className="font-semibold">19</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">UC Berkeley</span>
                  <span className="font-semibold">15</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-gray-800 mb-4">Engagement Trends</h3>
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <FaChartLine className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Detailed analytics charts would appear here</p>
            <p className="text-sm text-gray-500 mt-2">
              Track connection requests, message responses, job referrals, and network growth over time
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            {[
              { key: 'overview', label: 'Overview', icon: FaNetworkWired },
              { key: 'networking', label: 'Networking Hub', icon: FaUsers },
              { key: 'opportunities', label: 'Opportunities', icon: FaHandshake },
              { key: 'analytics', label: 'Analytics', icon: FaChartLine }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  selectedTab === key
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="text-lg" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'networking' && renderNetworkingTab()}
        {selectedTab === 'opportunities' && renderOpportunitiesTab()}
        {selectedTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
}