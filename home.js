document.addEventListener('DOMContentLoaded', function() {
    const jobForm = document.getElementById('job-form');
    const jobList = document.getElementById('application-list');
    const editButton = document.getElementById('edit-button');
    const deleteButton = document.getElementById('delete-button');
    const totalApplicationsDisplay = document.createElement('p'); // to show the total number of applications
    let editingIndex = null; // to track which application is being edited
  
    // to load the job applications from local storage
    const loadApplications = () => {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      jobList.innerHTML = ''; // Clear exising applications
  
      applications.forEach((app, index) => {
        const li = document.createElement('li');
        li.classList.add('job-item');
        li.innerHTML = `
          <p>
            <strong>Application ${index + 1}</strong>: 
            Job ID: ${app.jobId}, 
            Job Title: ${app.title}, 
            Company: ${app.company}, 
            Location: ${app.location || 'N/A'}, 
            <a href="${app.link}" target="_blank">Job Link</a>, 
            Status: ${app.status}
          </p>
        `;
        jobList.appendChild(li);
      });
  
      // to show the total number of applications
      totalApplicationsDisplay.textContent = `Total Applications: ${applications.length}`;
      document.body.appendChild(totalApplicationsDisplay);
    };
  
    // to save application to local storage
    const saveApplication = (application) => {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      if (editingIndex !== null) {
        applications[editingIndex] = application; // to edit existing application
      } else {
        applications.push(application); // to add a new application
      }
      localStorage.setItem('applications', JSON.stringify(applications));
      loadApplications(); // reloads the application list
    };
  
    // Form submission handler
    jobForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const jobId = document.getElementById('job-id').value;
      const title = document.getElementById('job-title').value;
      const company = document.getElementById('company-name').value;
      const location = document.getElementById('location').value;
      const link = document.getElementById('link').value;
      const status = document.getElementById('status').value;
      const resume = document.getElementById('resume').files[0];
  
      // input validation
      if (!jobId || !title || !company || !status) {
        alert('Please fill all required fields.');
        return;
      }
  
      // Create an application object
      const application = {
        jobId,
        title,
        company,
        location,
        link,
        resume: resume ? URL.createObjectURL(resume) : null,
        status
      };
  
      saveApplication(application); // to save the new or edited application
  
      // to reset the form to add a new application after saving
      resetForm();
    });
  
    // to reset the form after saving or editing
    const resetForm = () => {
      jobForm.reset();
      editingIndex = null;
      jobForm.querySelector('button').textContent = 'Add Application';
    };
  
    // Edit button handler
    editButton.addEventListener('click', function() {
      const appNumber = prompt('Enter the application number to edit:');
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      const appIndex = parseInt(appNumber) - 1;
  
      if (isNaN(appIndex) || appIndex < 0 || appIndex >= applications.length) {
        alert('Invalid application number');
        return;
      }
  
      const appToEdit = applications[appIndex];
      editingIndex = appIndex; // to track which application is being editing
  
      // to populate the form with the data
      document.getElementById('job-id').value = appToEdit.jobId;
      document.getElementById('job-title').value = appToEdit.title;
      document.getElementById('company-name').value = appToEdit.company;
      document.getElementById('location').value = appToEdit.location || '';
      document.getElementById('link').value = appToEdit.link || '';
      document.getElementById('status').value = appToEdit.status;
  
      // to change the button text to "Save Changes"
      jobForm.querySelector('button').textContent = 'Save Changes';
    });
  
    // Delete button handler
    deleteButton.addEventListener('click', function() {
      const appNumber = prompt('Enter the application number to delete:');
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      const appIndex = parseInt(appNumber) - 1;
  
      if (isNaN(appIndex) || appIndex < 0 || appIndex >= applications.length) {
        alert('Invalid application number');
        return;
      }
  
      // to remove the application from the list
      applications.splice(appIndex, 1);
      localStorage.setItem('applications', JSON.stringify(applications));
      loadApplications();
    });
  
    loadApplications(); // loads the applications on page load
  });  