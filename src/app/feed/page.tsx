import Link from "next/link";
import { MessageSquare, ThumbsUp, Share2, Image as ImageIcon, Send, Sparkles, Home, Users, Briefcase, UserCircle } from "lucide-react";

export default function FeedPage() {
  const posts = [
    {
      id: 1,
      author: "Sarah Jenkins",
      role: "Senior Frontend Engineer at TechNova",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random",
      content: "Just published a new article on advanced React patterns using the App Router! It's been an amazing journey learning Turbopack.",
      likes: 124,
      comments: 18,
      time: "2h ago"
    },
    {
      id: 2,
      author: "Michael Chang",
      role: "Tech Recruiter at Nexus Dynamics",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chang&background=random",
      content: "We are actively hiring Full Stack Developers! If you have experience with Next.js and Prisma, I'd love to connect. #hiring #react #node",
      likes: 342,
      comments: 56,
      time: "5h ago"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-slate-900 font-sans">
      {/* Global Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/feed" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block">AuraHire</span>
            </Link>
            
            <div className="flex space-x-2 md:space-x-8">
              <Link href="/feed" className="flex flex-col items-center justify-center text-indigo-600 border-b-2 border-indigo-600 px-2 py-1">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">Home</span>
              </Link>
              <Link href="/network" className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors">
                <Users className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">My Network</span>
              </Link>
              <Link href="/seeker/jobs" className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors">
                <Briefcase className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">Jobs</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors">
                <UserCircle className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">Me</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sidebar (Mini Profile) */}
        <div className="hidden md:block col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-16 bg-slate-200 relative"></div>
            <div className="px-4 pb-4 flex flex-col items-center text-center">
              <img src="https://ui-avatars.com/api/?name=You&background=random" className="w-16 h-16 rounded-full border-4 border-white -mt-8 relative z-10" />
              <h2 className="font-semibold text-lg mt-2 hover:underline cursor-pointer">Your Name</h2>
              <p className="text-xs text-slate-500 mt-1">Aspiring Software Engineer</p>
            </div>
            <div className="border-t border-slate-100 p-4">
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Profile viewers</span>
                <span className="text-indigo-600">42</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Connections</span>
                <span className="text-indigo-600">105</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Feed */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          
          {/* Create Post Box */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex gap-3">
              <img src="https://ui-avatars.com/api/?name=You&background=random" className="w-12 h-12 rounded-full" />
              <button className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full px-6 text-left text-sm font-medium text-slate-500 border border-slate-200">
                Start a post
              </button>
            </div>
            <div className="flex justify-around mt-3 pt-3 border-t border-slate-100">
              <button className="flex items-center gap-2 text-slate-500 hover:bg-slate-50 p-2 rounded-lg font-medium text-sm transition-colors">
                <ImageIcon className="w-5 h-5 text-blue-500" /> Media
              </button>
              <button className="flex items-center gap-2 text-slate-500 hover:bg-slate-50 p-2 rounded-lg font-medium text-sm transition-colors">
                <Briefcase className="w-5 h-5 text-purple-500" /> Job
              </button>
            </div>
          </div>

          {/* Posts list */}
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-0 overflow-hidden">
              <div className="p-4">
                <div className="flex gap-3 mb-3">
                  <img src={post.avatar} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-sm hover:text-indigo-600 hover:underline cursor-pointer">{post.author}</h3>
                    <p className="text-xs text-slate-500">{post.role}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{post.time}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {post.content}
                </p>
              </div>
              
              <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-indigo-500"/> {post.likes}</span>
                <span>{post.comments} comments</span>
              </div>

              <div className="p-2 flex justify-between">
                <button className="flex-1 flex items-center justify-center gap-2 p-3 hover:bg-slate-50 rounded-lg text-slate-600 text-sm font-medium transition-colors">
                  <ThumbsUp className="w-5 h-5" /> Like
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 p-3 hover:bg-slate-50 rounded-lg text-slate-600 text-sm font-medium transition-colors">
                  <MessageSquare className="w-5 h-5" /> Comment
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 p-3 hover:bg-slate-50 rounded-lg text-slate-600 text-sm font-medium transition-colors">
                  <Share2 className="w-5 h-5" /> Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="font-semibold text-sm mb-4">Trending Jobs</h2>
            <ul className="space-y-4">
              <li>
                <h3 className="text-sm font-bold hover:text-indigo-600 cursor-pointer">Frontend Dev at Vercel</h3>
                <p className="text-xs text-slate-500">San Francisco, CA</p>
              </li>
              <li>
                <h3 className="text-sm font-bold hover:text-indigo-600 cursor-pointer">Backend Eng at Supabase</h3>
                <p className="text-xs text-slate-500">Remote</p>
              </li>
              <li>
                <h3 className="text-sm font-bold hover:text-indigo-600 cursor-pointer">AI Researcher at OpenAI</h3>
                <p className="text-xs text-slate-500">New York, NY</p>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}
