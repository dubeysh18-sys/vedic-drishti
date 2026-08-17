import { CrisisResource } from "@/types/reflection";

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    country: "India",
    resourceName: "KIRAN Mental Health Helpline",
    resourceType: "hotline",
    phone: "1800-599-0019",
    website: "https://www.mohfw.gov.in",
    source: "Ministry of Social Justice and Empowerment, Govt. of India",
    lastVerifiedAt: null, // As per implementation plan: unverified in MVP until manual verification
    active: true,
  },
  {
    country: "India",
    resourceName: "Tele-MANAS (Tele Mental Health Assistance and Networking Across States)",
    resourceType: "hotline",
    phone: "14416 / 1800-891-4416",
    website: "https://telemanas.mohfw.gov.in",
    source: "Ministry of Health & Family Welfare, Govt. of India",
    lastVerifiedAt: null,
    active: true,
  },
  {
    country: "India",
    resourceName: "Vandrevala Foundation Helpline",
    resourceType: "hotline",
    phone: "+91 9999 666 555",
    website: "https://www.vandrevalafoundation.com",
    source: "Vandrevala Foundation",
    lastVerifiedAt: null,
    active: true,
  },
  {
    country: "United States / International",
    resourceName: "988 Suicide & Crisis Lifeline",
    resourceType: "hotline",
    phone: "988",
    website: "https://988lifeline.org",
    source: "SAMHSA / Vibrant Emotional Health",
    lastVerifiedAt: null,
    active: true,
  },
  {
    country: "United States / International",
    resourceName: "Crisis Text Line",
    resourceType: "textline",
    phone: "Text HOME to 741741",
    website: "https://www.crisistextline.org",
    source: "Crisis Text Line",
    lastVerifiedAt: null,
    active: true,
  },
  {
    country: "International",
    resourceName: "Befrienders Worldwide",
    resourceType: "website",
    phone: null,
    website: "https://www.befrienders.org",
    source: "Befrienders Worldwide",
    lastVerifiedAt: null,
    active: true,
  },
];

export const CRISIS_DISCLAIMER =
  "Drishti is a philosophical and reflective companion, not a mental health, medical, or emergency service. If you are experiencing thoughts of self-harm, severe distress, or need urgent support, please reach out to trusted professionals or the helpline resources above immediately.";
