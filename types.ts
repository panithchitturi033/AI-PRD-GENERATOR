
export interface UserPersona {
  name: string;
  demographics: string;
  goals: string[];
  frustrations: string[];
}

export interface Feature {
  featureName: string;
  description: string;
  userStories: string[];
  priority: 'High' | 'Medium' | 'Low';
}

export interface NonFunctionalRequirement {
  requirement: string;
  details: string;
}

export interface PRD {
  title: string;
  introduction: {
    problemStatement: string;
    solution: string;
    targetAudience: string;
  };
  userPersonas: UserPersona[];
  features: Feature[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  successMetrics: string[];
}
