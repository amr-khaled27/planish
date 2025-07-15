import { Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <p className="text-sm mb-4">
          Made with <Heart fill="#ef4444" className="inline text-red-500" /> by{" "}
          <a
            href="https://www.linkedin.com/in/amr-khaled-74b936256/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Amr Khaled <ExternalLink size={16} className="inline" />
          </a>
        </p>
        <div className="flex gap-6 mb-4 justify-center">
          <a
            href="https://twitter.com/planishapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-gray-400 hover:text-accent transition"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M22 5.92a8.38 8.38 0 01-2.36.65A4.13 4.13 0 0021.4 4.1a8.27 8.27 0 01-2.61 1A4.13 4.13 0 0012 8.13c0 .32.04.64.1.94A11.72 11.72 0 013 4.89a4.13 4.13 0 001.28 5.51A4.07 4.07 0 012.8 9.7v.05a4.13 4.13 0 003.31 4.05c-.32.09-.65.14-.99.14-.24 0-.47-.02-.7-.07a4.13 4.13 0 003.85 2.87A8.29 8.29 0 012 19.54a11.72 11.72 0 006.29 1.84c7.55 0 11.69-6.26 11.69-11.69 0-.18 0-.36-.01-.54A8.18 8.18 0 0022 5.92z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a
            href="https://github.com/planish"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-400 hover:text-accent transition"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.34 6.84 9.7.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.65.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.38 9.38 0 012.5-.34c.85 0 1.71.11 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.89 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0022 12.26C22 6.58 17.52 2 12 2z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a
            href="https://instagram.com/planishapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gray-400 hover:text-accent transition"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A5.5 5.5 0 1017.5 12 5.5 5.5 0 0012 7.5zm0 9A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 16.5zm5-9.75a1.25 1.25 0 11-1.25-1.25A1.25 1.25 0 0117 6.75z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <p className="text-xs">
          © {new Date().getFullYear()} Planish. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
