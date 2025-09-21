import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Copy, Users, UserPlus, Crown, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Collaborator {
  id: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'online' | 'offline';
  avatar?: string;
}

export function BuddySystemPanel() {
  const [inviteLink] = useState('https://dropsource.app/invite/abc123xyz');
  const [collaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Alex Rivers',
      role: 'owner',
      status: 'online',
    },
    {
      id: '2', 
      name: 'Jordan Blake',
      role: 'editor',
      status: 'online',
    },
    {
      id: '3',
      name: 'Casey Morgan',
      role: 'viewer',
      status: 'offline',
    },
  ]);

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3" />;
      case 'editor': return <UserPlus className="w-3 h-3" />;
      case 'viewer': return <Eye className="w-3 h-3" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'editor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewer': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="p-2 rounded-lg dropsource-gradient">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="dropsource-text-primary font-medium">Collaboration</h3>
          <p className="text-sm dropsource-text-secondary">Invite others to write together</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Invite Section */}
        <div className="space-y-3">
        <div>
          <label className="block text-sm dropsource-text-secondary mb-2">
            Share Invite Link
          </label>
          <div className="flex gap-2">
            <Input
              value={inviteLink}
              readOnly
              className="flex-1 bg-gray-800/50 border-gray-600 dropsource-text-primary"
            />
            <Button
              onClick={copyInviteLink}
              className="dropsource-gradient hover:dropsource-glow-blue"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs dropsource-text-secondary mt-1">
            Anyone with this link can edit this project
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-600 hover:border-cyan-500 dropsource-text-secondary hover:text-cyan-400"
          >
            Generate New Link
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-600 hover:border-cyan-500 dropsource-text-secondary hover:text-cyan-400"
          >
            Set Permissions
          </Button>
        </div>
      </div>

      {/* Active Collaborators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="dropsource-text-primary font-medium">Active Collaborators</h4>
          <Badge variant="outline" className="text-xs dropsource-text-secondary">
            {collaborators.filter(c => c.status === 'online').length} online
          </Badge>
        </div>

        <div className="space-y-2">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {collaborator.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${
                      collaborator.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  />
                </div>
                <div>
                  <p className="dropsource-text-primary text-sm font-medium">
                    {collaborator.name}
                  </p>
                  <p className="text-xs dropsource-text-secondary">
                    {collaborator.status}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className={`text-xs flex items-center gap-1 ${getRoleColor(collaborator.role)}`}
              >
                {getRoleIcon(collaborator.role)}
                {collaborator.role}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Features */}
      <div className="space-y-3">
        <h4 className="dropsource-text-primary font-medium">Real-time Features</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700 text-center">
            <div className="w-6 h-6 mx-auto mb-1 text-green-400">✓</div>
            <p className="text-xs dropsource-text-secondary">Live Cursors</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700 text-center">
            <div className="w-6 h-6 mx-auto mb-1 text-green-400">✓</div>
            <p className="text-xs dropsource-text-secondary">Auto-save</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700 text-center">
            <div className="w-6 h-6 mx-auto mb-1 text-green-400">✓</div>
            <p className="text-xs dropsource-text-secondary">Voice Chat</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700 text-center">
            <div className="w-6 h-6 mx-auto mb-1 text-blue-400">⚡</div>
            <p className="text-xs dropsource-text-secondary">Coming Soon</p>
          </div>
        </div>
      </div>

        {/* Demo Notice */}
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-xs text-cyan-400 text-center">
            🚀 Demo Mode - Real collaboration features coming in full version!
          </p>
        </div>
      </div>
    </div>
  );
}