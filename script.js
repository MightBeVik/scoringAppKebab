// Define the scoring categories
const scoringCategories = [
    {
        name: 'Crisis Handling',
        weight: 1.0,
        field: 'crisisHandling',
        question: 'What type of emergency response capability does your app provide?',
        options: [
            { value: 0, text: 'No crisis handling' },
            { value: 2, text: 'Resource-sharing only' },
            { value: 5, text: '24/7 emergency support' }
        ]
    },
    {
        name: 'Response Type',
        weight: 0.9,
        field: 'responseType',
        question: 'How does your app personalize responses to users?',
        options: [
            { value: 0, text: 'Same responses for all users' },
            { value: 3, text: 'Expert-designed static responses' },
            { value: 5, text: 'Learns from user (adaptive personalization)' }
        ]
    },
    {
        name: 'Cost',
        weight: 0.8,
        field: 'cost',
        question: 'What is your pricing model?',
        options: [
            { value: 2, text: 'Subscription-only' },
            { value: 3, text: 'One-time purchase' },
            { value: 5, text: 'Free or strong freemium model' }
        ]
    },
    {
        name: 'Content Style',
        weight: 0.7,
        field: 'contentStyle',
        question: 'What is your primary content delivery method?',
        options: [
            { value: 3, text: 'Voice only' },
            { value: 4, text: 'Gamified interface' },
            { value: 5, text: 'Text-based (text-first interface)' }
        ]
    },
    {
        name: 'Human Oversight',
        weight: 0.6,
        field: 'humanOversight',
        question: 'What level of human oversight does your app provide?',
        options: [
            { value: 0, text: 'No human oversight' },
            { value: 3, text: 'User-controlled / peer review' },
            { value: 5, text: 'Professional clinician oversight or escalation' }
        ]
    },
    {
        name: 'Privacy',
        weight: 0.6,
        field: 'privacy',
        question: 'What data privacy controls do you offer?',
        options: [
            { value: 3, text: 'View-only data access' },
            { value: 4, text: 'Legal policy only' },
            { value: 5, text: 'Full data export + clear policy' }
        ]
    },
    {
        name: 'Effectiveness Evidence',
        weight: 0.5,
        field: 'effectivenessEvidence',
        question: 'What evidence demonstrates your app\'s effectiveness?',
        options: [
            { value: 0, text: 'No evidence provided' },
            { value: 4, text: 'Testimonials / user evidence' },
            { value: 5, text: 'Professional clinical studies' }
        ]
    },
    {
        name: 'Data Handling',
        weight: 0.4,
        field: 'dataHandling',
        question: 'How is user data stored and secured?',
        options: [
            { value: 0, text: 'Unclear or non-secure storage' },
            { value: 4, text: 'Local-only storage' },
            { value: 5, text: 'Secure cloud or hybrid storage' }
        ]
    }
];

const scoreInterpretations = [
    {
        range: [90, 100],
        label: 'Excellent',
        description: 'Your app excels across all dimensions and aligns very well with user preferences. It provides comprehensive mental health support with strong privacy protections, professional oversight, and evidence-based approaches.'
    },
    {
        range: [80, 89],
        label: 'Very Good',
        description: 'Your app performs very well in most areas with strong alignment to user preferences. Consider addressing the lower-scoring dimensions to achieve excellence.'
    },
    {
        range: [70, 79],
        label: 'Good',
        description: 'Your app has solid performance in key areas. Focus on improving crisis handling, professional oversight, or evidence-based features to enhance user trust.'
    },
    {
        range: [50, 69],
        label: 'Fair',
        description: 'Your app has foundational features but significant improvements needed. Consider enhancing privacy controls, adding professional oversight, or improving crisis response capabilities.'
    },
    {
        range: [0, 49],
        label: 'Poor',
        description: 'Your app needs substantial improvements across multiple dimensions. Prioritize adding professional oversight, crisis handling, and robust privacy protections.'
    }
];

let currentQuestion = 0;
let answers = {};

function showQuiz() {
    document.getElementById('quizSection').classList.add('active');
    document.getElementById('resourcesSection').classList.remove('active');
    document.getElementById('quizLink').classList.add('active');
    document.getElementById('resourcesLink').classList.remove('active');
}

