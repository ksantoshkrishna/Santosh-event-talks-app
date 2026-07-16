// generate_website.js
const fs = require('fs');
const path = require('path');

// Placeholder data for talks
const talks = [
  {
    title: "Introduction to Serverless Architectures",
    speakers: ["Alice Johnson"],
    category: ["Cloud", "Backend"],
    duration: 60,
    description: "A deep dive into serverless computing, its benefits, and common use cases. We'll explore AWS Lambda, Google Cloud Functions, and Azure Functions."
  },
  {
    title: "Mastering React Hooks",
    speakers: ["Bob Williams", "Carol Davis"],
    category: ["Frontend", "JavaScript", "React"],
    duration: 60,
    description: "Learn how to build powerful and reusable components using React Hooks. This session covers useState, useEffect, useContext, and custom hooks."
  },
  {
    title: "Database Optimization Techniques",
    speakers: ["David Miller"],
    category: ["Database", "Backend"],
    duration: 60,
    description: "Explore advanced techniques for optimizing database performance. Topics include indexing strategies, query tuning, and schema design."
  },
  {
    title: "Leveraging WebAssembly for High Performance",
    speakers: ["Eve Taylor"],
    category: ["WebAssembly", "Frontend", "Performance"],
    duration: 60,
    description: "Discover how WebAssembly (Wasm) can bring near-native performance to web applications. We'll look at practical examples and future possibilities."
  },
  {
    title: "Secure Coding Practices for Node.js",
    speakers: ["Frank White", "Grace Green"],
    category: ["Security", "Node.js", "Backend"],
    duration: 60,
    description: "Understand common security vulnerabilities in Node.js applications and learn best practices to prevent them. Topics include input validation, authentication, and dependency management."
  },
  {
    title: "Introduction to Quantum Computing",
    speakers: ["Heidi Black"],
    category: ["Future Tech", "Science"],
    duration: 60,
    description: "An accessible introduction to the fascinating world of quantum computing. We'll cover qubits, superposition, entanglement, and their potential impact."
  }
];

// Event details
const eventStartTime = new Date('2026-07-17T10:00:00'); // Assuming a fixed date for calculation
const talkDuration = 60; // minutes
const transitionDuration = 10; // minutes
const lunchBreakDuration = 60; // minutes
const talksBeforeLunch = 3;

function generateSchedule(talks, startTime, talkDur, transitionDur, lunchDur, talksBefore) {
  const schedule = [];
  let currentTime = new Date(startTime);

  for (let i = 0; i < talks.length; i++) {
    const talk = talks[i];
    const talkStartTime = new Date(currentTime);
    const talkEndTime = new Date(currentTime.getTime() + talkDur * 60 * 1000);

    schedule.push({
      ...talk,
      startTime: talkStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: talkEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    currentTime = new Date(talkEndTime.getTime() + transitionDur * 60 * 1000); // Add transition

    if (i === talksBefore - 1) { // After the specified number of talks, add lunch break
      const lunchStartTime = new Date(currentTime);
      const lunchEndTime = new Date(currentTime.getTime() + lunchDur * 60 * 1000);
      schedule.push({
        title: "Lunch Break",
        speakers: [],
        category: ["Break"],
        duration: lunchDur,
        description: "Enjoy a delicious lunch!",
        startTime: lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      currentTime = new Date(lunchEndTime);
    }
  }
  return schedule;
}

const eventSchedule = generateSchedule(talks, eventStartTime, talkDuration, transitionDuration, lunchBreakDuration, talksBeforeLunch);

const styleCss = `
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f4f4f4;
  color: #333;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1, h2 {
  color: #0056b3;
}

.search-container {
  margin-bottom: 20px;
}

.search-container input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.schedule-item {
  background-color: #e9ecef;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 15px;
}

.schedule-item.break {
  background-color: #ffeeba;
  border-color: #ffc107;
  color: #856404;
  text-align: center;
}

.schedule-item h3 {
  margin-top: 0;
  color: #0056b3;
}

.schedule-item .time {
  font-weight: bold;
  color: #666;
  margin-bottom: 5px;
  display: block;
}

.schedule-item .speakers, .schedule-item .category {
  font-size: 0.9em;
  color: #555;
  margin-bottom: 5px;
}

.schedule-item .description {
  font-size: 0.95em;
  line-height: 1.5;
}

.schedule-item .category span {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 3px 8px;
  border-radius: 3px;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 0.8em;
}
`;

const scriptJs = `
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('categorySearch');
  const scheduleItems = document.querySelectorAll('.schedule-item');

  searchInput.addEventListener('keyup', (event) => {
    const searchTerm = event.target.value.toLowerCase();

    scheduleItems.forEach(item => {
      if (item.classList.contains('break')) {
        item.style.display = ''; // Always show breaks
        return;
      }
      const categories = item.dataset.category ? item.dataset.category.toLowerCase().split(',') : [];
      const title = item.querySelector('h3').textContent.toLowerCase();
      const speakers = item.dataset.speakers ? item.dataset.speakers.toLowerCase().split(',') : [];


      if (categories.some(cat => cat.includes(searchTerm)) || title.includes(searchTerm) || speakers.some(speaker => speaker.includes(searchTerm))) {
        item.style.display = ''; // Show item
      } else {
        item.style.display = 'none'; // Hide item
      }
    });
  });
});
`;

function generateHtml(schedule, css, js) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Talks Event Schedule</title>
    <style>
        ${css}
    </style>
</head>
<body>
    <div class="container">
        <h1>Technical Talks Event</h1>
        <p>A full day of insightful technical talks from industry experts.</p>

        <div class="search-container">
            <input type="text" id="categorySearch" placeholder="Search by category, title, or speaker...">
        </div>

        <h2>Schedule</h2>
        <div id="schedule">
            ${schedule.map(item => `
                <div class="schedule-item ${item.category.includes('Break') ? 'break' : ''}"
                     data-category="${item.category.join(',')}"
                     data-speakers="${item.speakers.join(',')}"
                     data-title="${item.title}">
                    <span class="time">${item.startTime} - ${item.endTime}</span>
                    <h3>${item.title}</h3>
                    ${item.speakers.length > 0 ? `<div class="speakers">Speakers: ${item.speakers.join(', ')}</div>` : ''}
                    <div class="category">
                        ${item.category.filter(cat => cat !== 'Break').map(cat => `<span>${cat}</span>`).join('')}
                    </div>
                    <p class="description">${item.description}</p>
                </div>
            `).join('')}
        </div>
    </div>
    <script>
        ${js}
    </script>
</body>
</html>
  `;
}

const htmlContent = generateHtml(eventSchedule, styleCss, scriptJs);

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent);
console.log('index.html generated successfully!');
