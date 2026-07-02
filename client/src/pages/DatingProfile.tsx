import React, { useState, useEffect } from 'react';
import { Upload, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/_core/hooks/useAuth';

interface DatingProfile {
  id: number;
  userId: number;
  age: number | null;
  gender: string | null;
  lookingFor: string | null;
  bio: string | null;
  interests: string[];
  photos: string[];
  height: string | null;
  bodyType: string | null;
  ethnicity: string | null;
  religion: string | null;
  education: string | null;
  occupation: string | null;
  smoker: string | null;
  drinker: string | null;
  hasKids: boolean;
  wantsKids: string | null;
  relationshipGoal: string | null;
  profileCompleteness: number;
}

export default function DatingProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DatingProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    lookingFor: '',
    bio: '',
    interests: [] as string[],
    height: '',
    bodyType: '',
    ethnicity: '',
    religion: '',
    education: '',
    occupation: '',
    smoker: '',
    drinker: '',
    hasKids: false,
    wantsKids: '',
    relationshipGoal: '',
  });

  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/dating/profile');
      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          ...data.profile,
          age: data.profile.age ? data.profile.age.toString() : '',
          interests: Array.isArray(data.profile.interests) ? data.profile.interests : [],
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await fetch('/api/dating/profile/suggestions');
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/dating/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setProfile({
          ...profile,
          ...formData,
          age: parseInt(formData.age as string) || 0,
        } as DatingProfile);
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest],
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dating Profile</h1>
          {!editing && (
            <Button onClick={() => setEditing(true)} className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Completeness */}
        {profile && (
          <Card className="mb-6 p-6 bg-gradient-to-r from-pink-100 to-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Profile Completeness</h2>
              <span className="text-2xl font-bold text-pink-600">{profile.profileCompleteness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${profile.profileCompleteness}%` }}
              />
            </div>
          </Card>
        )}

        {/* Suggestions */}
        {!editing && (
          <Button
            onClick={loadSuggestions}
            variant="outline"
            className="mb-6 w-full"
          >
            Get Profile Improvement Suggestions
          </Button>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <Card className="mb-6 p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4">Suggestions to Improve Your Profile</h3>
            <ul className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-blue-500">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => setShowSuggestions(false)}
              variant="ghost"
              className="mt-4"
            >
              Close
            </Button>
          </Card>
        )}

        {/* Profile Form */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  disabled={!editing}
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!editing}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddInterest();
                    }
                  }}
                  disabled={!editing}
                  placeholder="Add an interest..."
                />
                {editing && (
                  <Button onClick={handleAddInterest} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest) => (
                  <div
                    key={interest}
                    className="flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                  >
                    {interest}
                    {editing && (
                      <button
                        onClick={() => handleRemoveInterest(interest)}
                        className="hover:text-pink-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <Input
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  disabled={!editing}
                  placeholder="e.g., 5 feet 10 inches"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                <Input
                  value={formData.bodyType}
                  onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                  disabled={!editing}
                  placeholder="e.g., Athletic"
                />
              </div>
            </div>

            {/* Background */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                <Input
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  disabled={!editing}
                  placeholder="e.g., Bachelors Degree"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <Input
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  disabled={!editing}
                  placeholder="e.g., Software Engineer"
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
                <select
                  value={formData.lookingFor}
                  onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="male">Men</option>
                  <option value="female">Women</option>
                  <option value="everyone">Everyone</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Goal</label>
                <select
                  value={formData.relationshipGoal}
                  onChange={(e) => setFormData({ ...formData, relationshipGoal: e.target.value })}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="casual">Casual</option>
                  <option value="serious">Serious</option>
                  <option value="marriage">Marriage</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                >
                  {saving ? <Spinner className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  Save Profile
                </Button>
                <Button
                  onClick={() => {
                    setEditing(false);
                    setFormData(profile as any);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
