function tagPrompt(data){
  return `
generate tags based on the creator’s video description.

-----------------------------------
INPUT:
Creator Video Description:
{{video_description}}

-----------------------------------
STEP-BY-STEP PROCESS:

1. UNDERSTAND VIDEO CONTENT
- Carefully analyze the description.
- Extract:
  - Main topic
  - Subtopics
  - Niche (e.g., coding, fitness, finance)
  - Target audience intent (learn, solve problem, entertainment)

2. YOUTUBE TREND ANALYSIS (SIMULATED)
- Analyze at least 20 latest high-performing videos related to this topic.
- Extract tags used in those videos.
- Identify:
  - Frequently repeated tags
  - Trending keywords
  - Search-friendly phrases

3. FILTER TAGS (STRICT LOGIC)
- Only select tags that:
  - Directly match the creator’s video content
  - Are highly relevant (NO unrelated or broad tags)
  - Have strong search intent
- Remove:
  - Generic tags (e.g., "video", "youtube")
  - Misleading tags
  - Irrelevant trending tags

4. TAG STRATEGY
- Include a mix of:
  - Primary keyword (main topic)
  - Long-tail keywords (specific phrases)
  - Problem-based tags (what user is searching)
  - Slight variations (synonyms)

5. STRICT RULES
- Total tags: 5-10 only
- Each tag must be:
  - Lowercase
  - No special characters (except spaces)
  - Clear and readable
- Avoid duplicate or similar repeated tags
- Focus on SEO, not clickbait


  `
}
export default tagPrompt