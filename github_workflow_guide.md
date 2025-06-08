# GitHub Workflow Guide for Shopify Automation Tool

This guide will walk you through using GitHub to manage your Shopify Automation Tool codebase, even if you're not very technical. GitHub helps you store your code, track changes, and deploy updates easily.

## Setting Up Your GitHub Repository

### Step 1: Create a GitHub Account (if you don't have one)

1. Go to [GitHub.com](https://github.com)
2. Click "Sign up" and follow the registration process
3. Verify your email address

### Step 2: Create a New Repository

1. Click the "+" icon in the top-right corner of GitHub
2. Select "New repository"
3. Name your repository "shopify-automation-tool"
4. Add a description: "AI-powered content management tool for Shopify and other platforms"
5. Keep it as a "Public" repository (or choose "Private" if you prefer)
6. Check "Add a README file"
7. Click "Create repository"

![Create Repository](https://i.imgur.com/JQpyYjl.png)

### Step 3: Upload the Project Files

The easiest way for non-technical users is to upload files directly through the GitHub web interface:

1. Navigate to your new repository
2. Click "Add file" > "Upload files"
3. Drag and drop the project folders or click to select files
4. Add a commit message like "Initial project upload"
5. Click "Commit changes"

**Note**: You'll need to upload files in batches if there are many files.

## Using GitHub Desktop (Easier for Non-Technical Users)

GitHub Desktop provides a user-friendly interface for managing your repository.

### Step 1: Install GitHub Desktop

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and open the application
3. Sign in with your GitHub account

### Step 2: Clone Your Repository

1. Click "Clone a repository from the Internet..."
2. Select your "shopify-automation-tool" repository
3. Choose where to save it on your computer
4. Click "Clone"

![Clone Repository](https://i.imgur.com/8Jw2Yjl.png)

### Step 3: Make Changes

1. Make changes to files using your preferred text editor
2. Return to GitHub Desktop
3. You'll see changed files listed in the left panel
4. Add a summary of your changes
5. Click "Commit to main"
6. Click "Push origin" to upload changes to GitHub

![Commit Changes](https://i.imgur.com/KLgZQjl.png)

## Setting Up Automatic Deployment

You can set up GitHub Actions to automatically deploy your application when you push changes.

### Step 1: Create Deployment Keys

On your server:

```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "github-deploy-key" -f ~/.ssh/github-deploy-key

# Display the public key (you'll add this to GitHub)
cat ~/.ssh/github-deploy-key.pub

# Display the private key (you'll add this to GitHub Secrets)
cat ~/.ssh/github-deploy-key
```

### Step 2: Add Deploy Key to GitHub

1. Go to your repository on GitHub
2. Click "Settings" > "Deploy keys"
3. Click "Add deploy key"
4. Title: "Server Deploy Key"
5. Key: Paste the public key from your server
6. Check "Allow write access"
7. Click "Add key"

### Step 3: Add GitHub Secrets

1. Go to your repository on GitHub
2. Click "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add the following secrets:
   - Name: `HOST`, Value: Your server IP address
   - Name: `USERNAME`, Value: Your server username
   - Name: `SSH_KEY`, Value: The private key from your server (the entire key including BEGIN and END lines)

![Add Secrets](https://i.imgur.com/9Jw2Yjl.png)

### Step 4: Create GitHub Actions Workflow File

1. In your repository, create a new file at `.github/workflows/deploy.yml`
2. Copy and paste the deployment workflow from the setup guide
3. Commit the file

## Updating Your Application

### Using GitHub Desktop

1. Open GitHub Desktop
2. Make sure your repository is selected
3. Click "Fetch origin" to get the latest changes
4. Make your changes to the files
5. Add a summary of your changes
6. Click "Commit to main"
7. Click "Push origin"

The GitHub Action will automatically deploy your changes to your server.

### Using GitHub Web Interface (for Small Changes)

1. Navigate to your repository on GitHub
2. Find the file you want to edit
3. Click the pencil icon to edit
4. Make your changes
5. Add a commit message
6. Click "Commit changes"

## Monitoring Deployments

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. You'll see all your deployment runs
4. Click on a run to see details
5. Green checkmarks indicate successful deployments
6. Red X marks indicate failed deployments

![Actions Tab](https://i.imgur.com/7Jw2Yjl.png)

## Common GitHub Tasks

### Creating a Branch for New Features

1. In GitHub Desktop, click the current branch dropdown
2. Click "New Branch"
3. Name your branch (e.g., "new-feature")
4. Click "Create Branch"
5. Make your changes
6. Commit and push as usual

### Creating a Pull Request

1. Go to your repository on GitHub
2. Click "Pull requests"
3. Click "New pull request"
4. Select your feature branch to merge into main
5. Click "Create pull request"
6. Add a title and description
7. Click "Create pull request" again

### Merging a Pull Request

1. Go to the pull request
2. If there are no conflicts, click "Merge pull request"
3. Click "Confirm merge"
4. Click "Delete branch" (optional)

## Troubleshooting GitHub Issues

### Authentication Problems

If you're having trouble authenticating:
1. Check that you're logged into the correct GitHub account
2. Try regenerating your personal access token
3. For GitHub Desktop, try signing out and signing back in

### Deployment Failures

If automatic deployments fail:
1. Go to the Actions tab and click on the failed run
2. Expand the step that failed to see the error message
3. Check that your secrets (HOST, USERNAME, SSH_KEY) are correct
4. Verify that your server is accessible

### Merge Conflicts

If you see "Merge Conflicts":
1. In GitHub Desktop, right-click the conflicted file and choose "Open in text editor"
2. Look for sections marked with `<<<<<<<`, `=======`, and `>>>>>>>`
3. Edit the file to resolve the conflict
4. Save the file
5. Commit the changes

## Getting Help

If you encounter issues:
1. Check the [GitHub documentation](https://docs.github.com/)
2. Search for your issue on [Stack Overflow](https://stackoverflow.com/questions/tagged/github)
3. Contact GitHub support through your account settings

Remember, GitHub has a large community of users, so most common issues have already been solved and documented online.
