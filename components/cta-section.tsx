"use client"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, PlusCircle, Search } from "lucide-react"
import Link from "next/link"

const faqs = [
  {
    question: "What is an escape room?",
    answer:
      "An escape room is an interactive adventure game where players work together to solve puzzles, find clues, and complete objectives within a set time limit (usually 60 minutes) to 'escape' from a themed room. It's perfect for team building, parties, dates, and anyone looking for a thrilling mental challenge.",
  },
  {
    question: "How many people can play an escape room?",
    answer:
      "Most escape rooms accommodate 2-8 players, though some rooms support up to 12 participants. Smaller groups (2-4 players) work well for intimate experiences, while larger groups (6-8 players) are great for team building. Check each room's specific capacity requirements when booking.",
  },
  {
    question: "How long does an escape room take?",
    answer:
      "The actual game typically lasts 60 minutes, though some rooms offer 45-minute or 90-minute experiences. Plan to arrive 15 minutes early for check-in and a brief orientation. After the game, most venues allow time for photos and debriefing, so budget about 90 minutes total.",
  },
  {
    question: "Do I need experience to play an escape room?",
    answer:
      "No experience needed! Escape rooms are designed for players of all skill levels. Many venues offer rooms with different difficulty levels, from beginner-friendly to expert challenges. Game masters are available to provide hints if you get stuck, ensuring everyone has a fun experience.",
  },
  {
    question: "What should I bring to an escape room?",
    answer:
      "Just bring yourself, your team, and a positive attitude! Most escape rooms provide lockers for your belongings. You typically won't need phones, bags, or personal items during the game. Wear comfortable clothing that allows you to move freely, as some rooms may require bending, reaching, or light physical activity.",
  },
  {
    question: "Are escape rooms safe?",
    answer:
      "Yes, escape rooms are very safe! All rooms are monitored by game masters via cameras and microphones. Emergency exits are clearly marked and accessible at all times. The puzzles are mental challenges, not physical risks. Venues follow strict safety protocols and fire codes.",
  },
  {
    question: "Can I book an escape room for a private event?",
    answer:
      "Absolutely! Many escape rooms offer private bookings for birthdays, corporate team building, bachelor/bachelorette parties, and special occasions. Some venues provide party rooms or event spaces. Contact the venue directly or check their booking options for group reservations and special packages.",
  },
  {
    question: "What happens if we don't escape in time?",
    answer:
      "Not escaping in time is completely normal—many groups don't complete the room on their first try! The game master will reveal the remaining puzzles and explain how to finish the room. You'll still have had the full experience of solving most challenges. Many players book a rematch or try a different room!",
  },
]

export default function CTASection() {
  return (
    <section className="border-t border-slate-100 bg-gradient-to-b from-white to-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* FAQs Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-6 w-6 text-escape-red" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">
                Frequently Asked Questions
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Everything You Need To Know About Escape Rooms
            </h2>
            <p className="text-base text-slate-600 mb-8">
              Get answers to frequently asked questions about escape room experiences, booking processes, difficulty levels, group sizes, and tips for first-time players seeking adventure.
            </p>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200">
                  <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:text-escape-red py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA Section */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 lg:p-10 shadow-xl border border-slate-700">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Ready To Start Your Escape Room Adventure?
              </h3>
              <p className="text-base text-slate-300 mb-8 leading-relaxed">
                Browse thousands of escape room listings with detailed information, or add your venue to our directory to connect with players seeking challenging puzzle adventures.
              </p>

              <div className="space-y-4">
                <Link href="/browse" className="block">
                  <Button
                    size="lg"
                    className="w-full h-12 px-10 bg-escape-red hover:bg-escape-red/90 text-white border-0"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Explore Escape Rooms
                  </Button>
                </Link>

                <Link href="/add-listing" className="block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-12 px-10 border-2 border-escape-red text-escape-red hover:bg-escape-red hover:text-white bg-transparent"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    List Your Escape Room
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-4">Why choose Escape Rooms Finder?</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-escape-red mt-0.5">✓</span>
                    <span>Largest directory of escape rooms worldwide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-escape-red mt-0.5">✓</span>
                    <span>Real reviews and ratings from players</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-escape-red mt-0.5">✓</span>
                    <span>Filter by theme, difficulty, and location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-escape-red mt-0.5">✓</span>
                    <span>Free listing for escape room owners</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
