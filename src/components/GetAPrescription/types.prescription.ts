"use client";
import { IconType } from "react-icons/lib";

export interface IPrescriptionStep {
  number: string;
  title: string;
  description: string;
}
export interface IPrescriptionFeature {
  icon: IconType;
  title: string;
  description: string;
  color: string;
}
