import {
  Box,
  CalendarRange,
  ClipboardCheck,
  Flame,
  GraduationCap,
  Hammer,
  ShieldCheck,
  Trophy,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Absolute URL for a rendering in public/images. */
export const img = (name: string) => `${base}/images/${name}.jpg`;

/** Absolute URL for a page route ("" is the home page). */
export const href = (slug: string) => `${base}/${slug ? slug + "/" : ""}`;

/** The proposal's pages, in reading order. */
export const sections = [
  { slug: "", label: "Overview", eyebrow: "Overview", blurb: "" },
  {
    slug: "summary",
    label: "Summary",
    eyebrow: "Executive summary",
    blurb: "What we propose, who benefits, and why it is a low-risk start.",
  },
  {
    slug: "analysis",
    label: "Analysis",
    eyebrow: "Analysis",
    blurb:
      "What the garage and adjoining rooms can hold, and how safety is designed in.",
  },
  {
    slug: "plan",
    label: "Phased plan",
    eyebrow: "Proposal",
    blurb:
      "Four phases, each ending with a usable space and a district check-in.",
  },
  {
    slug: "model",
    label: "3D model",
    eyebrow: "3D model",
    blurb: "Walk around the Option B layout in your browser.",
  },
  {
    slug: "gallery",
    label: "Gallery",
    eyebrow: "Gallery",
    blurb: "Concept renderings of the Option B layout.",
  },
  {
    slug: "request",
    label: "Our request",
    eyebrow: "Our request",
    blurb: "The three decisions we are asking for to get started.",
  },
];

export const benefits = [
  {
    icon: Users,
    title: "For students",
    body: "Hands-on engineering, manufacturing, programming, and teamwork in one place, close to school.",
  },
  {
    icon: Box,
    title: "For the district",
    body: "Existing storage structures stay in use, and an underused space becomes a learning space.",
  },
  {
    icon: ShieldCheck,
    title: "Safety first",
    body: "Hazards are zoned, guarded, and supervised, with egress and emergency equipment designed in.",
  },
  {
    icon: CalendarRange,
    title: "Low-risk start",
    body: "Phases 1 and 2 need only cleanup and setup. Larger work waits for permits and approval.",
  },
];

export const requests = [
  "Approve Red Hawk Robotics' use of the garage, cage, Room 6, and Room 3 as a robotics lab, subject to a use agreement.",
  "Schedule a walkthrough with your office and facilities to confirm what storage stays and what moves.",
  "Authorize Phase 1, so the team and district can draft the safety plan and agreement together.",
];

export const stats = [
  {
    value: "≈ 4,300 sq ft",
    label: "Lab floor area across garage, cage, Room 6, and Room 3",
  },
  {
    value: "3/4-scale",
    label: "FRC practice field with polycarbonate perimeter",
  },
  { value: "400 sq ft", label: "Existing mezzanine kept in place" },
  { value: "4 phases", label: "Staged so each step stands on its own" },
];

export const spaces = [
  {
    name: "Garage bay",
    size: "60 × 48 ft",
    use: "3/4-scale practice field, driver stations, metal prep under the existing mezzanine, sheet breakdown and cut stations.",
    icon: Trophy,
  },
  {
    name: "Fabrication cage",
    size: "21 × 19 ft",
    use: "CO2 laser, CNC press brake, two desktop CNC routers, and MetalFab behind a laser curtain with a rated vision panel and ducted exhaust.",
    icon: Flame,
  },
  {
    name: "Room 6: build and assembly",
    size: "19 × 30 ft",
    use: "Assembly table, workbenches, electronics bench with fume extraction, enclosed 3D printer bay, deburr booth, and battery charging.",
    icon: Wrench,
  },
  {
    name: "Room 3: classroom",
    size: "24 × 18 ft",
    use: "Six work tables, a six-seat CAD bench, teaching wall with whiteboards and an 86-inch display.",
    icon: GraduationCap,
  },
];

export const comparison = [
  {
    topic: "Student use",
    storage: "None",
    lab: "Daily after-school build, practice, and instruction space",
  },
  {
    topic: "Existing mezzanine and pallet racking",
    storage: "In use for storage",
    lab: "Kept in place; storage can be consolidated onto them",
  },
  {
    topic: "Practice field",
    storage: "Team practices off site or not at all",
    lab: "3/4-scale field on site with clear egress lanes",
  },
  {
    topic: "Safety controls",
    storage: "General storage conditions",
    lab: "Separated hazard zones, E-stops, eyewash, extinguishers, exhaust",
  },
  {
    topic: "Reversibility",
    storage: "—",
    lab: "Most equipment is freestanding or mobile",
  },
];

export const safety = [
  "Laser and metal fabrication isolated in a fenced cage with a rolling slide gate, laser curtain, and laser-rated vision panel",
  "Ducted exhaust from the cage to a roof fan; fume extraction at the electronics bench and MetalFab",
  "Emergency stops and a shop disconnect at the garage, plus eyewash, first aid, and a drench shower",
  "ABC extinguishers throughout and a Class D extinguisher beside the aluminum chip drum",
  "Chip and spark screens at metal prep and the deburr booth; dust collection with a cyclone for wood",
  "Hinged gates on three sides of the field and a marked cross-field egress lane",
  "Battery charging on a spill tray, away from fabrication",
  "PPE cabinet and safety stations at every entry",
];

export const phases = [
  {
    n: 1,
    title: "Agreement and walkthrough",
    timing: "Before any work begins",
    icon: ClipboardCheck,
    goals: [
      "Walk the garage with the superintendent's office and facilities",
      "Confirm which stored items must stay, move, or be surplused",
      "Review fire, building, and insurance requirements",
      "Agree on access hours, adult supervision, and a written safety plan",
    ],
    outcome: "A signed use agreement and a punch list everyone has seen.",
  },
  {
    n: 2,
    title: "Consolidate storage and open the floor",
    timing: "First phase of physical work",
    icon: Warehouse,
    goals: [
      "Consolidate remaining district storage onto the mezzanine and existing racks",
      "Clean and mark the floor; post safety stations and egress routes",
      "Set up Room 3 as a classroom and design space",
    ],
    outcome:
      "Students can meet, design, and plan in the space with no new utilities.",
  },
  {
    n: 3,
    title: "Practice field and build space",
    timing: "Ahead of the January FRC kickoff",
    icon: Hammer,
    goals: [
      "Install field carpet, polycarbonate perimeter, and driver stations",
      "Fit out Room 6 with benches, assembly table, and battery charging",
      "Move hand tools and low-risk equipment in",
    ],
    outcome:
      "The team can build and drive robots on site through build season.",
  },
  {
    n: 4,
    title: "Fabrication cage",
    timing: "After permits and contractor work",
    icon: ShieldCheck,
    goals: [
      "Licensed electrical work and the cage exhaust to the roof",
      "Install the fence, laser curtain, and vision panel",
      "Commission the laser, press brake, and CNC machines with written procedures",
    ],
    outcome:
      "Students learn modern manufacturing in a controlled, supervised zone.",
  },
];

export const gallery = [
  {
    file: "01-aerial-cutaway-sw",
    caption: "The full Option B layout, seen from the southwest",
  },
  {
    file: "03-garage-field-hero",
    caption: "The garage bay with the practice field and existing mezzanine",
  },
  {
    file: "04-field-from-east-aisle",
    caption:
      "The field from the east aisle, looking toward the mezzanine stair",
  },
  {
    file: "05-mezzanine-overlook",
    caption: "The existing mezzanine overlooking the field",
  },
  {
    file: "06-under-mezzanine-metal-prep",
    caption: "Metal prep under the mezzanine, beside the cage",
  },
  {
    file: "07-fabrication-cage",
    caption: "Fabrication cage: laser, press brake, and CNC routers",
  },
  {
    file: "08-room6-build-assembly",
    caption: "Room 6: assembly, staging, and battery charging",
  },
  {
    file: "09-classroom",
    caption: "Room 3: classroom tables, CAD bench, and teaching wall",
  },
  {
    file: "10-aerial-cutaway-ne",
    caption: "The garage door side, seen from the northeast",
  },
  {
    file: "02-floor-plan-top",
    caption: "Plan view of the lab and adjacent rooms",
  },
];
