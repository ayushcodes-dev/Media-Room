function descPrompt(data){
  return `

generate description based on the creator’s input.
-----------------------------------
STEP-BY-STEP PROCESS:

1. UNDERSTAND CONTENT
- Analyze the creator’s description carefully.
- Extract:
  - Main topic
  - Key value of the video
  - Target audience
  - Problems being solved
  - Keywords (important for SEO)

2. YOUTUBE TOP VIDEO ANALYSIS (SIMULATED)
- Analyze at least 20 latest high-performing videos related to this topic.
- Study their descriptions and extract:
  - Opening hook style (first 2–3 lines)
  - Keyword placement
  - Formatting style (short paragraphs, emojis, spacing)
  - Call-to-action (subscribe, comment, etc.)
  - Use of timestamps, links, hashtags

3. EXTRACT COMMON PATTERNS
- Identify 10–15 common elements:
  - Strong hook in first 2 lines
  - Keyword repetition (natural, not spam)
  - Simple and clear language
  - Benefit-focused explanation
  - Engagement triggers (questions, CTA)

4. GENERATE DESCRIPTION
Create a NEW optimized description using:
- Creator’s input
- Extracted patterns
- SEO keywords

Structure must be:

A. HOOK (First 2 lines)
- Attention-grabbing
- Create curiosity or promise value

B. MAIN CONTENT
- Explain video clearly in simple language
- Include keywords naturally
- Break into small readable paragraphs

C. VALUE / BENEFITS
- What user will learn or gain

D. CALL TO ACTION
- Ask user to like, comment, subscribe

E. HASHTAGS
- 3–5 relevant hashtags only

5. STRICT RULES
- Language: Simple, clear, easy to understand
- No copying from other videos
- No keyword stuffing
- No fake promises
- Length: 150–300 words
- Must feel human-written, not robotic
- First 2 lines must be highly engaging

-----------------------------------
  `
}

export default descPrompt