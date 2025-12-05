document.addEventListener("DOMContentLoaded", function(){
    // DOM Elements
    const searchBtn = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.getElementById("stats-container");
    const emptyState = document.getElementById("lm-empty-state");
    const errorState = document.getElementById("lm-error-state");
    const errorMsg = document.getElementById("lm-error-msg");
    const retryBtn = document.getElementById("lm-retry-btn");
    const skeleton = document.getElementById("lm-skeleton");
    
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    
    const cardStatsContainer = document.getElementById("stats-card");
    const copyBtn = document.getElementById("lm-copy-btn");
    const downloadBtn = document.getElementById("lm-download-btn");
    const themeBtn = document.getElementById("lm-theme-btn");
    const root = document.querySelector(".lm-root");
    const searchForm = document.getElementById("lm-search-form");

    let currentStats = null;

    // Theme toggle
    themeBtn.addEventListener("click", function() {
        const currentTheme = root.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("lm-theme", newTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem("lm-theme") || "dark";
    root.setAttribute("data-theme", savedTheme);

    // Validation
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username cannot be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,16}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid username");
        }
        return isMatching;
    }

    // Fetch user stats
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchBtn.setAttribute("aria-busy", "true");
            skeleton.style.display = "flex";
            statsContainer.hidden = false;
            emptyState.hidden = true;
            errorState.hidden = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            const parsedData = await response.json();

            if (parsedData.status === "error" || !parsedData.totalSolved) {
                throw new Error("No data found for this user");
            }

            currentStats = parsedData;
            displayUserStats(parsedData);
            skeleton.style.display = "none";
        } catch (error) {
            console.error(error);
            showError(error.message || "Failed to fetch data. Please try again.");
        } finally {
            searchBtn.setAttribute("aria-busy", "false");
        }
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorState.hidden = false;
        statsContainer.hidden = true;
        emptyState.hidden = true;
        skeleton.style.display = "none";
    }

    // Update progress circles
    function updateProgress(solved, total, label, circle) {
        const progressDegree = total > 0 ? (solved / total) * 100 : 0;
        circle.style.setProperty("--progress-degree", progressDegree);
        circle.setAttribute("aria-valuenow", Math.round(progressDegree));
        
        // Animate the number
        animateCounter(label, 0, solved);
    }

    // Animate counter
    function animateCounter(element, start, end) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            element.textContent = `${end}`;
            return;
        }
        
        const duration = 900;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end;
            }
        }
        
        requestAnimationFrame(update);
    }

    // Get total submissions from calendar
    function getTotalSubmissions(submissionCalendar) {
        if (!submissionCalendar) return 0;
        return Object.values(submissionCalendar).reduce((a, b) => a + b, 0);
    }

    // Build stats card HTML
    function buildStatsCard(data) {
        const submissionCalendar = data.submissionCalendar || {};
        const totalSubmissions = getTotalSubmissions(submissionCalendar);
        const daysActive = Object.keys(submissionCalendar).length || 0;
        const avgPerDay = daysActive > 0 ? (totalSubmissions / daysActive) : 0;
        const maxStreak = data.maxStreak || data.maxConsecutiveDays || 0;

        const solvedTotalQuestions = data.totalSolved || 0;
        const totalQuestions = data.totalQuestions || 0;

        const cardHTML = `
            <div class="card-item">
                <div class="item-label">Total Submissions</div>
                <div class="item-value">${totalSubmissions}</div>
            </div>
            <div class="card-item">
                <div class="item-label">Problems Solved</div>
                <div class="item-value">${solvedTotalQuestions}</div>
            </div>
            <div class="card-item">
                <div class="item-label">Total Problems</div>
                <div class="item-value">${totalQuestions}</div>
            </div>
            <div class="card-item">
                <div class="item-label">Days Active</div>
                <div class="item-value">${daysActive}</div>
            </div>
        `;

        return cardHTML;
    }

    // Display user stats
    function displayUserStats(parsedData) {
        if (!parsedData || parsedData.status !== "success") {
            showError("No data found");
            return;
        }

        const totalQuestions = parsedData.totalQuestions;
        const totalEasy = parsedData.totalEasy;
        const totalMedium = parsedData.totalMedium;
        const totalHard = parsedData.totalHard;

        const solvedEasyQuestions = parsedData.easySolved || 0;
        const solvedMediumQuestions = parsedData.mediumSolved || 0;
        const solvedHardQuestions = parsedData.hardSolved || 0;

        // Update progress circles
        updateProgress(solvedEasyQuestions, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(solvedMediumQuestions, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHardQuestions, totalHard, hardLabel, hardProgressCircle);

        // Render stats card
        if (cardStatsContainer) {
            cardStatsContainer.innerHTML = buildStatsCard(parsedData);
        }
    }

    // Copy stats to clipboard
    copyBtn.addEventListener("click", function() {
        if (!currentStats) return;
        
        const text = `LeetMetric Stats for ${currentStats.username}:
Total Solved: ${currentStats.totalSolved}
Total Questions: ${currentStats.totalQuestions}
Easy: ${currentStats.easySolved}/${currentStats.totalEasy}
Medium: ${currentStats.mediumSolved}/${currentStats.totalMedium}
Hard: ${currentStats.hardSolved}/${currentStats.totalHard}`;

        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✓ Copied!";
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1500);
        }).catch(err => console.error("Copy failed:", err));
    });

    // Download stats as JSON
    downloadBtn.addEventListener("click", function() {
        if (!currentStats) return;
        
        const blob = new Blob([JSON.stringify(currentStats, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leetmetric_${currentStats.username}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Search form submit
    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

    // Retry button
    retryBtn.addEventListener("click", function() {
        emptyState.hidden = false;
        errorState.hidden = true;
        statsContainer.hidden = true;
        skeleton.style.display = "none";
        usernameInput.focus();
    });

    // Initial focus
    usernameInput.focus();
});
