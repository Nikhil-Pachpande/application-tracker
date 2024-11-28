document.addEventListener('DOMContentLoaded', function() {
    const jobForm = document.getElementById('job-form');
    const jobList = document.getElementById('application-list');
  
    // to load the job applications from local storage
    const loadApplications = () => {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      jobList.innerHTML = ''; // Clear existing applications
  
      applications.forEach((app, index) => {
        const li = document.createElement('li');
        li.classList.add('job-item');
  
        // to create editable fields for the job applications
        const jobIdInput = createEditableField('text', 'job-id', app.jobId);
        const jobTitleInput = createEditableField('text', 'job-title', app.title);
        const companyInput = createEditableField('text', 'company-name', app.company);
        const locationInput = createEditableField('text', 'location', app.location);
        const descriptionInput = createEditableField('textarea', 'description', app.description);
        const statusDropdown = createStatusDropdown(app.status);
  
        // this will create the save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Changes';
        saveButton.addEventListener('click', function() {
          // input validation for the fields
          if (!jobIdInput.value || !jobTitleInput.value || !companyInput.value || !descriptionInput.value) {
            alert('Please fill out all required fields.');
            return;
          }
  
          // to update the application data in localStorage
          app.jobId = jobIdInput.value;
          app.title = jobTitleInput.value;
          app.company = companyInput.value;
          app.location = locationInput.value;
          app.description = descriptionInput.value;
          app.status = statusDropdown.value;
  
          applications[index] = app; // to update the application in the array
          localStorage.setItem('applications', JSON.stringify(applications)); // save the application back to local storage after updating
          loadApplications(); // reloads the application list
        });
  
        li.appendChild(jobIdInput);
        li.appendChild(jobTitleInput);
        li.appendChild(companyInput);
        li.appendChild(locationInput);
        li.appendChild(descriptionInput);
        li.appendChild(statusDropdown);
        li.appendChild(saveButton);
        jobList.appendChild(li);
      });
    };
  
    // to create the editable fields (textfield or textarea)
    function createEditableField(type, id, value) {
      const field = document.createElement(type === 'textarea' ? 'textarea' : 'input');
      field.type = type;
      field.id = id;
      field.value = value;
      field.placeholder = `Enter ${id.replace('-', ' ')}`;
      field.required = true;
      if (type === 'textarea') {
        field.rows = 4;
      }
      return field;
    }
  
    // to create the status dropdown
    function createStatusDropdown(currentStatus) {
      const dropdown = document.createElement('select');
      const statusOptions = ['applied', 'interview', 'offer', 'rejected'];
      statusOptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        if (currentStatus === status) {
          option.selected = true;
        }
        dropdown.appendChild(option);
      });
      return dropdown;
    }
  
    // to save new application to the local storage
    const saveApplication = (application) => {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      applications.push(application);
      localStorage.setItem('applications', JSON.stringify(applications));
    };
  
    // to handle form submission to add a new job application
    jobForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const jobId = document.getElementById('job-id').value;
      const title = document.getElementById('job-title').value;
      const company = document.getElementById('company-name').value;
      const location = document.getElementById('location').value;
      const description = document.getElementById('description').value;
      const status = document.getElementById('status').value;
      const resume = document.getElementById('resume').files[0];
  
      // input validation
      if (!jobId || !title || !company || !description) {
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
            status,
            resume: e.target.result // to store the resume as base64 data
          };
          saveApplication(application); // to save the new application
          loadApplications(); // reloads the application list
        };
        reader.readAsDataURL(resume); // to read the resume file as base64
      } else {
        alert('Please upload a resume.');
      }
    });
  
    loadApplications(); // loads previously stored applications when the popup opens
  });  