/* eslint-disable no-unused-vars */
import config from "../config/config";
import { Client, Databases, ID, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appWriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("AppWrite service: getPost()", error);
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("AppWrite service: getPosts()", error);
    }
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("AppWrite service: createPost()", error);
      return false;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("AppWrite service: updateDocument()", error);
      return false;
    }
  }

  async deletePost(slug) {
    try {
       await this.databases.deleteDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("AppWrite service: deleteDocument()", error);
      return false;
    }
  }

  // storage service
  async uploadFile(file){
    try {
      return await this.bucket.createFile(
        config.appWriteBucketId,
        ID.unique(),
        file
      );
      
    } catch (error) {
      console.log("AppWrite service: uploadFile()", error);
      return false;
    }
  }

  //Delete file function
  async deleteFile(fileId){
    try {
      return await this.bucket.deleteFile(
        config.appWriteBucketId,
        fileId
      );
      
    } catch (error) {
      console.log("AppWrite service: deleteFile()", error);
      return false;
    }
  }

  //get File preview function
   getFilePreview(fileId){
    return  this.bucket.getFilePreview(
        config.appWriteBucketId,
        fileId
    );
  }

  getFileView(fileId){
    return  this.bucket.getFileView(
        config.appWriteBucketId,
        fileId
    );
  }


}

const service = new Service();
export default service;
 