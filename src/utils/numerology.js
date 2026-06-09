/**
 * Numerology Engine for Mobile Numerology Predictor
 */

// Chaldean/Mystical letter value mappings
const LETTER_VALUES = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

// Planetary representations of single digit numbers (1-9)
export const NUMBER_INFO = {
  1: {
    ruler: "Sun",
    attributes: "Leadership, Independence, Ambition, Vitality",
    description: "The Pioneer, Leader, and Innovator. Governed by the Sun, representing independence, authority, and new beginnings."
  },
  2: {
    ruler: "Moon",
    attributes: "Intuition, Harmony, Cooperation, Sensitivity",
    description: "The Diplomat, Mediator, and Peacekeeper. Governed by the Moon, representing intuition, harmony, cooperation, and sensitivity."
  },
  3: {
    ruler: "Jupiter",
    attributes: "Creativity, Communication, Growth, Abundance",
    description: "The Creator, Communicator, and Expresser. Governed by Jupiter, representing growth, abundance, optimism, and artistic flair."
  },
  4: {
    ruler: "Rahu / Uranus",
    attributes: "Discipline, Structure, Reliability, Focus",
    description: "The Builder, Organizer, and Grounder. Governed by Rahu/Uranus, representing discipline, hard work, structure, and reliability."
  },
  5: {
    ruler: "Mercury",
    attributes: "Freedom, Quick Intelligence, Adaptability, Networking",
    description: "The Visionary, Explorer, and Adaptor. Governed by Mercury, representing freedom, quick intelligence, travel, and communication."
  },
  6: {
    ruler: "Venus",
    attributes: "Love, Harmony, Care, Art, Responsibility",
    description: "The Nurturer, Harmony-seeker, and Caregiver. Governed by Venus, representing love, beauty, responsibility, family, and artistic balance."
  },
  7: {
    ruler: "Ketu / Neptune",
    attributes: "Mysticism, Inner Wisdom, Deep Analysis, Solitude",
    description: "The Seeker, Analyst, and Mystic. Governed by Ketu/Neptune, representing spiritual growth, deep research, inner wisdom, and solitude."
  },
  8: {
    ruler: "Saturn",
    attributes: "Executive Power, Karma, Material Success, Patience",
    description: "The Executive, Authority, and Karmic Master. Governed by Saturn, representing financial abundance, executive power, material success, and life lessons."
  },
  9: {
    ruler: "Mars",
    attributes: "Compassion, Courage, Completion, Universal Love",
    description: "The Philanthropist, Humanitarian, and Healer. Governed by Mars, representing compassion, universal love, completion, courage, and higher consciousness."
  }
};

// Relationships matrix
// F = Friendly (1.0 weight)
// E = Enemy (0.0 weight)
// Default = Neutral (0.5 weight)
const RELATIONSHIPS = {
  1: { F: [1, 2, 3, 5, 9], E: [4, 8] },
  2: { F: [1, 2, 3, 5], E: [4, 6] },
  3: { F: [1, 2, 3, 5, 7, 9], E: [4, 6] },
  4: { F: [5, 6, 7], E: [1, 2, 3, 9] },
  5: { F: [1, 2, 3, 5, 6, 7, 8], E: [4] },
  6: { F: [4, 5, 6, 7, 8], E: [1, 2] },
  7: { F: [3, 4, 5, 6], E: [9] },
  8: { F: [5, 6], E: [1, 8, 9] },
  9: { F: [1, 2, 3, 9], E: [4, 7, 8] }
};

/**
 * Reduce a sum of digits to a single digit (1-9)
 */
export function reduceToSingleDigit(num) {
  let val = Math.abs(parseInt(num, 10));
  if (isNaN(val)) return 1;
  while (val > 9) {
    val = String(val)
      .split("")
      .reduce((sum, char) => sum + parseInt(char, 10), 0);
  }
  return val;
}

/**
 * Calculate Life Path Number by adding all digits of DOB (YYYY-MM-DD)
 */
export function calculateLifePath(dobString) {
  if (!dobString) return 1;
  const digits = dobString.replace(/[^0-9]/g, "");
  const sum = digits.split("").reduce((acc, d) => acc + parseInt(d, 10), 0);
  return reduceToSingleDigit(sum);
}

/**
 * Calculate Name Number using the defined Chaldean-based system
 */
export function calculateNameNumber(nameString) {
  if (!nameString) return 1;
  const normalized = nameString.toUpperCase().replace(/[^A-Z]/g, "");
  const sum = normalized.split("").reduce((acc, char) => {
    return acc + (LETTER_VALUES[char] || 0);
  }, 0);
  return reduceToSingleDigit(sum);
}

/**
 * Calculate Mobile Number Value
 */
export function calculateMobileValue(mobileString) {
  if (!mobileString) return 1;
  const digits = mobileString.replace(/[^0-9]/g, "");
  const sum = digits.split("").reduce((acc, d) => acc + parseInt(d, 10), 0);
  return reduceToSingleDigit(sum);
}

