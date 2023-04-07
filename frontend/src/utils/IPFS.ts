import { NFTStorage } from 'nft.storage';
import axios from 'axios';

const IPFS_DOMAIN_SUFFIX = '.ipfs.nftstorage.link';
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFhY2IyN0VFNzNiNjQ5YTdDNkRkM2Q2MzBhMjA1ZDg4MDVFNzBGNjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MDg2NjY1ODg5MiwibmFtZSI6ImRlVmF1bHQifQ.XlT70OoXnkGmjVAmYPORG--OFTsdSWixk4AUSBjl7ik';

export default class IPFSClient {
  private static _instance: NFTStorage;

  public static get instance(): NFTStorage {
    if (!this._instance) {
      this._instance = new NFTStorage({
        token: TOKEN,
      });
    }
    return this._instance;
  }

  public static async uploadFile(text: string) {
    return await IPFSClient.instance.storeBlob(new Blob([text]));
  }

  public static getFile(cid: string) {
    return new Promise((resolve, reject) => {
      let url = `https://${cid}${IPFS_DOMAIN_SUFFIX}`;
      axios
        .get(url, { responseType: 'blob' })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
