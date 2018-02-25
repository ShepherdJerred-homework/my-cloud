export let cloudDirectory: string = process.env.CLOUD_DIR || '/Users/jerred/IdeaProjects/my-cloud/cloud/';
export let uploadDirectory: string = process.env.UPLOAD_DIR || '/Users/jerred/IdeaProjects/my-cloud/upload/';
export let serverPort: number;

if (process.env.PORT) {
  serverPort = parseInt(process.env.PORT, 10);
} else {
  serverPort = 8080;
}
