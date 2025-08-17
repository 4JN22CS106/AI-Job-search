const jobs = [
  {
    title: "Frontend Developer",
    location: "Bengaluru",
    type: "Full-Time",
    skills: ["React", "JavaScript"],
    experienceLevel: "Junior",
    yearsRequired: 2,
    score: 4,
    description: "Build responsive web interfaces using React and modern JavaScript."
  },
  {
    title: "AI Engineer",
    location: "Remote",
    type: "Contract",
    skills: ["Python", "TensorFlow"],
    experienceLevel: "Senior",
    yearsRequired: 5,
    score: 5,
    description: "Design and deploy machine learning models for real-time applications."
  },
  {
    title: "UX Designer",
    location: "Shimoga",
    type: "Full-Time",
    skills: ["Figma", "User Research"],
    experienceLevel: "Junior",
    yearsRequired: 1,
    score: 3,
    description: "Conduct user research and create wireframes and prototypes."
  }
];

let savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.tab:nth-child(${tabName === 'search' ? 1 : 2})`).classList.add('active');

  document.getElementById('searchTab').classList.toggle('hidden', tabName !== 'search');
  document.getElementById('savedTab').classList.toggle('hidden', tabName !== 'saved');

  if (tabName === 'saved') renderJobs(savedJobs, 'savedJobs');
}

function getFilterValues() {
  return {
    location: document.getElementById("location").value,
    type: document.getElementById("type").value,
    jobRole: document.getElementById("jobRole").value,
    skills: document.getElementById("skills").value
      .toLowerCase()
      .split(",")
      .map(s => s.trim())
      .filter(Boolean),
    experienceLevel: document.getElementById("experience").value,
    yearsExperience: parseInt(document.getElementById("yearsExperience").value) || null
  };
}

function jobMatchesAnyFilter(job, filters) {
  let matches = 0;

  if (filters.location && job.location === filters.location) matches++;
  if (filters.type && job.type === filters.type) matches++;
  if (filters.jobRole && job.title === filters.jobRole) matches++;
  if (filters.experienceLevel && job.experienceLevel.toLowerCase() === filters.experienceLevel.toLowerCase()) matches++;
  if (filters.yearsExperience !== null && job.yearsRequired <= filters.yearsExperience) matches++;
  if (
    filters.skills.length > 0 &&
    filters.skills.some(skill => job.skills.map(s => s.toLowerCase()).includes(skill))
  ) matches++;

  return matches > 0;
}

function renderJobs(jobList, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const filters = getFilterValues();
  const isSavedTab = containerId === "savedJobs";

  if (jobList.length === 0) {
    container.innerHTML = "<p>No jobs found matching your criteria.</p>";
    return;
  }

  jobList.forEach((job, index) => {
    const card = document.createElement("div");
    card.className = "job-card";

    let details = "";
    let matched = false;

    if (filters.location && job.location === filters.location) {
      details += `<p><strong>Location:</strong> ${job.location}</p>`;
      matched = true;
    }
    if (filters.type && job.type === filters.type) {
      details += `<p><strong>Type:</strong> ${job.type}</p>`;
      matched = true;
    }
    if (filters.jobRole && job.title === filters.jobRole) {
      details += `<p><strong>Role:</strong> ${job.title}</p>`;
      matched = true;
    }
    if (
      filters.experienceLevel &&
      job.experienceLevel.toLowerCase() === filters.experienceLevel.toLowerCase()
    ) {
      details += `<p><strong>Experience Level:</strong> ${job.experienceLevel}</p>`;
      matched = true;
    }
    if (
      filters.yearsExperience !== null &&
      job.yearsRequired <= filters.yearsExperience
    ) {
      details += `<p><strong>Required Experience:</strong> ${job.yearsRequired}+ yrs</p>`;
      matched = true;
    }
    if (
      filters.skills.length > 0 &&
      filters.skills.some(skill =>
        job.skills.map(s => s.toLowerCase()).includes(skill)
      )
    ) {
      const matchedSkills = job.skills.filter(skill =>
        filters.skills.includes(skill.toLowerCase())
      );
      details += `<p><strong>Skills:</strong> ${matchedSkills.join(", ")}</p>`;
      matched = true;
    }

    if (!matched) {
      details = `
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Type:</strong> ${job.type}</p>
        <p><strong>Role:</strong> ${job.title}</p>
        <p><strong>Experience Level:</strong> ${job.experienceLevel}</p>
        <p><strong>Required Experience:</strong> ${job.yearsRequired}+ yrs</p>
        <p><strong>Skills:</strong> ${job.skills.join(", ")}</p>
      `;
    }

    card.innerHTML = `
      <h3>${job.title}</h3>
      ${details}
      <p><strong>Description:</strong> ${job.description}</p>
      ${!isSavedTab ? `<button onclick="saveJob(${index})">Save Job</button>` : ""}
    `;

    container.appendChild(card);
  });
}
function searchJobs() {
  const filters = getFilterValues();
  const matchedJobs = jobs.filter(job => jobMatchesAnyFilter(job, filters));
  renderJobs(matchedJobs, "results");
}

function saveJob(index) {
  const job = jobs[index];
  if (!savedJobs.some(saved => saved.title === job.title && saved.location === job.location)) {
    savedJobs.push(job);
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    alert("Job saved!");
  } else {
    alert("Job already saved.");
  }
}

// Initial render
searchJobs();
