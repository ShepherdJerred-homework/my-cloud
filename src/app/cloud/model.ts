/**
 * Exports a model that represents a file on the cloud server
 */

export class CloudFileInfo {
  name: string;
  isDirectory: boolean;
  absolutePath: string;
  cloudPath: string;
  cloudUrlPath: string;

  constructor (name: string, isDirectory: boolean, absolutePath: string, cloudPath: string, cloudUrlPath: string) {
    this.name = name;
    this.isDirectory = isDirectory;
    this.absolutePath = absolutePath;
    this.cloudPath = cloudPath;
    this.cloudUrlPath = cloudUrlPath;
  }

  getFileExtension (): string {
    if (this.name.lastIndexOf('.') !== -1) {
      return this.name.substr(this.name.lastIndexOf('.'));
    } else {
      return '';
    }
  }
}
