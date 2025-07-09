import { Client, Databases, Account, Storage } from 'appwrite';
import { config } from './config';

const client = new Client();

client
  .setEndpoint(config.appwrite.endpoint)
  .setProject(config.appwrite.projectId);

// For server-side/admin actions, set API key if available
if (config.appwrite.apiKey) {
  client.setKey(config.appwrite.apiKey);
}

export const appwrite = client;
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client); 