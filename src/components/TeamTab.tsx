import React, { useState } from 'react';
import { Users, UserPlus, ShieldAlert, Award, Star, Mail } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  contributions: number;
  avatarBg: string;
  status: 'Active' | 'Invited';
}

export default function TeamTab() {
  const [team, setTeam] = useState<TeamMember[]>([
    { name: 'Me (My Profile)', role: 'Lead Frontend & Database Architecture', initials: 'MR', contributions: 75, avatarBg: 'bg-[#6aff88] text-[#002108] border-green-300', status: 'Active' },
    { name: 'Suhail Ahmed', role: 'Backend API Engineer', initials: 'SA', contributions: 50, avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200', status: 'Active' },
    { name: 'Priya Sharma', role: 'Database Schema Lead', initials: 'PS', contributions: 25, avatarBg: 'bg-rose-100 text-rose-800 border-rose-200', status: 'Active' }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend Developer');
  const [invitedStatus, setInvitedStatus] = useState<string | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const nameFromEmail = inviteEmail.split('@')[0];
    const initials = nameFromEmail.substring(0, 2).toUpperCase();

    const colors = [
      'bg-cyan-100 text-cyan-800 border-cyan-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-purple-100 text-purple-800 border-purple-200'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setTeam(prev => [
      ...prev,
      {
        name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        role: inviteRole,
        initials,
        contributions: 0,
        avatarBg: randomColor,
        status: 'Invited'
      }
    ]);

    setInviteEmail('');
    setInvitedStatus(`Invitation successfully sent to ${inviteEmail}!`);
    setTimeout(() => setInvitedStatus(null), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-12rem)]">
      {/* Left side: Teammates Lists */}
      <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0035c5]" />
            <h3 className="font-bold text-gray-800 font-headline">Team Members</h3>
          </div>
          <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded font-bold uppercase tracking-wide">
            Group Project
          </span>
        </div>

        {invitedStatus && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>{invitedStatus}</span>
          </div>
        )}

        <div className="space-y-4">
          {team.map((member, idx) => (
            <div 
              key={idx} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-all gap-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-extrabold text-sm shadow-sm ${member.avatarBg}`}>
                  {member.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-extrabold text-gray-800">{member.name}</h4>
                    {member.status === 'Invited' && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                    {member.contributions > 60 && (
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{member.role}</p>
                </div>
              </div>

              {/* Performance / Contribution ratio */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1 text-xs text-gray-700 font-bold justify-end">
                    <Award className="w-3.5 h-3.5 text-green-600" />
                    <span>{member.contributions} Sprint XP</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Credit Share</span>
                </div>
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0035c5] rounded-full transition-all duration-1000"
                    style={{ width: `${member.contributions}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Invite Peers Card */}
      <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit">
        <h4 className="text-sm font-bold text-gray-800 font-headline mb-4 pb-2 border-b border-gray-100">
          Invite Collaboration Partner
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          Add other student developers to share the workload. Once they accept, they can view, assign, and commit files to the ShopEZ workspace.
        </p>

        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="email"
                required
                placeholder="developer@skillwallet.ai"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0035c5] focus:border-[#0035c5] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Assigned Sprint Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0035c5] focus:border-[#0035c5] outline-none transition-all text-gray-700"
            >
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Specialist">Backend Specialist</option>
              <option value="Database Architect">Database Architect</option>
              <option value="Quality Assurance Analyst">Quality Assurance Analyst</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#0035c5] hover:bg-opacity-90 text-white font-bold text-xs py-2.5 px-4 rounded-lg active:scale-95 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Send Project Invite</span>
          </button>
        </form>
      </div>
    </div>
  );
}
