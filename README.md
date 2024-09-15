## Inspiration 👴🏻
Our parents/grandparents have been exposed to harmful misinformation online, which has negatively impacted our families. This inspired us to create a tool that not only protects our loved ones but also empowers others to navigate the web more safely and critically.

## What it does 🚨
Bullsift acts as a "firewall" against fake news. It assesses the safety and credibility of websites, alerts users if a site is untrustworthy, and offers a game to explain why the content is flagged, providing users with factual information for a deeper understanding. With this tool, even tech-savvy grandkids will be asking grandparents if the news is real or fake!

## How we built it 🔧
We developed a Chrome extension that seamlessly integrates into your browsing experience, offering real-time content analysis for fake news detection. Powered by Cohere's Command R Model, our multi-layer detection system ensures users are equipped with tools to verify the credibility of online information. Each layer of detection is carefully engineered to deliver comprehensive insights, ensuring a smooth and intuitive user experience. The layers include:

- Sensationalism Detection: Used to spot exaggerated phrases within articles.
- Source Credibility Verification: Cross-referencing sources to evaluate trustworthiness.
- Fact-Checking Automation: Comparing claims to trusted news outlets to highlight any discrepancies.
- Fakeness Scoring System: Providing a detailed "fakeness score," based on bias and credibility analysis.

##Challenges we ran into 🏁
- Defining and grading truthfulness was complex, requiring accurate detection of bias and sensationalism.
- Integrating multiple API calls synchronously for the multi-layer detection system was technically challenging.
- Making the experience fun and engaging, especially for grandparents.

##Accomplishments that we're proud of 🌟
- Developing a highly accurate detection system that flags misinformation in real-time using Cohere’s powerful AI.
- Creating a fun and engaging learning experience for grandparents, encouraging critical thinking and empowering them to spot fake news.
- Designing a user-friendly, interactive, and aesthetically pleasing UI/UX that simplifies complex processes.

##What we learned 📖
- Using Cohere’s LLM models in different ways to achieve the fakeness detection system
- Grinding with 2 hours of sleep!

##What's next for Bullsift 📈
Our next step is to implement a feature that allows parents to monitor their children's exposure to fake news, offering a safeguard against repeated exposure to harmful misinformation and encouraging healthier online habits.

## To test out this extension

1. Clone this repository to your local machine.
2. Visit `chrome://extensions` in your (Google Chrome) browser
3. Toggle 'Developer mode' on
4. Click 'Load Unpacked' and select the cloned directory (make sure it's unzipped if you downloaded it directly from this repo)
5. Open a new tab and click the extension's icon to open its popup & see it in action
