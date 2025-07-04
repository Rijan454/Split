export const EXPO_PUBLIC_APPWRITE_PROJECT_ID="686711f3000c4d911c23";
export const EXPO_PUBLIC_APPWRITE_ENDPOINT= "https://syd.cloud.appwrite.io/v1";
export const DEV_API_KEY = "9cd3c2d72aacb6d32f26f1e1c7c47020c59ef63886819cce6c396921b74383ca3d45c56ddd18ee7e5928b9baf000634caa96c7e9384d5160b0023de9304b90dd2cccd1d617b95c0508f9af57f793de7113e583b24f2ca2d73f7b574646763b80549b05960966b1aa32ad72c796bb46ce01af50d8c5554aac7aac1c9e93443a43"
import { Client, Account } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // or your Appwrite endpoint
  .setProject("YOUR_PROJECT_ID");

export const account = new Account(client);
