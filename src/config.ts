export let cloudDirectory: string = 'cloudDirectory';
export let serverPort: number;

if (process.env.PORT) {
  serverPort = parseInt(process.env.PORT, 10);
} else {
  serverPort = 8080;
}
