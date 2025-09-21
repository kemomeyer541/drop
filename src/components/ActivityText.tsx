import React from 'react';
import { UserLink } from './UserLink';

interface EntityUser {
  name: string;
  avatar: string;
  color: string;
}

interface CollectibleData {
  name: string;
  serial: string;
  thumbnail: string;
}

export interface ActivityTextProps {
  text: string;
  actorUser?: EntityUser;
  targetUser?: EntityUser;
  stickerData?: CollectibleData;
  cardData?: CollectibleData;
  challengeName?: string;
  onUserClick?: (user: string, handle: string, avatar: string, color: string, event: React.MouseEvent) => void;
  onCollectibleClick?: (collectible: CollectibleData, event: React.MouseEvent) => void;
  onChallengeClick?: (challengeName: string, event: React.MouseEvent) => void;
  onHashtagClick?: (hashtag: string, event: React.MouseEvent) => void;
  onCtaClick?: (cta: string, event: React.MouseEvent) => void;
}

interface TextToken {
  type: 'text' | 'user' | 'mention' | 'hashtag' | 'collectible' | 'challenge' | 'cta';
  content: string;
  data?: any;
}

// Enhanced entity detection patterns
const PATTERNS = {
  // @mentions - @ followed by alphanumeric and underscore, no trailing punctuation
  mention: /@([a-zA-Z0-9_]+)(?![a-zA-Z0-9_])/g,
  // #hashtags - # followed by letters, numbers, underscore, no trailing punctuation
  hashtag: /#([a-zA-Z0-9_]+)(?![a-zA-Z0-9_])/g,
  // CTA buttons - specific action phrases
  cta: /(Watch Stream|View Auction|Leave Feedback|Join Challenge|Start Collab|Buy Now)/gi,
  // Known collectible names in quotes or specific format
  collectible: /"([^"]+)"|'([^']+)'|\b([A-Z][a-zA-Z\s]+(?:Sticker|Card|NFT))\b/g,
  // Challenge names in quotes or specific format  
  challenge: /"([^"]+Challenge)"|'([^']+Challenge)'|\b([A-Z][a-zA-Z\s]+Challenge)\b/g,
};

// Known usernames from activity context - only these are clickable as users
const getKnownUsers = (actorUser?: EntityUser, targetUser?: EntityUser): Set<string> => {
  const knownUsers = new Set<string>();
  if (actorUser) knownUsers.add(actorUser.name);
  if (targetUser) knownUsers.add(targetUser.name);
  return knownUsers;
};

// Tokenize text into entities and plain text
const tokenizeActivityText = (
  text: string, 
  actorUser?: EntityUser, 
  targetUser?: EntityUser,
  stickerData?: CollectibleData,
  cardData?: CollectibleData,
  challengeName?: string
): TextToken[] => {
  const tokens: TextToken[] = [];
  const knownUsers = getKnownUsers(actorUser, targetUser);
  
  let currentIndex = 0;
  const matches: Array<{ start: number; end: number; token: TextToken }> = [];

  // Find all @mentions
  let match;
  const mentionRegex = new RegExp(PATTERNS.mention);
  while ((match = mentionRegex.exec(text)) !== null) {
    const username = match[1];
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      token: {
        type: 'mention',
        content: match[0],
        data: { username, handle: `@${username}` }
      }
    });
  }

  // Find all #hashtags
  const hashtagRegex = new RegExp(PATTERNS.hashtag);
  while ((match = hashtagRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      token: {
        type: 'hashtag',
        content: match[0],
        data: { hashtag: match[1] }
      }
    });
  }

  // Find CTA buttons
  const ctaRegex = new RegExp(PATTERNS.cta);
  while ((match = ctaRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      token: {
        type: 'cta',
        content: match[0],
        data: { cta: match[0] }
      }
    });
  }

  // Find collectible references (if we have collectible data)
  if (stickerData || cardData) {
    const collectibleData = stickerData || cardData;
    if (collectibleData) {
      // Look for the collectible name in the text
      const collectibleNameRegex = new RegExp(`\\b${collectibleData.name}\\b`, 'gi');
      while ((match = collectibleNameRegex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          token: {
            type: 'collectible',
            content: match[0],
            data: collectibleData
          }
        });
      }
    }
  }

  // Find challenge references (if we have challenge name)
  if (challengeName) {
    const challengeRegex = new RegExp(`\\b${challengeName}\\b`, 'gi');
    while ((match = challengeRegex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        token: {
          type: 'challenge',
          content: match[0],
          data: { challengeName }
        }
      });
    }
  }

  // Find known user references (actor and target users only)
  knownUsers.forEach(username => {
    const userRegex = new RegExp(`\\b${username}\\b(?!@)`, 'gi'); // Don't match if already part of @mention
    while ((match = userRegex.exec(text)) !== null) {
      // Don't add if it overlaps with existing matches
      const overlaps = matches.some(m => 
        (match.index >= m.start && match.index < m.end) ||
        (match.index + match[0].length > m.start && match.index + match[0].length <= m.end)
      );
      
      if (!overlaps) {
        const userData = username === actorUser?.name ? actorUser : targetUser;
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          token: {
            type: 'user',
            content: match[0],
            data: userData
          }
        });
      }
    }
  });

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Build tokens array with text and entities
  matches.forEach(match => {
    // Add text before the match
    if (currentIndex < match.start) {
      const textContent = text.substring(currentIndex, match.start);
      if (textContent) {
        tokens.push({
          type: 'text',
          content: textContent
        });
      }
    }
    
    // Add the entity token
    tokens.push(match.token);
    currentIndex = match.end;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    const textContent = text.substring(currentIndex);
    if (textContent) {
      tokens.push({
        type: 'text',
        content: textContent
      });
    }
  }

  return tokens;
};

