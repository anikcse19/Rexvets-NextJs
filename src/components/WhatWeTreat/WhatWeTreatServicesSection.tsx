"use client";
import { treatmentServices } from "@/lib";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const WhatWeTreatServicesSection = () => {
  return (
    <section
      className="bg-gray-50 py-8 md:py-12"
      aria-labelledby="treatment-services-heading"
      role="region"
    >
      <div className="container mx-auto px-4 text-center mb-8">
        <motion.h2
          id="treatment-services-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-900"
        >
          Conditions We Treat
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-gray-600 max-w-xl mx-auto"
        >
          Comprehensive care for a wide range of pet health conditions
        </motion.p>
      </div>
      <div
        className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        role="list"
      >
        {treatmentServices?.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -12 }}
            className="h-full"
            role="listitem"
          >
            <Card
              className="h-full md:h-fit pt-0 pb-0 overflow-hidden rounded-3xl border border-gray-100 shadow-lg transition-all duration-400 hover:shadow-2xl"
              role="group"
              aria-label={`${service.title} card`}
            >
              <div style={{ width: "100%", height: 200, position: "relative" }}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill // use fill to fill the parent container
                  style={{ objectFit: "cover" }}
                  sizes="346px"
                  priority={index === 0} // optionally prioritize first image
                />
              </div>
              <div className="p-[24px]">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {service.title}
                    </CardTitle>
                    <Badge className={`${service.color} text-white`}>
                      Available
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-gray-600 mb-3">
                    {service.description}
                  </CardDescription>
                  <div className="mb-3">
                    <p className="font-semibold mb-1">Common Symptoms:</p>
                    <div
                      className="flex flex-wrap gap-1"
                      aria-label="Common symptoms"
                    >
                      {service.symptoms.slice(0, 2).map((symptom, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs"
                          role="listitem"
                        >
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={`/what-we-treat/${service.id}`} passHref>
                    <Button
                      role="button"
                      aria-label={`Learn more about ${service.title}`}
                      className={`w-full mt-[24px] rounded-xl h-12 font-semibold cursor-pointer ${service.color} hover:${service.color} text-white`}
                    >
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(WhatWeTreatServicesSection);
