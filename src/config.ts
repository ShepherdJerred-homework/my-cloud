/**
 * Exports variables to change the behavior of the program
 */

/**
 * Where the cloud directory should reside
 * @type {(string | undefined) & string}
 */
export let cloudDirectory: string = process.env.CLOUD_DIR || '/Users/jerred/IdeaProjects/my-cloud/cloud/';
/**
 * Where to temporarily save upload files
 * @type {(string | undefined) & string}
 */
export let uploadDirectory: string = process.env.UPLOAD_DIR || '/Users/jerred/IdeaProjects/my-cloud/upload/';
/**
 * What port to listen for HTTP requests
 */
export let serverPort: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
