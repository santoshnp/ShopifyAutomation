# OpenAI API Key Setup Guide for BizzGuru

This guide will walk you through the process of obtaining and setting up an OpenAI API key for your BizzGuru platform.

## What is an OpenAI API Key?

An OpenAI API key is a secure token that allows your BizzGuru platform to access OpenAI's language models (like GPT-4) for generating content. This is essential for the AI-powered content generation features of BizzGuru.

## Step-by-Step Guide to Obtain an OpenAI API Key

### 1. Create an OpenAI Account

1. Visit [OpenAI's website](https://platform.openai.com/signup)
2. Click "Sign up"
3. You can sign up with:
   - Google account
   - Microsoft account
   - Email address
4. Follow the prompts to complete your account creation
5. Verify your email address if required

### 2. Set Up Billing Information

1. After creating your account, navigate to the [Billing section](https://platform.openai.com/account/billing/overview)
2. Click "Set up paid account"
3. Enter your payment information
   - Credit/debit card
   - Or other available payment methods
4. Set a usage limit (optional but recommended)
   - This helps prevent unexpected charges
   - A good starting point is $20-50/month

### 3. Create an API Key

1. Go to the [API Keys section](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give your key a name (e.g., "BizzGuru Platform")
4. Click "Create secret key"
5. **IMPORTANT**: Copy and save your API key immediately in a secure location
   - The key will only be shown once
   - If you lose it, you'll need to create a new one

![OpenAI API Key Creation](https://i.imgur.com/api_key_creation.png)

### 4. Secure Your API Key

Your API key should be treated like a password:
- Never share it publicly
- Don't commit it to public repositories
- Store it in a password manager or secure note
- In the BizzGuru setup, it will be stored securely in your server's environment variables

## Understanding OpenAI API Costs

OpenAI's API uses a pay-as-you-go pricing model:

1. **Pricing Structure**:
   - Costs are calculated per 1,000 tokens
   - A token is approximately 4 characters or 0.75 words
   - Different models have different pricing tiers

2. **Estimated Costs for BizzGuru**:
   - For a small business generating ~50 content pieces per month:
     - Approximately $5-15/month
   - For medium usage (~200 content pieces per month):
     - Approximately $20-40/month

3. **Cost Control**:
   - Set usage limits in your OpenAI account
   - Monitor usage in the BizzGuru dashboard
   - The BizzGuru platform includes optimizations to minimize token usage

## Troubleshooting API Key Issues

### Common Issues:

1. **"Authentication Error"**:
   - Verify you've copied the full API key correctly
   - Check if the key has been disabled or revoked
   - Create a new key if necessary

2. **"Insufficient Quota"**:
   - Check your billing status
   - Verify payment method is valid
   - Increase your usage limits if needed

3. **"Rate Limit Exceeded"**:
   - This is temporary; wait a minute and try again
   - BizzGuru has built-in rate limiting to prevent this in most cases

## Next Steps

Once you have your OpenAI API key:
1. Keep it secure and accessible for the BizzGuru setup process
2. You'll enter this key during the automated setup script execution
3. The key will be stored securely in your server's environment variables

With your OpenAI API key and server ready, you'll be fully prepared to deploy the BizzGuru platform using our automated setup script.
