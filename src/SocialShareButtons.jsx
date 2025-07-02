import React from "react";

const SocialShareButtons = ({ meme }) => {
  const shareText = encodeURIComponent(`Check out this meme: ${meme.name}`);
  const shareUrl = encodeURIComponent(meme.url);

  const platforms = [
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1a9.15 9.15 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.17-4.52 4.85 0 .38.04.75.12 1.11C7.69 5.79 4.07 3.88 1.64.9a4.93 4.93 0 0 0-.61 2.43c0 1.68.83 3.16 2.1 4.02A4.48 4.48 0 0 1 1 6.16v.06c0 2.35 1.59 4.3 3.7 4.74a4.6 4.6 0 0 1-2.04.08c.57 1.86 2.2 3.2 4.13 3.24A9.05 9.05 0 0 1 0 19.54a12.76 12.76 0 0 0 7 2.07c8.4 0 13-7.28 13-13.6 0-.21 0-.43-.02-.64A9.18 9.18 0 0 0 23 3z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M22.5 2.4a1.87 1.87 0 0 0-2.06-.3L2.4 10.2a1.88 1.88 0 0 0 .18 3.5l4.92 1.62 1.78 5.49a1.88 1.88 0 0 0 3.56-.06l1.78-5.46 4.8 3.78a1.88 1.88 0 0 0 3-1.32l1.5-14a1.87 1.87 0 0 0-.42-1.55z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M22 12a10 10 0 1 0-11.6 9.86v-6.99H7.08V12h3.33V9.41c0-3.29 1.97-5.1 5-5.1 1.45 0 2.96.26 2.96.26v3.24h-1.67c-1.64 0-2.15 1.01-2.15 2.05V12h3.66l-.58 2.87h-3.08v6.99A10 10 0 0 0 22 12z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex justify-center gap-2 mt-2">
      {platforms.map(({ name, url, icon }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${name}`}
          className="text-purple-300 hover:text-white bg-purple-800 hover:bg-purple-600 p-2 rounded-full transition"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

export default SocialShareButtons;