/* eslint-disable no-unused-vars */
import config from "../config/config";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appWriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.login({ email, password });
      } else {
        throw new Error("Account creation failed");
      }
    } catch (error) {
      console.error("Error creating account:", error);
    }
  }

  async login({ email, password }) {
    try {
      return this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }
  async getCurrentLoggedUser() {
    try {
        return await this.account.get();
    } catch (error) {
        console.log("Appwrite service Error getting current user:", error);
    }
    return null;
  }
  async logout() {
    try {
      return await this.account.deleteSessions("current");
    } catch (error) {
      console.error("Appwrite service Error logging out:", error);
    }
  }
}

const authService = new AuthService();
export default authService;