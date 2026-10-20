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
    label: "Written proposal",
    eyebrow: "Written proposal",
    blurb:
      "The full request on one page: what we ask, why, how it serves the Strategic Plan, and the phased plan.",
  },
  {
    slug: "analysis",
    label: "Analysis",
    eyebrow: "Analysis",
    blurb:
      "Why the team has outgrown its rooms, and how the garage and adjoining rooms would be laid out.",
  },
  {
    slug: "gallery",
    label: "Gallery",
    eyebrow: "Gallery",
    blurb:
      "Concept renderings of the proposed layout, plus a 3D model you can walk around.",
  },
  {
    slug: "research",
    label: "Research",
    eyebrow: "Research and case studies",
    blurb:
      "How top FRC teams get field time, how much space they use, and what they spend.",
  },
  {
    slug: "plan",
    label: "Phased plan",
    eyebrow: "Proposal",
    blurb:
      "Four phases, each ending with a district check-in, with safety controls arriving as each space opens.",
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
    body: "The existing mezzanine and racks are reused, and an underused space becomes a learning space.",
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

/**
 * How the lab serves the MPS Strategic Plan (2023–2026). Quotes are taken
 * word for word from the plan's executive summary; keep them exact.
 */
export const strategicPlan = {
  theoryOfAction:
    "if educators design a safe, supportive, and responsive student-centered learning environment, then students will own their learning",
  objectives: [
    {
      name: "Academic Knowledge and Skills",
      quote: "apply their competencies in relevant, real-world contexts",
      lab: "Students use math, physics, programming, and design to build a working robot to a fixed rulebook and deadline, then test it on a field.",
    },
    {
      name: "Personalized and Equitable Opportunities",
      quote: "know their own strengths, interests, and areas of growth",
      lab: "CAD, machining, wiring, programming, driving, and outreach are all real jobs on the team, so each student can find where they are strongest and build connections with peers and adult mentors.",
    },
    {
      name: "Global Engagement",
      quote: "graduate ready to compete globally",
      lab: "FIRST is an international program. Students compete and collaborate with teams from other schools and communities.",
    },
    {
      name: "Finance and Operations",
      quote: "sustainable growth in all areas of district planning",
      lab: "The lab reuses an underused space and its existing mezzanine and racking. Work moves in phases, with a district check-in before each one.",
    },
  ],
};

export const requests = [
  "Approve Red Hawk Robotics' continued use of Rooms 3 and 6, and its use of the garage and cage, as one robotics lab, subject to a use agreement.",
  "Schedule a walkthrough with your office and facilities to plan how and when district storage moves out.",
  "Authorize Phase 1, so the team and district can draft the safety plan and agreement together.",
];

/** The size of the program the lab would serve. */
export const program = [
  {
    value: "102+",
    label: "Students across all Red Hawk Robotics teams",
  },
  {
    value: "45+",
    label: "Students on the FRC team, up 20 from last year",
  },
  {
    value: "20+",
    label: "Mentors working with the FRC team",
  },
  {
    value: "10 hrs",
    label: "Average weekly time per FRC mentor in build season; some give 40",
  },
];

/** The teams in the program, by FIRST level. */
export const programTeams = [
  {
    count: "1",
    name: "FRC team",
    note: "FIRST Robotics Competition",
  },
  { count: "3", name: "FTC teams", note: "FIRST Tech Challenge" },
  { count: "6–7", name: "FLL teams", note: "FIRST LEGO League" },
];

export const stats = [
  {
    value: "102+",
    label: "Students in Red Hawk Robotics' FRC, FTC, and FLL teams",
  },
  {
    value: "≈ 4,300 sq ft",
    label: "Lab floor area across the garage, cage, Room 6, and Room 3",
  },
  {
    value: "3/4-scale",
    label: "FRC practice field on site, with a polycarbonate perimeter",
  },
  { value: "4 phases", label: "Each ends with a district check-in" },
];

/** Lab spaces. `ft` is width × depth from the SketchUp model, to confirm on site. */
export const spaces: {
  key: string;
  name: string;
  ft: [number, number];
  use: string;
  icon: typeof Trophy;
}[] = [
  {
    key: "garage",
    name: "Garage bay",
    ft: [60, 48],
    use: "3/4-scale practice field, driver stations, metal prep under the existing mezzanine, sheet breakdown and cut stations.",
    icon: Trophy,
  },
  {
    key: "cage",
    name: "Fabrication cage",
    ft: [21, 19],
    use: "CO2 laser, CNC press brake, two desktop CNC routers, and MetalFab behind a laser curtain with a rated vision panel and ducted exhaust.",
    icon: Flame,
  },
  {
    key: "room-6",
    name: "Room 6: build and assembly",
    ft: [19, 30],
    use: "Assembly table, workbenches, electronics bench with fume extraction, enclosed 3D printer bay, deburr booth, and battery charging.",
    icon: Wrench,
  },
  {
    key: "room-3",
    name: "Room 3: classroom",
    ft: [24, 18],
    use: "Six work tables, a six-seat CAD bench, teaching wall with whiteboards and an 86-inch display.",
    icon: GraduationCap,
  },
];

/**
 * The rooms on the side-by-side plan (LayoutPlan.astro). `existing` places the
 * marker on the 2019 school floor plan crop (image pixels); `proposed` places
 * it on the SketchUp plan view, in inches from its top-left corner.
 */
export const planRooms = [
  {
    key: "garage",
    mark: "G",
    name: "Garage bay",
    schoolName: "Garage",
    use: "Practice field, driver stations, and metal prep under the existing mezzanine",
    inLab: true,
    existing: [710, 235],
    proposed: [680, 470],
  },
  {
    key: "cage",
    mark: "C",
    name: "Cage",
    schoolName: "Unlabeled room off the garage",
    use: "Fabrication: laser, press brake, CNC routers",
    inLab: true,
    existing: [605, 330],
    proposed: [374, 717],
  },
  {
    key: "room-6",
    mark: "6",
    name: "Room 6",
    schoolName: "Unlabeled room west of the cage",
    use: "Build and assembly",
    inLab: true,
    existing: [500, 310],
    proposed: [131, 660],
  },
  {
    key: "room-3",
    mark: "3",
    name: "Room 3",
    schoolName: "West part of the room marked Robotics",
    use: "Classroom and CAD",
    inLab: true,
    existing: [828, 294],
    proposed: [879, 720],
  },
  {
    key: "room-1",
    mark: "1",
    name: "Room 1",
    inLab: false,
    existing: [685, 354],
    proposed: [559, 720],
  },
  {
    key: "room-2",
    mark: "2",
    name: "Room 2",
    inLab: false,
    existing: [738, 310],
    proposed: [675, 676],
  },
  {
    key: "room-4",
    mark: "4",
    name: "Room 4",
    inLab: false,
    existing: [913, 210],
    proposed: [1075, 310],
  },
  {
    key: "room-5",
    mark: "5",
    name: "Room 5",
    inLab: false,
    existing: [500, 160],
    proposed: [115, 350],
  },
];

const area = (key: string) => {
  const [w, d] = spaces.find((s) => s.key === key)!.ft;
  return w * d;
};

/** "60 × 48 ft" for a space. */
export const size = (s: { ft: [number, number] }) =>
  `${s.ft[0]} × ${s.ft[1]} ft`;

/** Model area rounded to the nearest 100 sq ft, for prose. */
export const roundArea = (sqft: number) => Math.round(sqft / 100) * 100;

/** Floor area of the rooms the team uses today and of the proposed lab. */
export const currentRooms = {
  sqft: area("room-3") + area("room-6"),
  people: 30,
};
export const garageArea = area("garage");
export const labArea = spaces.reduce((sum, s) => sum + s.ft[0] * s.ft[1], 0);

/**
 * Minimum floor area per student for shop and lab work. Working numbers for
 * discussion: the Massachusetts building code's own table and how each room is
 * classified are still to be confirmed with the building inspector and fire
 * department.
 */
export const spaceStandards: {
  benchmark: string;
  perPerson: number;
  kind: string;
  source: Source;
}[] = [
  {
    benchmark: "Shop or vocational room",
    perPerson: 50,
    kind: "Fire and building code (NFPA 101 and IBC)",
    source: {
      label: "NSTA on NFPA 101",
      url: "https://static.nsta.org/pdfs/overcrowdingintheinstructionalspace.pdf",
    },
  },
  {
    benchmark: "Combined classroom and lab, 24 students at most",
    perPerson: 60,
    kind: "Safety recommendation (NSTA)",
    source: {
      label: "NSTA position",
      url: "https://static.nsta.org/pdfs/overcrowdingintheinstructionalspace.pdf",
    },
  },
  {
    benchmark: "Heavy-equipment lab, such as a metal or wood shop",
    perPerson: 75,
    kind: "State guideline (Louisiana)",
    source: {
      label: "LAC 28:CXV-3101",
      url: "https://regulations.justia.com/states/louisiana/title-28/part-cxv/chapter-31/section-cxv-3101",
    },
  },
  {
    benchmark: "Medium vocational shop: woodworking, metalworking, electronics",
    perPerson: 120,
    kind: "MSBA space template, as used by Boston Public Schools (2023)",
    source: {
      label: "BPS capacity report",
      url: "https://search.boston.gov/sites/default/files/file/2024/01/Boston%20PK-12%20PS_Capacity%20Report%20-%20Final.pdf",
    },
  },
];

export const spaceContextSources: Source[] = [
  {
    label: "IBC Table 1004.5",
    url: "https://www.umsystem.edu/ums/fa/facilities/um-system-ahj-code-determination-16r",
  },
  {
    label: "NSTA: 2020 national lab study",
    url: "https://www.nsta.org/blog/safer-engineering-instruction-k-12-labs-and-makerspaces-results-2020-national-study",
  },
  {
    label: "Georgia DOE guideline (2012)",
    url: "https://sparchives.gadoe.org/Finance-and-Business-Operations/Facilities-Services/Documents/4%20%20Guideline%20for%20Square%20Footage%20Requirements.pdf",
  },
  {
    label: "Maine DOE guidelines (Oct 2025)",
    url: "https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Facilities%20-%20Space%20Allocation%20Guidelines%20-%2010.22.2025.pdf",
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
    lab: "Kept and reused for lab stock and materials",
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

export const phases = [
  {
    n: 1,
    title: "Agreement and walkthrough",
    timing: "Before any work begins",
    icon: ClipboardCheck,
    goals: [
      "Walk the garage with the superintendent's office and facilities",
      "Inventory district storage and agree on a schedule to move it out or surplus it",
      "Review fire, building, and insurance requirements",
      "Agree on access hours, adult supervision, and a written safety plan",
    ],
    safety: [],
    outcome: "A signed use agreement and a punch list everyone has seen.",
  },
  {
    n: 2,
    title: "Consolidate storage and open the floor",
    timing: "First phase of physical work",
    icon: Warehouse,
    goals: [
      "Consolidate district storage into one area of the racks and mezzanine",
      "Clean and mark the floor; post safety stations and egress routes",
      "Set up Room 3 as a classroom and design space",
    ],
    safety: [
      "PPE cabinet and safety stations at every entry",
      "Self-contained eyewash stations, which need no plumbing, and first aid kits",
      "ABC extinguishers throughout",
      "Marked egress routes kept clear of storage",
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
      "Move out the next share of district storage and use the freed racks for lab stock",
    ],
    safety: [
      "Hinged gates on three sides of the field and a marked cross-field egress lane",
      "Battery charging on a spill tray, away from fabrication",
      "Portable fume extraction at the electronics bench",
      "Chip screens at the deburr booth",
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
      "Finish phasing out district storage as agreed",
    ],
    safety: [
      "Laser and metal fabrication isolated in a fenced cage with a rolling slide gate, laser curtain, and laser-rated vision panel",
      "Ducted exhaust from the cage to a roof fan, and fume extraction at the MetalFab",
      "Emergency stops and a shop disconnect at the garage",
      "Chip and spark screens at metal prep, and dust collection with a cyclone for wood",
      "A Class D extinguisher beside the aluminum chip drum",
    ],
    outcome:
      "Students learn modern manufacturing in a controlled, supervised zone.",
  },
];

/**
 * What happens to each space in each phase, for the plan's schedule chart.
 * One entry per phase 1–4; null means no change in that phase. Taken from the
 * phase goals above.
 */
export const phaseSchedule: {
  space: string;
  steps: (null | { label: string; kind: "prep" | "open" | "storage" })[];
}[] = [
  {
    space: "Room 3",
    steps: [null, { label: "Set up as classroom", kind: "open" }, null, null],
  },
  {
    space: "Room 6",
    steps: [null, null, { label: "Benches and charging", kind: "open" }, null],
  },
  {
    space: "Garage bay",
    steps: [
      { label: "Walkthrough", kind: "prep" },
      { label: "Floor cleaned and marked", kind: "prep" },
      { label: "Practice field", kind: "open" },
      null,
    ],
  },
  {
    space: "Cage",
    steps: [
      null,
      null,
      null,
      { label: "Fabrication after permits", kind: "open" },
    ],
  },
  {
    space: "District storage",
    steps: [
      { label: "Inventory", kind: "storage" },
      { label: "Consolidated", kind: "storage" },
      { label: "Partly moved out", kind: "storage" },
      { label: "Phased out", kind: "storage" },
    ],
  },
];

export const gallery = [
  {
    file: "01-aerial-cutaway-sw",
    caption: "The full proposed layout, seen from the southwest",
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

type Source = { label: string; url: string };

/** Published examples of where successful FRC teams practice. */
export const caseStudies: {
  model: string;
  summary: string;
  teams: { name: string; place: string; body: string; sources: Source[] }[];
}[] = [
  {
    model: "Inside the school or district",
    summary:
      "The model this proposal follows. Each example was built as a district facility, usually funded by a bond or state grant.",
    teams: [
      {
        name: "1678 Citrus Circuits",
        place: "Davis, CA",
        body: "A 7,800 sq ft engineering and robotics center at Davis Senior High with a practice field, completed in 2023. A $3M state CTE facilities grant was matched by a local bond; total cost was reported at about $6M. The team has about 90 students.",
        sources: [
          {
            label: "CA Dept. of Education",
            url: "https://www.cde.ca.gov/nr/ne/yr26/yr26rel37.asp",
          },
          {
            label: "ABC10",
            url: "https://abc10.com/article/news/local/student-led-robotics-team-davis-new-facility/103-21897eeb-7b42-4d32-8365-210beca9d3aa",
          },
        ],
      },
      {
        name: "1323 MadTown Robotics",
        place: "Madera, CA",
        body: "2026 world champions, their fourth title. The team moved into a new building on the Matilda Torres High School campus and draws students from three district high schools.",
        sources: [
          {
            label: "Madera Tribune",
            url: "https://maderatribune.com/es/?p=2673",
          },
          {
            label: "Madera County EDC",
            url: "https://maderacountyedc.com/madera-unified-robotics-team-repeats-as-world-champions-for-4th-title/",
          },
        ],
      },
      {
        name: "180 S.P.A.M.",
        place: "Stuart, FL",
        body: "A 6,500 sq ft space at the Martin County school district offices with a full-size competition field. The team hosts other teams there.",
        sources: [
          {
            label: "Team website",
            url: "https://www.spamrobotics.org/robobics-center",
          },
        ],
      },
      {
        name: "Fremont Union High School District",
        place: "Cupertino, CA",
        body: "A 14,500 sq ft robotics center at Cupertino High serving five campuses and up to 900 students, with a field and spectator seating. Funded by a 2022 bond and opened in September 2026. A multi-school center, not a single-school comparison.",
        sources: [
          {
            label: "Hoodline",
            url: "https://hoodline.com/2026/09/cupertino-high-debuts-14-500-square-foot-robotics-hub-for-five-campuses/",
          },
          {
            label: "THE Journal",
            url: "https://thejournal.com/articles/2025/05/22/california-district-to-build-new-robotics-facility-for-student-creativity-and-collaboration.aspx",
          },
        ],
      },
    ],
  },
  {
    model: "Off-site, team-controlled",
    summary:
      "Teams without school space rely on sponsors, rented buildings, or their own nonprofit.",
    teams: [
      {
        name: "195 CyberKnights",
        place: "Southington, CT",
        body: "2024 New England District champions. Based at Southington High but largely self-funded, with a practice field in space donated by a sponsor.",
        sources: [
          {
            label: "Patch",
            url: "https://patch.com/connecticut/southington/cyberknights-finish-first-competition",
          },
          {
            label: "CT Senate Republicans",
            url: "https://ctsenaterepublicans.com/?p=21559",
          },
        ],
      },
      {
        name: "6328 Mechanical Advantage",
        place: "Littleton, MA",
        body: "A community team run by a 501(c)(3) and drawing from several schools. It works out of a commercial R&D building.",
        sources: [
          {
            label: "Team website",
            url: "https://www.littletonrobotics.org/about-6328/",
          },
        ],
      },
      {
        name: "Team 299",
        place: "",
        body: "A mentor reports paying about $30,000 a year in rent for team space.",
        sources: [
          {
            label: "Chief Delphi",
            url: "https://www.chiefdelphi.com/t/what-is-the-highest-budget-frc-team/407065?page=5",
          },
        ],
      },
    ],
  },
  {
    model: "Shared or makeshift",
    summary:
      "Teams book time on another group's field or share a room with other school uses.",
    teams: [
      {
        name: "WPI Community Practice Field",
        place: "Worcester, MA",
        body: "A full-scale field open to all FRC teams by advance sign-up since 2023. It is the nearest shared field to Melrose.",
        sources: [
          {
            label: "WPI",
            url: "https://www.wpi.edu/k-12/robotics-resource-center/program-management",
          },
        ],
      },
      {
        name: "Choate Robotics",
        place: "Wallingford, CT",
        body: "An FRC practice field in a gym shared with the archery team.",
        sources: [
          {
            label: "Choate Robotics",
            url: "https://robotics.choate.edu/our-spaces/",
          },
        ],
      },
      {
        name: "6329 The Bucks' Wrath",
        place: "Bucksport, ME",
        body: "A small rural school that reached the Einstein finals in 2023 and 2026, supported by a $250,000 alumni STEM donation. Facility details were not found.",
        sources: [
          {
            label: "Bangor Daily News",
            url: "https://www.bangordailynews.com/2023/03/19/news/hancock/bucksport-robotics-team-success-joam40zk0w/",
          },
        ],
      },
    ],
  },
];

/**
 * Approximate floor area for FRC spaces, smallest first. `sqft` is a single
 * figure or a [low, high] range.
 */
export const spaceBenchmarks: {
  space: string;
  sqft: number | [number, number];
  basis: string;
}[] = [
  {
    space: "Typical classroom",
    sqft: 900,
    basis: "Rule of thumb, for reference",
  },
  {
    space: "Half field with margins",
    sqft: [1000, 1400],
    basis: "About 27 × 27 ft of carpet plus margins",
  },
  {
    space: "Full field, carpet only",
    sqft: 1458,
    basis: "27 × 54 ft; varies slightly by season",
  },
  {
    space: "Full field with driver stations and equipment",
    sqft: 2800,
    basis: "About 40 × 70 ft, per Chief Delphi",
  },
  {
    space: "Working shop",
    sqft: 3000,
    basis: "One team's planned shop, per Chief Delphi",
  },
  { space: "180 S.P.A.M. facility", sqft: 6500, basis: "Team website" },
  {
    space: "1678 Citrus Circuits facility",
    sqft: 7800,
    basis: "CA Dept. of Education",
  },
  {
    space: "Fremont Union HSD center (five schools)",
    sqft: 14500,
    basis: "News coverage",
  },
];

export const spaceSources: Source[] = [
  {
    label: "Full-field practice facilities",
    url: "https://www.chiefdelphi.com/t/full-field-practice-facilities-how/128477",
  },
  {
    label: "Smallest possible practice field",
    url: "https://www.chiefdelphi.com/t/what-is-the-smallest-possible-practice-field/469654",
  },
  {
    label: "Ideal robot workspace",
    url: "https://www.chiefdelphi.com/t/whats-your-ideal-robot-workspace/119771",
  },
];

/** Suggested annual budget tiers drawn from published team figures. */
export const budgetTiers = [
  { tier: "Functional", amount: "≈ $15,000–30,000" },
  {
    tier: "Competitive district team that reaches Worlds",
    amount: "≈ $50,000–80,000",
  },
  { tier: "Perennial world-level program", amount: "$150,000+" },
];

export const budgetPoints = [
  {
    who: "Mentor survey of other teams",
    figure: "$10k–80k range",
    note: "Varies with events attended, travel distance, and whether the school covers space and insurance",
    url: "https://www.chiefdelphi.com/t/team-budget-per-season/145475",
  },
  {
    who: "Unnamed competitive team",
    figure: "$60k–80k a year",
    note: "Only $20–25k on robot parts and tools; the rest is travel, registration, and away events",
    url: "https://www.chiefdelphi.com/t/what-is-the-highest-budget-frc-team/407065",
  },
  {
    who: "195 CyberKnights",
    figure: "≈ $58k expenses (2024)",
    note: "Nonprofit filing; $77.6k revenue",
    url: "https://www.causeiq.com/organizations/cyberknights-robotics,923725101",
  },
  {
    who: "1678 Citrus Circuits",
    figure: "≈ $150k a year",
    note: "Reported by LocalWiki Davis",
    url: "https://localwiki.org/davis/Citrus_Circuits_Robotics",
  },
  {
    who: "5727 Omegabytes",
    figure: "$250k+ a year",
    note: "Highest-budget team cited on Chief Delphi",
    url: "https://www.chiefdelphi.com/t/what-is-the-highest-budget-frc-team/407065",
  },
  {
    who: "2713 Red Hawk Robotics",
    figure: "$80k+ in sponsorships",
    note: "Record season, reported in local news",
    url: "https://dev.localheadlinenews.com/?p=199040",
  },
];
