function filterProjects(category) {
    // Update active button state
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category)) {
            btn.classList.add('active');
        }
    });

    // Filter both featured and other projects
    const allProjects = document.querySelectorAll('.featured-projects .project-card, .other-projects .project-card');
    allProjects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            project.classList.remove('hidden');
            project.style.animation = 'none';
            project.offsetHeight; // Trigger reflow
            project.style.animation = null;
        } else {
            project.classList.add('hidden');
        }
    });
} 