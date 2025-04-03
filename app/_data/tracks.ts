interface Tracks {
  [track: string]: {
    attribute: string;
    guidelines: {
      1: string;
      3: string;
      5: string;
    };
  }[];
}

const tracks: Tracks = {
  'Best Beginner Hack': [
    {
      attribute: 'Demonstration of skill growth and learning progression',
      guidelines: {
        1: 'Minimal evidence of learning or growth.',
        3: 'Moderate improvement with some evidence of learning.',
        5: 'Significant growth with substantial learning throughout the project.',
      },
    },
    {
      attribute: 'Effective teamwork and collaboration among beginners',
      guidelines: {
        1: 'Limited teamwork with minimal collaboration.',
        3: 'Some teamwork with occasional collaboration.',
        5: 'Excellent teamwork with strong collaboration.',
      },
    },
    {
      attribute: 'Commitment to overcoming challenges and building skills',
      guidelines: {
        1: 'Minimal effort to overcome challenges.',
        3: 'Moderate effort with some success.',
        5: 'Exceptional determination and skill-building.',
      },
    },
  ],

  'Best Interdisciplinary Hack': [
    {
      attribute: 'Integration of knowledge from multiple disciplines',
      guidelines: {
        1: 'Little to no interdisciplinary integration.',
        3: 'Some integration with moderate effectiveness.',
        5: 'Seamless integration across disciplines.',
      },
    },
    {
      attribute: 'Innovative approach combining diverse perspectives',
      guidelines: {
        1: 'Minimal innovation with few perspectives.',
        3: 'Moderate innovation with some diverse input.',
        5: 'Highly innovative with well-integrated perspectives.',
      },
    },
    {
      attribute: 'Impact of non-technical insights on the project outcome',
      guidelines: {
        1: 'Limited or no impact from non-technical insights.',
        3: 'Moderate impact with some non-technical influence.',
        5: 'Significant and transformative non-technical impact.',
      },
    },
  ],

  'Best Hack for Social Justice': [
    {
      attribute: 'Tangible impact on a social justice issue',
      guidelines: {
        1: 'Minimal or unclear impact.',
        3: 'Moderate impact with some measurable outcomes.',
        5: 'Significant and meaningful impact with clear outcomes.',
      },
    },
    {
      attribute: 'Effectiveness in raising awareness or educating the audience',
      guidelines: {
        1: 'Limited educational or awareness efforts.',
        3: 'Moderate effectiveness in raising awareness.',
        5: 'Highly effective in educating and engaging the audience.',
      },
    },
    {
      attribute: 'Sustainability and scalability of the proposed solution',
      guidelines: {
        1: 'Minimal consideration for sustainability.',
        3: 'Some sustainability with potential for scaling.',
        5: 'Highly sustainable with clear scalability.',
      },
    },
  ],

  'Most Creative Hack': [
    {
      attribute: 'Originality and uniqueness of the concept',
      guidelines: {
        1: 'Common or derivative concept.',
        3: 'Some originality with unique elements.',
        5: 'Truly unique and original concept.',
      },
    },
    {
      attribute: 'Innovative problem-solving approach',
      guidelines: {
        1: 'Minimal innovation in solving problems.',
        3: 'Moderate innovation with creative solutions.',
        5: 'Highly innovative and groundbreaking solutions.',
      },
    },
    {
      attribute: 'Ability to surprise and engage the audience',
      guidelines: {
        1: 'Limited engagement or surprise.',
        3: 'Moderate engagement with some surprise elements.',
        5: 'Highly engaging and memorable experience.',
      },
    },
  ],

  'Best Hardware Hack': [
    {
      attribute: 'Seamless integration of hardware components',
      guidelines: {
        1: 'Hardware is poorly integrated or non-functional.',
        3: 'Hardware is functional but with minor integration issues.',
        5: 'Hardware is seamlessly integrated and fully functional.',
      },
    },
    {
      attribute: 'Functionality and reliability of the hardware system',
      guidelines: {
        1: 'Limited functionality with frequent issues.',
        3: 'Reliable performance with occasional issues.',
        5: 'Consistent and reliable performance under various conditions.',
      },
    },
    {
      attribute: 'Interactivity and user-friendliness',
      guidelines: {
        1: 'Minimal user interaction with poor usability.',
        3: 'Moderate interaction with some usability concerns.',
        5: 'Highly interactive and intuitive for users.',
      },
    },
  ],

  'Most Technically Challenging Hack': [
    {
      attribute: 'Complexity of technical implementation',
      guidelines: {
        1: 'Minimal complexity with basic implementation.',
        3: 'Moderate complexity with some technical depth.',
        5: 'High complexity with advanced technical implementation.',
      },
    },
    {
      attribute: 'Effective use of advanced tools and technologies',
      guidelines: {
        1: 'Limited or ineffective use of advanced tools.',
        3: 'Moderate use with partial effectiveness.',
        5: 'Highly effective use of advanced tools and technologies.',
      },
    },
    {
      attribute: 'Scalability and performance optimization',
      guidelines: {
        1: 'Minimal scalability with performance issues.',
        3: 'Moderate scalability with acceptable performance.',
        5: 'Highly scalable with optimized performance.',
      },
    },
  ],

  'Best UI/UX Design': [
    {
      attribute: 'Aesthetic appeal and visual consistency',
      guidelines: {
        1: 'Poor visual appeal with inconsistencies.',
        3: 'Moderate appeal with some consistency.',
        5: 'Exceptional aesthetic with high consistency.',
      },
    },
    {
      attribute: 'Intuitive user flow and ease of navigation',
      guidelines: {
        1: 'Difficult to navigate with poor flow.',
        3: 'Moderate ease of navigation with some issues.',
        5: 'Highly intuitive with seamless navigation.',
      },
    },
    {
      attribute: 'Responsiveness and adaptability across devices',
      guidelines: {
        1: 'Limited responsiveness with device issues.',
        3: 'Moderate responsiveness with minor issues.',
        5: 'Highly responsive across all devices.',
      },
    },
  ],

  'Best User Research': [
    {
      attribute: 'Depth and quality of user research conducted',
      guidelines: {
        1: 'Minimal research with poor depth.',
        3: 'Moderate research with acceptable depth.',
        5: 'Thorough research with high depth and quality.',
      },
    },
    {
      attribute: 'Incorporation of user feedback into the final design',
      guidelines: {
        1: 'Minimal incorporation of feedback.',
        3: 'Moderate incorporation with some impact.',
        5: 'Extensive incorporation with significant impact.',
      },
    },
    {
      attribute: 'Focus on inclusivity and accessibility',
      guidelines: {
        1: 'Minimal inclusivity with accessibility issues.',
        3: 'Moderate inclusivity with some accessibility.',
        5: 'Highly inclusive with excellent accessibility.',
      },
    },
  ],

  'Best Entrepreneurship Hack': [
    {
      attribute: 'Viability and feasibility of the business model',
      guidelines: {
        1: 'Unviable or unrealistic model.',
        3: 'Moderately viable with some feasibility.',
        5: 'Highly viable and feasible business model.',
      },
    },
    {
      attribute: 'Clarity and persuasiveness of the pitch',
      guidelines: {
        1: 'Unclear and unconvincing pitch.',
        3: 'Moderately clear with some persuasion.',
        5: 'Highly persuasive and clear pitch.',
      },
    },
    {
      attribute: 'Identification of target market and revenue streams',
      guidelines: {
        1: 'Minimal understanding of the market.',
        3: 'Moderate understanding with some insights.',
        5: 'Comprehensive market understanding with clear revenue streams.',
      },
    },
  ],

  'Best Statistical Model': [
    {
      attribute: 'Accuracy and reliability of the statistical model',
      guidelines: {
        1: 'Low accuracy with unreliable results.',
        3: 'Moderate accuracy with some reliable outcomes.',
        5: 'High accuracy with consistently reliable results.',
      },
    },
    {
      attribute: 'Appropriate use of significance tests and metrics',
      guidelines: {
        1: 'Inappropriate or minimal use of metrics.',
        3: 'Moderate use with partially relevant metrics.',
        5: 'Excellent use with highly relevant metrics.',
      },
    },
    {
      attribute: "Interpretability and clarity of the model's output",
      guidelines: {
        1: 'Difficult to interpret or unclear.',
        3: 'Moderately clear with some interpretability.',
        5: 'Highly interpretable and clearly presented.',
      },
    },
  ],
  'Open Data Hack': [
    {
      attribute: 'Effective use of publicly accessible datasets',
      guidelines: {
        1: 'Minimal use with little relevance.',
        3: 'Moderate use with some relevance.',
        5: 'Extensive and highly relevant use of datasets.',
      },
    },
    {
      attribute: 'Quality and clarity of data visualization',
      guidelines: {
        1: 'Poor visualization with minimal clarity.',
        3: 'Moderate clarity with some quality.',
        5: 'High-quality visualization with excellent clarity.',
      },
    },
    {
      attribute: 'Reproducibility and thorough documentation',
      guidelines: {
        1: 'Minimal documentation with poor reproducibility.',
        3: 'Moderate documentation with some reproducibility.',
        5: 'Comprehensive documentation with high reproducibility.',
      },
    },
  ],

  'Best Medtech Hack': [
    {
      attribute: 'Relevance to health and well-being themes',
      guidelines: {
        1: 'Minimal relevance to health topics.',
        3: 'Moderate relevance with some impact.',
        5: 'Highly relevant with significant health impact.',
      },
    },
    {
      attribute: 'Effectiveness in addressing accessibility or service issues',
      guidelines: {
        1: 'Limited effectiveness with minimal impact.',
        3: 'Moderate effectiveness with some impact.',
        5: 'Highly effective with significant positive impact.',
      },
    },
    {
      attribute: 'Potential for real-world application',
      guidelines: {
        1: 'Minimal potential with unlikely application.',
        3: 'Moderate potential with some applicability.',
        5: 'High potential with clear real-world applicability.',
      },
    },
  ],

  'Best AI/ML Hack': [
    {
      attribute: 'Innovation and creativity in AI/ML functionality',
      guidelines: {
        1: 'Minimal innovation with basic functionality.',
        3: 'Moderate innovation with some creative elements.',
        5: 'Highly innovative with unique functionality.',
      },
    },
    {
      attribute: 'Accuracy and performance of the model',
      guidelines: {
        1: 'Low accuracy with poor performance.',
        3: 'Moderate accuracy with acceptable performance.',
        5: 'High accuracy with excellent performance.',
      },
    },
    {
      attribute: 'Generalization and versatility to unseen data',
      guidelines: {
        1: 'Minimal generalization with poor versatility.',
        3: 'Moderate generalization with some versatility.',
        5: 'Highly generalizable with strong versatility.',
      },
    },
  ],
};

export default tracks;
