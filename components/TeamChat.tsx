"use client";

import { motion } from "motion/react";

interface TeamMember {
  emoji: string;
  name: string;
  role: string;
  message: string;
}

const teamMembers: TeamMember[] = [
  {
    emoji: "🧠",
    name: "Ahmed M.",
    role: "Product & Frontend",
    message: "yo who pushed at 2am again 💀",
  },
  {
    emoji: "🎨",
    name: "Leen K.",
    role: "UX & Design",
    message: "me, but the colors are finally ✨vibing✨",
  },
  {
    emoji: "👨‍💻",
    name: "Ziad A.",
    role: "Backend & Infra",
    message: "ngl I still don't get how timezones work",
  },
  {
    emoji: "🚀",
    name: "Maya R.",
    role: "DevOps & Security",
    message: "just deployed to prod on a Friday... YOLO 🔥",
  },
  {
    emoji: "📊",
    name: "Omar T.",
    role: "Data & Analytics",
    message: "our conversion rate is looking spicy 📈",
  },
];

const ChatMessage = ({ member }: { member: TeamMember }) => (
  <motion.div
    initial={{ opacity: 0, translateY: 20 }}
    whileInView={{ opacity: 1, translateY: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.25 }}
    className={`flex items-start space-x-2 sm:space-x-3`}
  >
    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm sm:text-lg">
      {member.emoji}
    </div>
    <div className="flex-1 min-w-0">
      <div className="bg-gray-50 rounded-2xl rounded-tl-md px-3 py-2 sm:px-4 sm:py-3 max-w-full sm:max-w-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
          <span className="font-semibold text-gray-900 text-xs sm:text-sm">
            {member.name}
          </span>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full mt-1 sm:mt-0 w-fit">
            {member.role}
          </span>
        </div>
        <p className="text-gray-800 text-xs sm:text-sm leading-relaxed break-words">
          {member.message}
        </p>
      </div>
      <div className="text-xs text-gray-400 mt-1 ml-1">
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  </motion.div>
);

export const TeamChat = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-12">
          <div className="text-center lg:sticky lg:top-24 lg:h-fit mb-8 lg:mb-12 lg:flex-shrink-0 lg:w-80">
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-3 sm:px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-[#44d62c] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                5 members online
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Meet the Team
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto lg:max-w-none">
              Get to know the people behind Planish!
            </p>
          </div>

          <div className="flex-1 max-w-full lg:max-w-2xl">
            <div className="border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-red-400 rounded-full"></div>
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-2 sm:ml-4">
                      # team-general
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-[#44d62c] rounded-full"></div>
                    <span className="hidden sm:inline">Active now</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-[350px] sm:min-h-[400px] bg-[#111827] overflow-x-hidden">
                {teamMembers.map((member, index) => (
                  <ChatMessage key={index} member={member} />
                ))}
              </div>
            </div>
            <div className="text-center mt-6 sm:mt-8">
              <p className="text-gray-500 text-xs sm:text-sm">
                * No developers were harmed in the making of this chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