function showResources() {
    document.getElementById('quizSection').classList.remove('active');
    document.getElementById('resourcesSection').classList.add('active');
    document.getElementById('quizLink').classList.remove('active');
    document.getElementById('resourcesLink').classList.add('active');
}

function renderQuestion() {
    const category = scoringCategories[currentQuestion];
    const questionCard = document.getElementById('questionCard');
    
    let optionsHTML = '';
    category.options.forEach(option => {
        optionsHTML += `
            <label class="option">
                <input type="radio" name="${category.field}" value="${option.value}" onchange="selectOption(${option.value})">
                <span>${option.text}</span>
            </label>
        `;
    });
    
    questionCard.innerHTML = `
        <h2>${category.name}</h2>
        <p>${category.question}</p>
        <div class="option-group">
            ${optionsHTML}
        </div>
    `;
    
    updateProgress();
}

function selectOption(value) {
    const category = scoringCategories[currentQuestion];
    answers[category.field] = value;
    
    // Auto-advance to next question
    setTimeout(() => {
        if (currentQuestion < scoringCategories.length - 1) {
            currentQuestion++;
            renderQuestion();
        } else {
            // All questions answered - show results
            showResults();
        }
    }, 300);
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / scoringCategories.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Question ${currentQuestion + 1} of ${scoringCategories.length}`;
}

function showResults() {
    const results = [];
    let totalWeightedScore = 0;
    
    scoringCategories.forEach(category => {
        const score = answers[category.field] || 0;
        const weight = category.weight;
        const weightedScore = score * weight;
        
        totalWeightedScore += weightedScore;
        
        results.push({
            name: category.name,
            score: score,
            weight: weight,
            weightedScore: weightedScore
        });
    });
    
    // Final Score = (sum of wi * si / 27.5) * 100
    const finalScore = (totalWeightedScore / 27.5) * 100;
    displayResults(finalScore, results);
    
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('resultsContainer').classList.remove('hidden');
}

function displayResults(finalScore, results) {
    document.getElementById('finalScore').textContent = finalScore.toFixed(1);
    
    // Change circle color based on score (0-100)
    const scoreCircle = document.querySelector('.score-circle');
    if (finalScore >= 90) {
        scoreCircle.style.background = '#000';
    } else if (finalScore >= 80) {
        scoreCircle.style.background = '#1a1a1a';
    } else if (finalScore >= 70) {
        scoreCircle.style.background = '#333';
    } else if (finalScore >= 50) {
        scoreCircle.style.background = '#666';
    } else {
        scoreCircle.style.background = '#999';
    }
    
    // Create breakdown table
    const breakdownBody = document.getElementById('breakdownBody');
    breakdownBody.innerHTML = '';
    
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${result.name}</strong></td>
            <td>${result.score.toFixed(1)}</td>
            <td>${result.weight.toFixed(1)}</td>
            <td>${result.weightedScore.toFixed(2)}</td>
        `;
        breakdownBody.appendChild(row);
    });
    
    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.style.fontWeight = '600';
    totalRow.style.backgroundColor = '#f9f9f9';
    totalRow.innerHTML = `
        <td>Final Score</td>
        <td colspan="2"></td>
        <td>${finalScore.toFixed(1)}</td>
    `;
    breakdownBody.appendChild(totalRow);
    
    // Display interpretation
    const interpretation = getInterpretation(finalScore);
    const interpretationDiv = document.getElementById('interpretation');
    interpretationDiv.innerHTML = `
        <div class="interpretation-text">
            <strong style="font-size: 1.2em;">${interpretation.label}</strong>
        </div>
        <div class="interpretation-text">${interpretation.description}</div>
    `;
}

function getInterpretation(score) {
    for (let interp of scoreInterpretations) {
        if (score >= interp.range[0] && score <= interp.range[1]) {
            return interp;
        }
    }
    return scoreInterpretations[scoreInterpretations.length - 1];
}

function resetQuiz() {
    currentQuestion = 0;
    answers = {};
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('resultsContainer').classList.add('hidden');
    renderQuestion();
}

// Initialize
renderQuestion();
