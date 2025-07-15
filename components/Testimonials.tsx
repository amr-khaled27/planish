import Path from "./Path";
import AnimatedHeart from "./AnimatedHeart";

export default function Testimonials() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <h4 className="text-3xl font-bold mb-8 flex items-center gap-4 z-10">
        Students <AnimatedHeart /> Planish
      </h4>

      <Path />

      <div className="grid mx-8 grid-cols-1 md:grid-cols-2 gap-8 py-20 z-10">
        <div className="flex flex-col justify-center">
          <blockquote className="text-2xl font-semibold leading-snug mb-4">
            “It actually made me feel in control.”
          </blockquote>
          <p className="text-muted-foreground mb-2">
            I used to wing it with sticky notes and panic. Now I can see
            everything I need — and it doesn’t feel overwhelming.
          </p>
          <span className="text-sm font-medium text-muted-foreground">
            — Leen K., Med Student
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-muted/30 p-4 rounded-xl shadow-lg">
            <p className="mb-1">“Looks good, works even better.”</p>
            <span className="text-sm text-muted-foreground">
              — Omar M., CS Senior
            </span>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl shadow-lg">
            <p className="mb-1">
              “Planish reminds me like a friend would. Not like a scary app.”
            </p>
            <span className="text-sm text-muted-foreground">
              — Amina F., Law Student
            </span>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl shadow-lg">
            <p className="mb-1">
              “My ADHD brain finally chilled out. This is the first planner I’ve
              stuck with.”
            </p>
            <span className="text-sm text-muted-foreground">
              — Ziad A., Design Major
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