export const ActivityText: React.FC<ActivityTextProps> = ({
  text,
  actorUser,
  targetUser,
  stickerData,
  cardData,
  challengeName,
  onUserClick,
  onCollectibleClick,
  onChallengeClick,
  onHashtagClick,
  onCtaClick
}) => {
  const tokens = tokenizeActivityText(text, actorUser, targetUser, stickerData, cardData, challengeName);

  const handleEntityClick = (token: TextToken, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent parent card clicks
    
    switch (token.type) {
      case 'user':
        if (onUserClick && token.data) {
          onUserClick(token.data.name, `@${token.data.name.toLowerCase()}`, token.data.avatar, token.data.color, event);
        }
        break;
      case 'mention':
        if (onUserClick && token.data) {
          // For mentions, we need to create user data or look it up
          const userData = { 
            name: token.data.username, 
            avatar: token.data.username.slice(0, 2).toUpperCase(), 
            color: '#6B7280' 
          };
          onUserClick(userData.name, token.data.handle, userData.avatar, userData.color, event);
        }
        break;
      case 'hashtag':
        if (onHashtagClick && token.data) {
          onHashtagClick(token.data.hashtag, event);
        }
        break;
      case 'collectible':
        if (onCollectibleClick && token.data) {
          onCollectibleClick(token.data, event);
        }
        break;
      case 'challenge':
        if (onChallengeClick && token.data) {
          onChallengeClick(token.data.challengeName, event);
        }
        break;
      case 'cta':
        if (onCtaClick && token.data) {
          onCtaClick(token.data.cta, event);
        }
        break;
    }
  };

  return (
    <>
      {tokens.map((token, index) => {
        switch (token.type) {
          case 'text':
            return (
              <span 
                key={index}
                style={{ pointerEvents: 'none', cursor: 'default' }}
              >
                {token.content}
              </span>
            );

          case 'user':
            return (
              <UserLink
                key={index}
                userId={`user-${token.data.name}`}
                username={token.data.name}
                handle={`@${token.data.name.toLowerCase()}`}
                style={{ 
                  color: token.data.color, 
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                data-entity="user"
                role="link"
                aria-label={`View ${token.data.name}'s profile`}
                onClick={(e) => handleEntityClick(token, e)}
              />
            );

          case 'mention':
            return (
              <span
                key={index}
                data-entity="mention"
                role="link"
                tabIndex={0}
                aria-label={`View ${token.data.username}'s profile`}
                style={{
                  color: '#60A5FA',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                onClick={(e) => handleEntityClick(token, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEntityClick(token, e as any);
                  }
                }}
              >
                {token.content}
              </span>
            );

          case 'hashtag':
            return (
              <span
                key={index}
                data-entity="hashtag"
                role="link"
                tabIndex={0}
                aria-label={`Filter by ${token.data.hashtag}`}
                style={{
                  color: '#10B981',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded"
                onClick={(e) => handleEntityClick(token, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEntityClick(token, e as any);
                  }
                }}
              >
                {token.content}
              </span>
            );

          case 'collectible':
            return (
              <span
                key={index}
                data-entity="collectible"
                role="button"
                tabIndex={0}
                aria-label={`View ${token.data.name} collectible`}
                title={token.data.name} // Add tooltip for full name
                style={{
                  color: '#F59E0B',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '4px',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  textDecoration: 'none',
                  pointerEvents: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px'
                }}
                className="hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                onClick={(e) => handleEntityClick(token, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEntityClick(token, e as any);
                  }
                }}
              >
                {token.content}
              </span>
            );

          case 'challenge':
            return (
              <span
                key={index}
                data-entity="challenge"
                role="button"
                tabIndex={0}
                aria-label={`View ${token.data.challengeName} challenge`}
                style={{
                  color: '#8B5CF6',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '4px',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  textDecoration: 'none',
                  pointerEvents: 'auto'
                }}
                className="hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                onClick={(e) => handleEntityClick(token, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEntityClick(token, e as any);
                  }
                }}
              >
                {token.content}
              </span>
            );

          case 'cta':
            return (
              <button
                key={index}
                data-entity="cta"
                aria-label={token.data.cta}
                style={{
                  color: '#EF4444',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '4px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  textDecoration: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit'
                }}
                className="hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-150"
                onClick={(e) => handleEntityClick(token, e)}
              >
                {token.content}
              </button>
            );

          default:
            return (
              <span key={index} style={{ pointerEvents: 'none' }}>
                {token.content}
              </span>
            );
        }
      })}
    </>
  );
};

export default ActivityText;