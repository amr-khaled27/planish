import { XCircle } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="">
        <XCircle className="w-24 h-24 text-accent mb-4" />
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for does not exist.
        </p>
        <a href="/" className="text-blue-500 hover:underline">
          Go back to Home
        </a>
      </div>
    </section>
  );
}
