import { Search, Eye, Phone, Trophy } from "lucide-react"

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "Discover",
      description: "Search our comprehensive escape room directory by location, theme, difficulty, player capacity, and authentic customer ratings",
    },
    {
      icon: Eye,
      title: "Compare",
      description: "Evaluate escape room venues side-by-side with detailed descriptions, photo galleries, real reviews, and pricing comparisons",
    },
    {
      icon: Phone,
      title: "Contact",
      description: "Access complete venue information including contact details, directions, booking links, and availability for your preferred date",
    },
    {
      icon: Trophy,
      title: "Escape",
      description: "Experience immersive puzzle rooms designed for groups seeking challenging adventures and memorable team-building activities",
    },
  ]

  return (
    <section className="border-t border-slate-100 bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">How it works</span>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Find An Escape Room Near Me In Four Easy Steps</h2>
          <p className="mt-3 text-base text-slate-600">
            Our escape room finder simplifies booking the perfect adventure. Browse locations, compare reviews, connect with venues, and secure your escape room experience in minutes.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-escape-red/50 hover:shadow-lg"
            >
              {/* Step Number */}
              <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <span>0{index + 1}</span>
                <div className="h-px flex-1 bg-slate-200 group-hover:bg-escape-red/30 transition-colors" />
              </div>

              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-escape-red/10 text-escape-red transition-all group-hover:bg-escape-red group-hover:text-white group-hover:scale-110">
                <step.icon className="h-7 w-7 transition-transform group-hover:rotate-6" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-escape-red transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
