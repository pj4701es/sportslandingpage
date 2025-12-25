Netlify deploy instructions
==========================

Steps to deploy this static site to Netlify using the CLI:

1. Install the Netlify CLI (already installed in this environment):

   npm i -g netlify-cli

2. Log in (opens a browser to authenticate):

   netlify login

3. Link or create a site (interactive):

   netlify init

4. Deploy to production from the project root:

   netlify deploy --prod --dir=/workspaces/sportslandingpage

Alternative non-interactive deploy using an access token:

1. Create a personal access token at https://app.netlify.com/user/applications#personal-access-tokens
2. Export it in your shell:

   export NETLIFY_AUTH_TOKEN="<your-token>"

3. Run a one-shot create + deploy:

   netlify sites:create --name my-sports-landing
   netlify deploy --prod --dir=/workspaces/sportslandingpage

Notes:
- The `netlify.toml` file sets the publish directory to the project root. Adjust if you move files.
- If you want, I can attempt to run `netlify deploy` here — you'll need to perform the interactive login step or provide a `NETLIFY_AUTH_TOKEN`.
