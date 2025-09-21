import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Star,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

interface NewsPageProps {
  onNavigate: (page: string) => void;
}

export function NewsPage({ onNavigate }: NewsPageProps) {
  const [activeTab, setActiveTab] = useState("all");

  // Info articles with fuller content
  const infoArticles = [
    {
      id: 1,
      title: "DropSource Kickstarter Campaign Goes Live!",
      excerpt:
        "Join us on Kickstarter to fund the community-owned creator hub. Backers get early access features and limited edition collectibles.",
      emoji: "🚀",
      author: "Drop Source Team",
      authorAvatar: "🏢",
      publishedAt: "2 hours ago",
      category: "Kickstarter",
      likes: 1234,
      comments: 234,
      featured: true,
      tags: ["kickstarter"],
    },
    {
      id: 2,
      title:
        "Introducing DropSource Stickers & Card Creation System",
      excerpt:
        "Create unique stickers and collectible cards from your work, trade with friends, and showcase your journey. Here's how it works and what's coming next.",
      emoji: "🎨",
      author: "Drop Source Team",
      authorAvatar: "✨",
      publishedAt: "6 hours ago",
      category: "Features",
      likes: 892,
      comments: 156,
      featured: false,
      tags: ["features"],
    },
    {
      id: 3,
      title: "How to Connect with the DropSource Community",
      excerpt:
        "Find collaborators, join creator groups, and take part in community challenges. A quick guide to meaningful connections on DropSource.",
      emoji: "🫂",
      author: "Drop Source Team",
      authorAvatar: "💙",
      publishedAt: "8 hours ago",
      category: "Community",
      likes: 567,
      comments: 89,
      featured: false,
      tags: ["community"],
    },
    {
      id: 4,
      title: "Platform Update: AI Collaboration Tools",
      excerpt:
        "New AI assistance for brainstorming, versioning, and feedback so teams can move from idea to drop faster.",
      emoji: "🤖",
      author: "Drop Source Team",
      authorAvatar: "⚙️",
      publishedAt: "1 day ago",
      category: "Updates",
      likes: 723,
      comments: 134,
      featured: false,
      tags: ["updates"],
    },
    {
      id: 5,
      title: "Getting Started Guide for New Users",
      excerpt:
        "Everything you need to know on day one—profiles, projects, stickers/cards, and posting to Creator News.",
      emoji: "📝",
      author: "Drop Source Team",
      authorAvatar: "🎓",
      publishedAt: "2 days ago",
      category: "Tutorials",
      likes: 445,
      comments: 78,
      featured: false,
      tags: ["tutorials"],
    },
  ];

  // Creator News with fuller content
  const creatorNews = [
    {
      id: 1,
      author: "PixelSmith",
      avatar: "🎨",
      specialty: "Digital Artist",
      title: "Indie Artist Hits 1,000 Sticker Sales",
      excerpt:
        "A milestone for creator-led commerce: PixelSmith's neon sticker set crossed 1K sales with community promos and Spotlight boosts. Tips inside.",
      timeAgo: "3 hours ago",
      reactions: 312,
      comments: 45,
      isSpotlight: true,
      category: "Achievement",
    },
    {
      id: 2,
      author: "VerseWriter",
      avatar: "📝",
      specialty: "Poet / Storyteller",
      title: "How One Creator Built a Fanbase Overnight",
      excerpt:
        "A single heartfelt story, a clear call-to-action, and cross-posting to Creator News pushed VerseWriter to the top of the week's trends.",
      timeAgo: "5 hours ago",
      reactions: 198,
      comments: 32,
      isSpotlight: false,
      category: "Success Story",
    },
    {
      id: 3,
      author: "CodeCrafter",
      avatar: "💻",
      specialty: "Indie Developer",
      title: "Community Raises $2K for Local Studio",
      excerpt:
        "Creators pooled sales and tips to help CodeCrafter finish a small recording/streaming setup—showing how DropSource rallies behind its own.",
      timeAgo: "8 hours ago",
      reactions: 456,
      comments: 67,
      isSpotlight: true,
      category: "Community Support",
    },
    {
      id: 4,
      author: "SnackLord",
      avatar: "🍿",
      specialty: "Beat Creator",
      title:
        "This Beat Is Basically Just Microwave Sounds (and it slaps)",
      excerpt:
        "A playful experiment turned into a community earworm—proof that creativity > gear when the idea hits.",
      timeAgo: "2 hours ago",
      reactions: 89,
      comments: 23,
      isSpotlight: false,
      category: "Experimental",
    },
    {
      id: 5,
      author: "MemeDealer",
      avatar: "😂",
      specialty: "Content Creator",
      title: "Sticker War: Cat vs. Frog Edition",
      excerpt:
        "Two sticker sets entered, one meme emerged victorious. Voters crowned a champion and unlocked a limited badge.",
      timeAgo: "6 hours ago",
      reactions: 156,
      comments: 38,
      isSpotlight: false,
      category: "Community Event",
    },
    {
      id: 6,
      author: "BugHunter",
      avatar: "🐛",
      specialty: "QA Tester",
      title: "When You Upload the Wrong File and Still Trend",
      excerpt:
        "A mislabeled voice memo accidentally posted, the community laughed, then rallied—turning a mistake into a viral moment.",
      timeAgo: "1 day ago",
      reactions: 234,
      comments: 56,
      isSpotlight: false,
      category: "Community Love",
    },
  ];

  // Golden (Hall of Fame) articles - Top performing content
  const goldenArticles = [
    {
      id: 1,
      title: "DropSource Community Hits 50K Active Creators",
      excerpt:
        "A milestone celebration of our thriving creative community. From bedroom producers to chart-toppers, this is what collaborative creation looks like.",
      emoji: "🏆",
      author: "Drop Source Team",
      authorAvatar: "👑",
      publishedAt: "1 week ago",
      category: "Hall of Fame",
      likes: 5670,
      comments: 892,
      featured: false,
      tags: ["golden"],
      isGolden: true,
    },
    {
      id: 2,
      title:
        "The Beat That Changed Everything: Community Success Story",
      excerpt:
        "How a simple loop shared on DropSource became a worldwide hit, featuring three different creators and five million streams.",
      emoji: "🎵",
      author: "Drop Source Team",
      authorAvatar: "🌟",
      publishedAt: "2 weeks ago",
      category: "Legend",
      likes: 4320,
      comments: 567,
      featured: false,
      tags: ["golden"],
      isGolden: true,
    },
    {
      id: 3,
      title: "Creator of the Year: The PixelSmith Journey",
      excerpt:
        "From first upload to platform superstar—the inspiring story of how one artist built a creative empire through community collaboration.",
      emoji: "🎨",
      author: "Drop Source Team",
      authorAvatar: "🏅",
      publishedAt: "3 weeks ago",
      category: "Achievement",
      likes: 3890,
      comments: 445,
      featured: false,
      tags: ["golden"],
      isGolden: true,
    },
    {
      id: 4,
      title: "Most Remixed Track Record Broken",
      excerpt:
        "A single DropSource upload spawned over 1,000 community remixes, creating the largest collaborative music project in platform history.",
      emoji: "🔥",
      author: "Drop Source Team",
      authorAvatar: "📈",
      publishedAt: "1 month ago",
      category: "Record",
      likes: 7200,
      comments: 1156,
      featured: false,
      tags: ["golden"],
      isGolden: true,
    },
  ];

  const getFilteredArticles = () => {
    if (activeTab === "all") return infoArticles;
    if (activeTab === "golden") return goldenArticles;
    return infoArticles.filter((article) =>
      article.tags.includes(activeTab),
    );
  };

  const featuredArticle = infoArticles.find(
    (article) => article.featured,
  );

  // Universal card component used for both info and creator content
  const NewsCard = ({
    item,
    isCreator = false,
    isGolden = false,
  }: {
    item: any;
    isCreator?: boolean;
    isGolden?: boolean;
  }) => (
    <div
      className="rounded transition-all duration-200"
      style={{
        backgroundColor: "var(--ds-card)",
        border: item.isSpotlight
          ? "1px solid #FFD700"
          : "1px solid var(--ds-border)",
        padding: "20px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 8px 32px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* 1. Category Pills Row - First row with category pills */}
      <div className="flex items-center gap-2 mb-3">
        {/* Category pill */}
        <div
          className={`news-category-pill news-category-${item.category.toLowerCase()}`}
          title={item.category}
        >
          {item.category}
        </div>

        {/* Other badges */}
        {item.featured && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{
              background:
                "linear-gradient(220deg, #FFD700 0%, #FFB347 100%)",
              color: "var(--ds-bg)",
              fontWeight: "600",
            }}
          >
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        {item.isSpotlight && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{
              background:
                "linear-gradient(220deg, #FFD700 0%, #FFB347 100%)",
              color: "var(--ds-bg)",
              fontWeight: "600",
            }}
          >
            <Star className="w-3 h-3" />
            Spotlight
          </div>
        )}
        {item.isGolden && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{
              background:
                "linear-gradient(220deg, #FFB039 0%, #FFD369 100%)",
              color: "var(--ds-bg)",
              fontWeight: "600",
            }}
          >
            <Star className="w-3 h-3" />
            Hall of Fame
          </div>
        )}
      </div>

      {/* 2. Title Row with emoji inline (not behind chips) */}
      <div className="flex items-start gap-3 mb-3">
        {(item.emoji || item.avatar) && (
          <div className="text-2xl flex-shrink-0">
            {item.emoji || item.avatar}
          </div>
        )}
        <div className="flex-1">
          <h3
            style={{
              fontSize: "var(--text-md)",
              fontWeight: "600",
              color: "var(--ds-text)",
              lineHeight: "1.4",
              marginBottom: "8px",
            }}
          >
            {isCreator
              ? `${item.author} — ${item.title}`
              : item.title}
          </h3>
          {isCreator && (
            <div className="flex items-center gap-2 mb-2">
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--ds-text-subtle)",
                }}
              >
                {item.specialty}
              </span>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--ds-text-subtle)",
                }}
              >
                • {item.timeAgo}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Summary (2-3 lines) */}
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--ds-text-subtle)",
          lineHeight: "1.5",
          marginBottom: "16px",
        }}
      >
        {item.excerpt}
      </p>

      {/* 4. Meta Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: "rgba(15, 21, 32, 0.8)" }}
          >
            {isCreator ? item.avatar : item.authorAvatar}
          </div>
          <div>
            <p
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "500",
                color: "var(--ds-text)",
              }}
            >
              {isCreator ? item.author : item.author}
            </p>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--ds-text-subtle)",
              }}
            >
              {isCreator ? item.timeAgo : item.publishedAt}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 p-1 rounded">
            <Heart
              className="w-3 h-3"
              style={{
                color: item.isGolden
                  ? "#FFB039"
                  : item.isSpotlight
                    ? "#FFD700"
                    : isCreator && activeTab === "creator"
                      ? "var(--ds-blue)"
                      : "var(--ds-blue)",
              }}
            />
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: item.isGolden
                  ? "#FFB039"
                  : item.isSpotlight
                    ? "#FFD700"
                    : isCreator && activeTab === "creator"
                      ? "var(--ds-blue)"
                      : "var(--ds-blue)",
                fontWeight: "500",
              }}
            >
              {isCreator ? item.reactions : item.likes}
            </span>
          </button>
          <button className="flex items-center gap-1 p-1 rounded">
            <MessageCircle
              className="w-3 h-3"
              style={{ color: "var(--ds-text-subtle)" }}
            />
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--ds-text-subtle)",
              }}
            >
              {item.comments}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        background: "var(--ds-bg)",
        color: "var(--ds-text)",
      }}
    >
      {/* Clean Header */}
      <header
        className="flex items-center justify-between"
        style={{
          background: "rgba(15, 21, 32, 0.95)",
          borderBottom: "1px solid var(--ds-border)",
          padding:
            "calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 6)",
          backdropFilter: "blur(12px)",
          zIndex: 20,
        }}
      >
        {/* Left: Back Button */}
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onNavigate("community")}
                className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-150"
                style={{
                  color: "var(--ds-text)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--ds-blue-soft)";
                  e.currentTarget.style.color =
                    "var(--ds-blue)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "transparent";
                  e.currentTarget.style.color =
                    "var(--ds-text)";
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Back to Community Hub
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Center: Spacer - Header moved to ContentFrame */}
        <div className="flex-1"></div>

        {/* Right: Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{
                color: "var(--ds-text-subtle)",
                zIndex: 1,
              }}
            />
            <Input
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2"
              style={{
                width: "200px",
                color: "var(--ds-text)",
                backgroundColor: "var(--ds-card)",
                border: "1px solid var(--ds-border)",
                borderRadius: "4px",
                paddingLeft: "40px",
              }}
            />
          </div>
          <button
            className="p-2 rounded transition-all duration-150"
            style={{
              color: "var(--ds-text-subtle)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--ds-blue-soft)";
              e.currentTarget.style.color = "var(--ds-blue)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "transparent";
              e.currentTarget.style.color =
                "var(--ds-text-subtle)";
            }}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ContentFrame - Fixed width 1120px with center alignment */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Align horizontal centers
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        {/* ContentFrame - Fixed width frame, centered */}
        <div
          style={{
            width: "1120px", // Fixed width
            paddingLeft: "24px", // Equal padding
            paddingRight: "24px",
            paddingTop: "24px",
            paddingBottom: "24px",
            position: "relative", // For debug guide
          }}
        >
          {/* Drop NEWS Header - Moved inside ContentFrame, horizontally centered */}
          <div className="text-center mb-6">
            <h1
              style={{
                color: "var(--ds-blue)",
                fontSize: "var(--text-xl)",
                fontWeight: "600",
              }}
            >
              Drop NEWS
            </h1>
            <p
              style={{
                color: "var(--ds-text-subtle)",
                fontSize: "var(--text-sm)",
                marginTop: "4px",
              }}
            >
              Learn about DropSource, Kickstarter progress &
              community updates
            </p>
          </div>

          {/* Tab Row */}
          <div
            className="flex items-center gap-6 justify-center"
            style={{ marginBottom: "24px" }}
          >
            {[
              { id: "all", label: "All News" },
              { id: "creator", label: "Creator" },
              { id: "golden", label: "Golden" },
              { id: "kickstarter", label: "Kickstarter" },
              { id: "features", label: "Features" },
              { id: "community", label: "Community" },
              { id: "tutorials", label: "Tutorials" },
              { id: "updates", label: "Updates" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded transition-all duration-150"
                style={{
                  // Creator tab outline: gold OUTLINE when All News active, blue when Creator active
                  backgroundColor:
                    activeTab === tab.id
                      ? tab.id === "golden"
                        ? "rgba(255, 176, 57, 0.16)"
                        : tab.id === "creator"
                          ? "rgba(99,179,255,0.16)"
                          : "rgba(99,179,255,0.16)"
                      : "transparent",
                  color:
                    activeTab === tab.id
                      ? tab.id === "golden"
                        ? "#FFB039"
                        : tab.id === "creator"
                          ? "#63B3FF"
                          : "#63B3FF"
                      : tab.id === "creator" &&
                          activeTab === "all"
                        ? "#FFB039"
                        : "var(--ds-text-subtle)",
                  border:
                    activeTab === tab.id
                      ? "1px solid " +
                        (tab.id === "golden"
                          ? "#FFB039"
                          : tab.id === "creator"
                            ? "#63B3FF"
                            : "#63B3FF")
                      : tab.id === "creator" &&
                          activeTab === "all"
                        ? "2px solid #FFB039"
                        : "1px solid transparent",
                  fontSize: "var(--text-sm)",
                  fontWeight:
                    tab.id === "creator" && activeTab === "all"
                      ? "500"
                      : "400",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CardsGrid - CSS Grid Layout with 2 Columns */}
          <div
            style={{
              display: "grid", // Use CSS Grid Behavior
              gridTemplateColumns: "repeat(2, 1fr)", // Columns: 2 (equal width)
              gap: "24px", // Gap: 24px horizontal & vertical
              width: "1096px", // Fixed width to contain exactly 2 columns + gap (536 + 24 + 536)
              margin: "0 auto", // Center the grid
              justifyItems: "center", // Center items within grid cells for balanced rows
              // No manual X value, no negative margins, no constraints left/right
            }}
          >
            {activeTab === "creator" ? (
              /* Creator Content - Fill container within grid cells */
              creatorNews.map((news) => (
                <div
                  key={news.id}
                  style={{
                    width: "100%",
                    height: "fit-content",
                  }}
                >
                  <NewsCard item={news} isCreator={true} />
                </div>
              ))
            ) : activeTab === "golden" ? (
              /* Golden Content - Fill container within grid cells */
              goldenArticles.map((article) => (
                <div
                  key={article.id}
                  style={{
                    width: "100%",
                    height: "fit-content",
                  }}
                >
                  <NewsCard
                    item={article}
                    isCreator={false}
                    isGolden={true}
                  />
                </div>
              ))
            ) : (
              /* Info Content - Featured article and regular cards fill grid cells */
              <>
                {/* Featured Article - Fill container within grid cell */}
                {featuredArticle && activeTab === "all" && (
                  <div
                    className="overflow-hidden rounded relative"
                    style={{
                      backgroundColor: "var(--ds-card)",
                      border: "1px solid var(--ds-border)",
                      padding: "32px",
                      width: "100%", // Fill container within grid cell
                      height: "fit-content",
                    }}
                  >
                    {/* Chip row for featured */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="flex items-center gap-1 px-3 py-1 rounded"
                        style={{
                          background:
                            "linear-gradient(220deg, #FFD700 0%, #FFB347 100%)",
                          color: "var(--ds-bg)",
                          fontSize: "var(--text-xs)",
                          fontWeight: "600",
                        }}
                      >
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                      <Badge
                        variant="outline"
                        style={{
                          color: "var(--ds-blue)",
                          borderColor: "var(--ds-blue)",
                          backgroundColor:
                            "var(--ds-blue-soft)",
                        }}
                      >
                        {featuredArticle.category}
                      </Badge>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="text-6xl">
                        {featuredArticle.emoji}
                      </div>
                      <div className="flex-1">
                        <h2
                          style={{
                            fontSize: "var(--text-xl)",
                            fontWeight: "600",
                            color: "var(--ds-text)",
                            marginBottom: "12px",
                          }}
                        >
                          {featuredArticle.title}
                        </h2>
                        <p
                          style={{
                            fontSize: "var(--text-base)",
                            color: "var(--ds-text-subtle)",
                            lineHeight: "1.6",
                            marginBottom: "16px",
                          }}
                        >
                          {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  "rgba(15, 21, 32, 0.8)",
                              }}
                            >
                              {featuredArticle.authorAvatar}
                            </div>
                            <div>
                              <p
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "500",
                                  color: "var(--ds-text)",
                                }}
                              >
                                {featuredArticle.author}
                              </p>
                              <p
                                style={{
                                  fontSize: "var(--text-xs)",
                                  color:
                                    "var(--ds-text-subtle)",
                                }}
                              >
                                {featuredArticle.publishedAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="flex items-center gap-1 p-2 rounded">
                              <Heart
                                className="w-4 h-4"
                                style={{
                                  color: "var(--ds-blue)",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: "var(--text-xs)",
                                  color: "var(--ds-blue)",
                                  fontWeight: "500",
                                }}
                              >
                                {featuredArticle.likes}
                              </span>
                            </button>
                            <button className="flex items-center gap-1 p-2 rounded">
                              <MessageCircle
                                className="w-4 h-4"
                                style={{
                                  color:
                                    "var(--ds-text-subtle)",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: "var(--text-xs)",
                                  color:
                                    "var(--ds-text-subtle)",
                                }}
                              >
                                {featuredArticle.comments}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Articles - Fill container within grid cells */}
                {getFilteredArticles()
                  .filter(
                    (article) =>
                      !article.featured || activeTab !== "all",
                  )
                  .map((article) => (
                    <div
                      key={article.id}
                      style={{
                        width: "100%",
                        height: "fit-content",
                      }}
                    >
                      <NewsCard
                        item={article}
                        isCreator={false}
                      />
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}