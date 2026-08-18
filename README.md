# Webapplication Farm Deployment Demo

Proof-of-concept repository for investigating:

- Apache/Webapplication Farm hosting
- A minimal Next.js "Hello World" application
- Git/CI-based deployment
- A Streamlit alternative using the custom commands available in the Webmin instance
- Infrastructure blockers, especially permissions and remote deployment

## Important distinction

Streamlit is useful for testing whether the Webapplication Farm can pull code from Git and start an application remotely, but it does **not** replace the original Next.js/Apache requirement.

The original ticket should therefore be tested in two tracks:

1. **Next.js + Apache**: test whether a static Next.js build can be deployed to the Apache document root. If server-side Next.js is required, verify whether Node.js is supported.
2. **Streamlit + Git**: use the existing `Git Clone` / `Git Pull` / `Start Streamlit` custom commands to test the remote Git deployment mechanism.

## Current known result

The `nextjs-test` Webapplication Farm instance was created successfully and a manually uploaded `index.html` was served successfully at the instance URL.

That proves basic Apache/static-file hosting works.

## Next.js demo

The `nextjs/` application is configured for a static export.

Build locally:

    cd nextjs
    npm install
    npm run build

The generated `out/` directory is the deployable static website.

Copy the **contents** of `out/` into the Webapplication Farm document root and verify the instance URL.

This is the safest first Next.js test because Apache can serve the generated HTML/JS/CSS without requiring a Node.js process.

## Streamlit demo

The `streamlit/` application is intentionally minimal.

The Webmin screenshot shows custom commands for:

- Git Clone
- Git Pull
- Start Streamlit
- Stop Streamlit

For the Streamlit test:

1. Use `Git Clone` with the URL of this repository (or your company's Git repository).
2. Use `Git Pull` after changing the application.
3. Use the existing `Start Streamlit` command.
4. Confirm that the updated application is reachable.
5. Record whether any manual permission/configuration step is required.

Do not put credentials or tokens in this repository.

## CI/CD investigation

The repository includes `.gitlab-ci.example.yml` as a discussion template only. It is deliberately not a ready-to-run deployment because the actual approved deployment method and credentials for the Webapplication Farm are infrastructure-specific.

The infrastructure team needs to confirm whether CI is allowed to use SSH/SFTP, a deployment account, or another approved mechanism.

## Questions / blockers to record

- Can CI authenticate to the Webapplication Farm without manual account/file changes?
- Is SSH/SFTP available for the instance?
- Can the CI account write to the document root?
- Is there an approved service account?
- Can the instance run Node.js?
- Is a reverse proxy available if server-side Next.js is required?
- Can Git Clone/Pull be executed non-interactively?
- Does the Webmin custom-command mechanism support automated Git pulls?
- Does deployment require manual administrator intervention?

## Suggested acceptance criteria

### Apache / Next.js

- [ ] Next.js Hello World builds successfully.
- [ ] Static output can be deployed to the Apache document root.
- [ ] The application is reachable through the Webapplication Farm URL.
- [ ] A Git/CI mechanism can update the deployed files.
- [ ] No manual permission-file modification is required for each deployment.

### Streamlit

- [ ] Repository can be cloned using the provided custom command.
- [ ] Streamlit application starts using the provided command.
- [ ] A Git change can be pulled remotely.
- [ ] The running application can be updated/restarted.
- [ ] Required permissions can be provided without ad-hoc manual changes.

## Discussion

This repository is intended as a small, reproducible proof of concept. Keep infrastructure-specific credentials, hostnames, and deployment secrets outside Git.