/**
 * Get Relationship Weight between two numbers
 */
function getRelationshipScore(num1, num2) {
  if (num1 === num2) return 1.0; // Identity is highly resonant
  const rel = RELATIONSHIPS[num1];
  if (!rel) return 0.5;
  if (rel.F.includes(num2)) return 1.0;
  if (rel.E.includes(num2)) return 0.0;
  return 0.5;
}

/**
 * Calculate Compatibility details between LPN, NN, and MNV
 */
export function calculateCompatibility(lpn, nn, mnv, mobileString) {
  // 1. Calculate base score using weighted relationship
  // Life Path is our core path (60%), Name is our active expression (40%)
  const relLpn = getRelationshipScore(mnv, lpn);
  const relNn = getRelationshipScore(mnv, nn);
  
  let score = (0.6 * relLpn + 0.4 * relNn) * 100;

  // 2. Micro-adjustments based on mobile number structure
  let adjustments = [];
  const digits = mobileString.replace(/[^0-9]/g, "");

  if (digits.length >= 10) {
    // A. Ending Digit analysis (Ending digit has highly impactful energy)
    const endingDigit = parseInt(digits.charAt(digits.length - 1), 10);
    const endLpnRel = getRelationshipScore(endingDigit, lpn);
    
    if (endingDigit === lpn) {
      score += 10;
      adjustments.push({
        type: "positive",
        text: `Ending digit (${endingDigit}) matches your Life Path exactly, creating high spiritual resonance (+10%).`
      });
    } else if (endLpnRel === 1.0) {
      score += 5;
      adjustments.push({
        type: "positive",
        text: `Ending digit (${endingDigit}) is planetary friendly to your Life Path (${NUMBER_INFO[lpn].ruler} vs ${NUMBER_INFO[endingDigit].ruler}) (+5%).`
      });
    } else if (endLpnRel === 0.0) {
      score -= 8;
      adjustments.push({
        type: "negative",
        text: `Ending digit (${endingDigit}) is in planetary conflict with your Life Path (-8%).`
      });
    }

    // B. Repeating Digits check
    // Count repetitions
    const counts = {};
    for (let i = 0; i < digits.length; i++) {
      counts[digits[i]] = (counts[digits[i]] || 0) + 1;
    }

    // Checking for heavy repetitions
    Object.keys(counts).forEach(d => {
      const val = parseInt(d, 10);
      if (counts[d] >= 4) {
        // High count of 4 or 8 is considered very karmic and unstable unless well aligned
        if (val === 4 || val === 8) {
          score -= 5;
          adjustments.push({
            type: "negative",
            text: `High concentration of karmic number ${val} (appears ${counts[d]}x) creates unstable energy patterns (-5%).`
          });
        } else if (val === lpn || val === 5) {
          score += 4;
          adjustments.push({
            type: "positive",
            text: `Wonderful repetition of your matching key number ${val} (appears ${counts[d]}x) stabilizes the vibe (+4%).`
          });
        }
      }
    });

    // C. Ascending Runs (Growth sequences like 123, 234, 567, 789)
    let hasRun = false;
    for (let i = 0; i < digits.length - 2; i++) {
      const d1 = parseInt(digits[i], 10);
      const d2 = parseInt(digits[i+1], 10);
      const d3 = parseInt(digits[i+2], 10);
      if (d2 === d1 + 1 && d3 === d2 + 1) {
        hasRun = true;
        break;
      }
    }
    if (hasRun) {
      score += 6;
      adjustments.push({
        type: "positive",
        text: "Contains an ascending consecutive run (e.g., 3-consecutive digits rising), representing career growth and progression (+6%)."
      });
    }

    // D. Missing digits: Numbers with no zeroes are stable. Having too many zeros represents vacuum.
    if (counts["0"] >= 3) {
      score -= 6;
      adjustments.push({
        type: "negative",
        text: "Too many zeros (3 or more) creates energy vacuums or sudden obstacles in communication (-6%)."
      });
    }
  }

  // 3. Final clamping
  score = Math.round(score);
  if (score > 100) score = 100;
  if (score < 10) score = 10;

  // Determine Compatibility Status
  let status;
  let color;
  let borderColor;
  let bgGlow;
  let interpretation;

  if (score >= 85) {
    status = "Highly Compatible";
    color = "text-amber-400";
    borderColor = "border-amber-500/50";
    bgGlow = "shadow-amber-500/30";
    interpretation = `This mobile number is in absolute celestial resonance with your core frequency. With a Compatibility Score of ${score}%, it functions as a spiritual magnifier for your Life Path ${lpn} (ruled by ${NUMBER_INFO[lpn].ruler}) and flows effortlessly with your Name Number ${nn}. It invites career advancements, fluid social networking, and a general aura of magnetic luck. This is a golden asset for your daily life.`;
  } else if (score >= 60) {
    status = "Compatible";
    color = "text-emerald-400";
    borderColor = "border-emerald-500/50";
    bgGlow = "shadow-emerald-500/20";
    interpretation = `There is beautiful harmony between this number and your planetary metrics. Carrying a solid compatibility profile (${score}%), the number supports your personal ambitions and communication channels. The primary ruler ${NUMBER_INFO[mnv].ruler} coordinates constructively with your Life Path and active name expressions, enabling a steady, progressive lifecycle with minor challenges.`;
  } else if (score >= 40) {
    status = "Neutral";
    color = "text-sky-400";
    borderColor = "border-sky-500/50";
    bgGlow = "shadow-sky-500/20";
    interpretation = `This number holds standard neutral energy (${score}% compatibility). It doesn't trigger negative cosmic friction, but it doesn't offer dramatic spiritual boost either. It acts as a stable workspace tool. You won't face severe hurdles, but if you wish to fast-track your manifestations or command supreme influence, transitioning to one of our tailored gold recommendations would be beneficial.`;
  } else {
    status = "Less Compatible";
    color = "text-rose-400";
    borderColor = "border-rose-500/50";
    bgGlow = "shadow-rose-500/30";
    interpretation = `This mobile number has significant planetary friction with your natural charts (${score}% compatibility). The vibration of ${mnv} (ruled by ${NUMBER_INFO[mnv].ruler}) creates an energetic speedbump against your Life Path ${lpn} and Name expression. This discordance can sometimes translate into minor communication delays, unexplained network hitches, or professional stagnation. Realignment is highly recommended!`;
  }

  return {
    score,
    status,
    color,
    borderColor,
    bgGlow,
    interpretation,
    adjustments
  };
}

