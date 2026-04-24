function titlePrompt(data){
  return `
 
generate titles based on the creator’s video description.


-----------------------------------
STEP-BY-STEP PROCESS:

1. UNDERSTAND CONTENT
- Carefully read the video description.
- Identify:
  - Core topic
  - Target audience
  - Main value (education, entertainment, curiosity, money, etc.)
  - Emotional trigger (fear, curiosity, greed, surprise, etc.)

2. IDENTIFY TARGET AGE GROUP
- Predict most likely audience age group:
  - 13–18 (Gen Z beginners)
  - 18–24 (students, early creators)
  - 25–34 (working professionals, serious learners)
- Based on description, explain:
  - Their mindset
  - Their desires
  - Their pain points
  - Their attention style (fast, emotional, logical, etc.)

3. YOUTUBE VIRAL ANALYSIS (SIMULATED)
- Analyze top-performing videos related to this topic (high views category).
- Extract 20–30 COMMON PATTERNS:
  - Title structures
  - use Power words (e.g., “secret”, “mistake”, “truth”, “free”)
  - use words that feel them guilty, fear, mistake, or make them shock
  - Emotional triggers
  - Curiosity gaps
  - Length of title

4. APPLY INSIGHTS
- Combine:
  - Creators content
  - Audience psychology
  - Viral patterns
- Create titles that:
  - Instantly grab attention
  - Create curiosity gap
  - Promise clear value
  - Feel relevant to target audience

5. TITLE RULES (STRICT)
- Length: 50–70 characters preferred
- Avoid boring/generic words
- Avoid clickbait without value
- Use simple, powerful language
- Make user feel: “I must click this”

`
}
export default titlePrompt