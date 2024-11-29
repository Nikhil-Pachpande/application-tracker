document.addEventListener('DOMContentLoaded', function() {
    const jobForm = document.getElementById('job-form');
    const jobList = document.getElementById('application-list');
    let editingIndex = null; // to track which application is being edited
  
    // to load the job applications from local storage
    const loadApplications = () => {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      jobList.innerHTML = ''; // Clear existing applications
  
      applications.forEach((app, index) => {
        const li = document.createElement('li');
        li.classList.add('job-item');
  
        // to display the list of applications with Edit and Delete buttons
        li.innerHTML = `
          <p><strong>${app.title}</strong> at ${app.company}</p>
          <p>Status: ${app.status}</p>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        `;
  
        // to add Edit and Delete event listeners
        li.querySelector('.edit-btn').addEventListener('click', function() {
          const appToEdit = applications[index];
          editingIndex = index;
          populateForm(appToEdit); // to populate the form with the selected application's data
        });
  
        li.querySelector('.delete-btn').addEventListener('click', function() {
          deleteApplication(index); // Delete the application
        });
  
        jobList.appendChild(li);
      });
    };
  
    // to populate the form with selected application's data for editing
    const populateForm = (app) => {
      document.getElementById('job-id').value = app.jobId;
      document.getElementById('job-title').value = app.title;
      document.getElementById('company-name').value = app.company;
      document.getElementById('location').value = app.location;
      document.getElementById('description').value = app.description;
      document.getElementById('skills').value = app.skills.join(', ');
      document.getElementById('status').value = app.status;
    };
  
    // to save new application to the local storage
    const saveApplication = (application) => {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      if (editingIndex !== null) {
        applications[editingIndex] = application; // to update the application being edited
      } else {
        applications.push(application); // to add a new application
      }
      localStorage.setItem('applications', JSON.stringify(applications));
      loadApplications(); // reloads the application list
    };
  
    // to delete application from localStorage
    const deleteApplication = (index) => {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      applications.splice(index, 1);
      localStorage.setItem('applications', JSON.stringify(applications));
      loadApplications();
    };
  
    // toandle form submission to add/edit job application
    jobForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const jobId = document.getElementById('job-id').value;
      const title = document.getElementById('job-title').value;
      const company = document.getElementById('company-name').value;
      const location = document.getElementById('location').value;
      const description = document.getElementById('description').value;
      const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());
      const status = document.getElementById('status').value;
      const resume = document.getElementById('resume').files[0];
  
      // input validation
      if (!jobId || !title || !company || !description || skills.length === 0) {
        alert('Please fill out all required fields.');
        return;
      }
  
      if (resume) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const application = {
            jobId,
            title,
            company,
            location,
            description,
            skills,
            status,
            resume: e.target.result // to store the resume as base64 data
          };
          saveApplication(application); // to save the new application
        };
        reader.readAsDataURL(resume); // to read the resume file as base64
      } else {
        alert('Please upload a resume.');
      }
    });
  
    loadApplications(); // loads previously stored applications when the popup opens
  });  