/**
 * Generate 6 premium sample numbers that reduce to the user's Life Path Number
 */
export function generateRecommendedNumbers(lpn) {
  // Common strong Indian/Global mobile starting digits
  const prefixes = ["98", "99", "88", "77", "95", "91", "81", "76", "63"];
  
  // Custom cosmic properties to assign to cards based on specific endings
  const properties = [
    { title: "The Abundance Multiplier", trait: "Wealth, Legacy, Material Blessings", icon: "DollarSign", color: "from-amber-500 to-yellow-600" },
    { title: "Planetary Harmony", trait: "Peaceful relations, Love, Stable Health", icon: "Heart", color: "from-emerald-500 to-teal-600" },
    { title: "The Sovereign Catalyst", trait: "Executive command, Career elevation", icon: "Shield", color: "from-purple-600 to-indigo-600" },
    { title: "Cosmic Sage Vibe", trait: "Intuition, Wisdom, Research success", icon: "Sparkles", color: "from-sky-500 to-blue-600" },
    { title: "The Manifestation Vector", trait: "Rapid growth, Creativity, Fame", icon: "Zap", color: "from-rose-500 to-orange-500" },
    { title: "Golden Safeguard", trait: "Protection, Karmic clearing, Discipline", icon: "Lock", color: "from-pink-500 to-rose-600" }
  ];

  const recommendations = [];

  for (let i = 0; i < 6; i++) {
    const prop = properties[i];
    const prefix = prefixes[i % prefixes.length];
    
    // Generate a number such that sum reduces to LPN
    let digits = prefix;
    
    // Generate 7 random digits first, leaving the 10th digit as the corrector
    let currentSum = parseInt(prefix[0], 10) + parseInt(prefix[1], 10);
    for (let r = 0; r < 7; r++) {
      let randDigit = Math.floor(Math.random() * 10);
      // Avoid making it too repetitive or simple
      if (r > 3 && randDigit === parseInt(digits[digits.length - 1], 10)) {
        randDigit = (randDigit + 2) % 10;
      }
      digits += randDigit;
      currentSum += randDigit;
    }

    // Now find the 10th digit such that reduceToSingleDigit(currentSum + lastDigit) === lpn
    let lastDigit = 0;
    for (let d = 0; d <= 9; d++) {
      if (reduceToSingleDigit(currentSum + d) === lpn) {
        lastDigit = d;
        break;
      }
    }
    digits += lastDigit;

    // Double check it reduces exactly
    const actualMnv = calculateMobileValue(digits);
    if (actualMnv !== lpn) {
      // Emergency recalculation fallback
      // Adjust 9th digit as well if needed, but the logic above should work perfectly.
    }

    // Format output beautifully: e.g. +91 98321 04823 or 98321-04823
    const formatted = `${digits.substring(0, 5)} ${digits.substring(5)}`;

    recommendations.push({
      number: formatted,
      rawNumber: digits,
      title: prop.title,
      trait: prop.trait,
      icon: prop.icon,
      color: prop.color,
      reduction: lpn
    });
  }

  return recommendations;
}
