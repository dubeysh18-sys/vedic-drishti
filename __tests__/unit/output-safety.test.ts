import { OutputSafetyService } from "@/services/output-safety.service";
import { StructuredReflection } from "@/types/reflection";

describe("OutputSafetyService (Post-Generation Layer)", () => {
  const service = new OutputSafetyService();

  it("should pass legitimate reflection with philosophical discussion of death and war", () => {
    const validReflection: StructuredReflection = {
      whatIHear: "It sounds like you are reflecting on loss and the temporary nature of life.",
      perspectiveFromText: "Bhagavad Gita 2.20",
      teaching: "The Gita teaches the immortality of the conscious soul (atman) and why Krishna explained the nature of war and duty on the battlefield of Kurukshetra.",
      application: "Consider observing this sorrow as evidence of love, resting in the eternal stillness within.",
      reflectionQuestion: "What part of you remains undisturbed by outer change?",
      caveats: null,
    };

    const result = service.validateOutput(validReflection);
    expect(result.passed).toBe(true);
  });

  it("should flag explicit sexual content in generated output", () => {
    const explicitReflection: StructuredReflection = {
      whatIHear: "Listening to your request.",
      perspectiveFromText: "None",
      teaching: "Here is an erotic scene with explicit sexual act details.",
      application: "Enjoy this fantasy.",
      reflectionQuestion: "How do you feel?",
      caveats: null,
    };

    const result = service.validateOutput(explicitReflection);
    expect(result.passed).toBe(false);
    expect(result.category).toBe("EXPLICIT_SEXUAL");
  });

  it("should flag violent instructions in output", () => {
    const violentReflection: StructuredReflection = {
      whatIHear: "Hearing your anger.",
      perspectiveFromText: "None",
      teaching: "Follow these step-by-step instructions to kill your adversary.",
      application: "Act swiftly.",
      reflectionQuestion: "Will you strike?",
      caveats: null,
    };

    const result = service.validateOutput(violentReflection);
    expect(result.passed).toBe(false);
    expect(result.category).toBe("VIOLENT_WRONGDOING");
  });

  it("should flag medical certainty or psychiatric diagnoses", () => {
    const medicalReflection: StructuredReflection = {
      whatIHear: "I see your symptoms.",
      perspectiveFromText: "None",
      teaching: "You are diagnosed with clinical depression diagnosis and should stop taking your medication.",
      application: "Follow this medical directive.",
      reflectionQuestion: "Are you ready?",
      caveats: null,
    };

    const result = service.validateOutput(medicalReflection);
    expect(result.passed).toBe(false);
    expect(result.category).toBe("MEDICAL_LEGAL_OVERREACH");
  });

  it("should flag spiritual coercion and divine damnation claims", () => {
    const coerciveReflection: StructuredReflection = {
      whatIHear: "I see your life.",
      perspectiveFromText: "None",
      teaching: "You will go to hell unless you perform this ritual because your past life karma was evil.",
      application: "Repent now.",
      reflectionQuestion: "Will you obey?",
      caveats: null,
    };

    const result = service.validateOutput(coerciveReflection);
    expect(result.passed).toBe(false);
    expect(result.category).toBe("SPIRITUAL_COERCION");
  });
});
