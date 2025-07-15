import Navbar from "@/components/Navbar";
import Orb from "@/components/Orb";
import FeatureCard from "@/components/FeatureCard";
import { TeamChat } from "@/components/TeamChat";
import Footer from "@/components/Footer";
import CTAButton from "@/components/CTAButton";
import Testimonials from "@/components/Testimonials";
import "./css/pattern.css";
import features from "@/public/data/features.json";
import ThreeDText from "@/components/ThreeDText";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen hero flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-4 sm:mx-8 lg:mx-12 gap-8 lg:gap-12 max-w-7xl w-full">
          <div className="flex mb-4 flex-col justify-center text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Plan Smarter, Stress Less
            </h1>
            <h2 className="text-lg sm:text-xl lg:text-2xl mt-4 mb-8 text-muted-foreground leading-relaxed">
              <span className="text-accent relative font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-muted-foreground after:opacity-50 after:rounded-full">
                Planish
              </span>{" "}
              helps students track, manage, and beat their deadlines—with zero
              overwhelm.
            </h2>
            <div className="flex justify-center lg:justify-start">
              <CTAButton text="See How It Works" />
            </div>
          </div>

          <div className="flex justify-center items-center order-1 lg:order-2">
            <Orb />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="min-h-screen py-16 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-center">
          Never Miss A Detail.
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-8 w-full max-w-7xl">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              iconName={feature.iconName}
              iconColor="text-accent"
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section className="min-h-screen meet-the-team flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl w-full">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 mt-8 sm:mt-12 lg:mt-16">
            Built by Students. For Students.
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            We&apos;re a small team of student devs, designers, and
            overachievers.
            <br className="hidden sm:inline" />
            Tired of missing deadlines and burning out, we built the tool we
            wish we had from day one.
          </p>

          <TeamChat />
        </div>
      </section>

      <Testimonials />

      <section className="relative bg-[#111827] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <ThreeDText />

        <div className="text-center z-10 max-w-4xl w-full">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
            Ready to take control?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed px-4">
            Start planning smarter, not harder.
          </p>
          <CTAButton text="Get Started" />
        </div>
      </section>

      <Footer />
    </>
  );
}
