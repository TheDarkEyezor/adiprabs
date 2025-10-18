'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitCommit, GitBranch, GitPullRequest, Star, AlertCircle } from 'lucide-react';

interface GitHubEvent {
  id: string;
  type: string;
  repo: string;
  created_at: string;
  payload: {
    commits?: Array<{ message: string }>;
    ref?: string;
    action?: string;
  };
}

interface GitHubActivityProps {
  username: string;
}

const GitHubActivity: React.FC<GitHubActivityProps> = ({ username }) => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/events/public`);
        if (!response.ok) throw new Error('Failed to fetch GitHub activity');
        const data = await response.json();
        setEvents(data.slice(0, 5)); // Get last 5 events
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchGitHubActivity();
  }, [username]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit className="w-4 h-4" />;
      case 'CreateEvent':
        return <GitBranch className="w-4 h-4" />;
      case 'PullRequestEvent':
        return <GitPullRequest className="w-4 h-4" />;
      case 'WatchEvent':
        return <Star className="w-4 h-4" />;
      default:
        return <GitCommit className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return '#52B788';
      case 'CreateEvent':
        return '#4A90E2';
      case 'PullRequestEvent':
        return '#8B5CF6';
      case 'WatchEvent':
        return '#FEC601';
      default:
        return '#FF6B6B';
    }
  };

  const getEventDescription = (event: GitHubEvent) => {
    const repoName = event.repo.split('/')[1];
    switch (event.type) {
      case 'PushEvent':
        const commitCount = event.payload.commits?.length || 0;
        return `Pushed ${commitCount} commit${commitCount !== 1 ? 's' : ''} to ${repoName}`;
      case 'CreateEvent':
        return `Created ${event.payload.ref || 'branch'} in ${repoName}`;
      case 'PullRequestEvent':
        return `${event.payload.action} pull request in ${repoName}`;
      case 'WatchEvent':
        return `Starred ${repoName}`;
      default:
        return `Activity in ${repoName}`;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-center h-64">
          <motion.div
            className="w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 text-[#FF6B6B]">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">GitHub Activity</h3>
          <p className="text-white/60 text-sm">Recent contributions</p>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${getEventColor(event.type)}20` }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div style={{ color: getEventColor(event.type) }}>
                {getEventIcon(event.type)}
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium mb-1">
                {getEventDescription(event)}
              </p>
              <p className="text-white/50 text-xs">{getTimeAgo(event.created_at)}</p>
            </div>

            {/* Activity pulse indicator */}
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getEventColor(event.type) }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* View more link */}
      <motion.a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-4 text-center text-sm text-white/60 hover:text-white transition-colors"
        whileHover={{ scale: 1.05 }}
      >
        View all activity →
      </motion.a>
    </div>
  );
};

export default GitHubActivity;
