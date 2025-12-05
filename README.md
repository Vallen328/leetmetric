# 📊 LeetMetric — LeetCode Stats Dashboard

LeetMetric is a clean, modern, SaaS-style dashboard that visualizes a user's LeetCode progress using animated charts, difficulty progress circles, and detailed insights.

🔥 **Live Demo:**  
https://vallen328.github.io/leetmetric/

---

## 🚀 Features

- 🔍 Search any LeetCode username  
- 📈 Animated difficulty progress rings (Easy / Medium / Hard)  
- 🧮 Overview statistics (total solved, days active, etc.)  
- 📉 Sparkline mini-chart for submission activity  
- 💾 Download stats as JSON  
- 📋 One-click “Copy Stats” button  
- 💨 Skeleton loading + smooth UI animations  
- 🌓 Modern responsive UI (SaaS-grade design)

---

## 🛠 Tech Stack

- **HTML5**
- **CSS3 (Custom design system)**
- **JavaScript (Vanilla JS)**
- **Chart.js (sparkline)**
- **GitHub Pages** for deployment
- **LeetCode Stats API**  
  `https://leetcode-stats-api.herokuapp.com/<username>`

---

## 📷 Preview

![LeetMetric Preview](https://raw.githubusercontent.com/vallen328/leetmetric/main/preview.png)  
---

## ⚙️ How It Works

1. User enters a LeetCode username  
2. App fetches stats from the LeetCode Stats API  
3. UI updates:  
   - Progress circles animate  
   - Sparkline visualizes submissions  
   - Stats card metrics count up  
4. User can copy results or download them as JSON

---

## 📦 Installation (Local Development)

```bash
git clone https://github.com/vallen328/leetmetric
cd leetmetric
