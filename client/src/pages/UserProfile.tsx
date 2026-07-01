import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Share2, MessageCircle, UserPlus, MoreVertical, Trophy, TrendingUp, Heart, MessageSquare } from "lucide-react";

interface UserStats {
  followers: number;
  following: number;
  posts: number;
  earnings: number;
  reputation: number;
}

interface Activity {
  id: string;
  type: "post" | "stake" | "purchase" | "achievement";
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
}

const mockUser = {
  id: "user_123",
  name: "Skyler Blue",
  username: "@skylerblue333",
  avatar: "https://via.placeholder.com/120",
  bio: "Software Engineer | AI Architect | Web3 Builder. Building the future of social finance.",
  location: "San Francisco, CA",
  website: "https://skycoin4444.com",
  verified: true,
  stats: {
    followers: 12543,
    following: 892,
    posts: 456,
    earnings: 15234.50,
    reputation: 4.8,
  },
  badges: ["Early Adopter", "Top Contributor", "Verified Creator", "Mining Expert"],
};

const mockActivity: Activity[] = [
  {
    id: "1",
    type: "post",
    description: "Posted about Web3 trading strategies",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    id: "2",
    type: "stake",
    description: "Staked 1000 SKY4 tokens",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "3",
    type: "achievement",
    description: "Earned 'Mining Expert' badge",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    icon: <Trophy className="w-4 h-4" />,
  },
];

export function UserProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed" : "Following!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="border-slate-700 bg-slate-800/50 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600" />
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-12">
              <Avatar className="w-32 h-32 border-4 border-slate-800">
                <AvatarImage src={mockUser.avatar} />
                <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-white">{mockUser.name}</h1>
                  {mockUser.verified && (
                    <Badge className="bg-blue-600">✓ Verified</Badge>
                  )}
                </div>
                <p className="text-purple-400 mb-2">{mockUser.username}</p>
                <p className="text-slate-300 mb-3">{mockUser.bio}</p>
                <div className="flex gap-4 text-sm text-slate-400 mb-4">
                  <span>📍 {mockUser.location}</span>
                  <span>🔗 {mockUser.website}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleFollow}
                    className={isFollowing ? "bg-slate-700 hover:bg-slate-600" : "bg-purple-600 hover:bg-purple-700"}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline" className="border-slate-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" className="border-slate-600">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" className="text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Followers", value: mockUser.stats.followers.toLocaleString() },
            { label: "Following", value: mockUser.stats.following.toLocaleString() },
            { label: "Posts", value: mockUser.stats.posts.toLocaleString() },
            { label: "Earnings", value: `$${mockUser.stats.earnings.toLocaleString()}` },
            { label: "Reputation", value: `${mockUser.stats.reputation}/5.0` },
          ].map((stat, i) => (
            <Card key={i} className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-purple-400 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Badges */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">Badges & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockUser.badges.map((badge, i) => (
                <div key={i} className="p-4 bg-slate-700/50 rounded-lg text-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">{badge}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="border-slate-700 bg-slate-800/50">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-slate-700 border-b border-slate-700">
              <TabsTrigger value="posts" className="text-slate-300">Posts</TabsTrigger>
              <TabsTrigger value="activity" className="text-slate-300">Activity</TabsTrigger>
              <TabsTrigger value="followers" className="text-slate-300">Followers</TabsTrigger>
              <TabsTrigger value="likes" className="text-slate-300">Likes</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-white mb-2">Post #{i}: Discussing Web3 innovations...</p>
                    <div className="flex gap-4 text-sm text-slate-400">
                      <span>❤️ 234 likes</span>
                      <span>💬 45 comments</span>
                      <span>🔄 12 shares</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="p-6">
              <div className="space-y-4">
                {mockActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-purple-400">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-white">{activity.description}</p>
                      <p className="text-xs text-slate-400">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="followers" className="p-6">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">User {i}</p>
                        <p className="text-xs text-slate-400">@user{i}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-slate-600">Follow</Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="likes" className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-white mb-2">Liked: Post about cryptocurrency trends</p>
                    <p className="text-xs text-slate-400">2 hours ago</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default UserProfile;
