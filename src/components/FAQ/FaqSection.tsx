"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, Variants } from "framer-motion";
import React from "react";

interface FaqItem {
  question: string;
  answer: string[];
}

interface FaqSectionProps {
  title: string;
  items: FaqItem[];
  index: number;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const accordionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: index % 2 === 0 ? -100 : 100, // Slide from left for even, right for odd
  }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const FaqSection: React.FC<FaqSectionProps> = ({ title, items, index }) => {
  return (
    <section className=" bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-0"
        >
          {title}
        </motion.h2>
        <motion.div
          variants={accordionVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="border-b border-gray-200 cursor-pointer"
                custom={idx}
              >
                <AccordionItem
                  value={`item-${index}-${idx}`}
                  className="border-b border-gray-200 "
                >
                  <AccordionTrigger className="cursor-pointer text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer.map((paragraph, pIdx) => (
                      <p key={pIdx} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
export default React.memo(FaqSection);
