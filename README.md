GitLab Repository:
https://git01.iis.fhg.de/soliman/streamlit-webapp-test/-/tree/b639ab2e419f494af28e552667b235be97f34120/

Streamlit Web Application Farm Deployment Demo

Overview
--------
This repository is a proof-of-concept for deploying a Streamlit application on the Web Application Farm using GitLab CI/CD and Webmin.

The goal is to investigate whether application changes can be deployed remotely without manually uploading files through the Webmin interface.

Current Architecture
--------------------
GitLab Repository
       |
       | Git push
       v
GitLab CI/CD Pipeline
       |
       | Authenticate to Webmin
       v
Webmin
       |
       | Execute "Git Pull" custom command
       v
Streamlit application directory
       |
       v
Streamlit application

CI/CD Deployment
----------------
The current proof of concept uses GitLab CI/CD to remotely trigger the existing Webmin deployment command.

The pipeline performs the following steps:

1. Install curl in the GitLab runner.
2. Establish an initial Webmin session and save the cookies.
3. Authenticate against the Webmin login endpoint.
4. Store the authenticated Webmin session cookie.
5. Call the Webmin Custom Command responsible for the Git Pull.
6. Webmin pulls the latest repository changes into the Streamlit deployment directory.

The Webmin command currently uses:

POST /custom/run.cgi

id=1691656868
directory=streamlit-webapp-test

Credentials
-----------
The Webmin credentials are NOT stored in this repository.

The pipeline expects the following GitLab CI/CD variables:

WEBMIN_USER
WEBMIN_PASSWORD

These values are configured in the GitLab project settings and are injected into the CI job at runtime.

The credentials should never be committed to .gitlab-ci.yml or any other repository file.

Current Result
--------------
The CI/CD workflow has been successfully tested:

GitLab CI
   |
   v
Webmin authentication
   |
   v
Authenticated Webmin session
   |
   v
Webmin Git Pull command
   |
   v
Latest repository changes pulled
   |
   v
Streamlit deployment updated

A change pushed to the repository was successfully pulled by Webmin through the GitLab CI pipeline.

Open Infrastructure Questions
------------------------------
The current implementation is a proof of concept and uses a Webmin account through GitLab CI/CD variables.

Before using this approach for production deployment, the Web Application Farm/Webmin administrators need to clarify:

- Can a dedicated CI/CD or service account be created for automated deployments?
- What permissions would this account require?
- Can its permissions be restricted to the required deployment command?
- Is there an officially supported Webmin API or authentication mechanism for CI/CD?
- How should the credentials for automated deployment be managed securely?

Using a personal Webmin account is only intended for the current technical test and should not be considered the final deployment setup.

Current Status
-------------
Completed:
- Streamlit application deployed on the Web Application Farm.
- GitLab repository and CI/CD pipeline configured.
- Webmin authentication from GitLab CI successfully tested.
- Webmin Git Pull custom command successfully triggered from GitLab CI.
- Repository changes successfully pulled into the Streamlit deployment.

Pending:
- Define the appropriate Webmin CI/CD/service account.
- Confirm the required Webmin permissions.
- Agree on the final credential-management approach.
- Confirm the final deployment/restart mechanism for the Streamlit application.

Purpose of the Demo
-------------------
This repository is intended for discussion with the infrastructure/Webmin administrators.

It demonstrates that remote CI/CD deployment is technically possible with the currently available Webmin functionality.

The remaining issue is primarily the proper authentication and authorization model for automated deployments, rather than the basic GitLab-to-Webmin deployment workflow.
