import type { Metadata } from "next";
import { LabWorkbench } from "@/components/lab/lab-workbench";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Interactive Lab",
  description:
    "Drive an Ohm's law circuit, build a network topology and route a packet, then trade aperture, shutter and ISO against each other.",
};

export default function LabPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-12 lg:px-8 lg:pt-16">
      <PageHeading titleKey="labTitle" leadKey="labLead" />

      <div className="mt-10">
        <LabWorkbench />
      </div>
    </div>
  );
}
