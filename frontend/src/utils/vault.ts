export default class Vault {
  /**
   * @param plaintext format  domain|username|password  \n
   */
  private _plaintext: string = '';
  private _passwords: Map<string, [{ uname: string; pwd: string; index: number }]> = new Map();

  public build(plaintext: string) {
    this._passwords.clear();
    this._plaintext = plaintext;
    this.initVault();
  }

  /**
   * @param plaintext
   * @param address usernam key
   */
  public initVault() {
    const items = this._plaintext.split('\n');
    if (items.length) {
      for (let i = 0; i < items.length; i++) {
        const [domain, username, password] = items[i].split('|');
        if (domain && username && password) {
          if (this._passwords.has(domain)) {
            this._passwords
              .get(domain)
              ?.push({ uname: username, pwd: password, index: i });
          } else {
            this._passwords.set(domain, [
              { uname: username, pwd: password, index: i },
            ]);
          }
        }
      }
    }
  }

  public getAllPasswords() {
    const passwords: { uname: string; pwd: string; domain: string }[] = [];
    this._passwords.forEach((value, key) => {
      const list = value.map((e) => ({
        ...e,
        domain: key,
      }));
      passwords.push(...list);
    });
    return passwords;
  }

  public queryPasswordsByDomain(domain: string) {
    return this._passwords.get(domain);
  }

  public addPassword(domain: string, username: string, password: string) {
    return this._plaintext + `\n${domain}|${username}|${password}`;
  }

  public delPassword(index: number) {
    const items = this._plaintext.split('\n');
    items.splice(index, 1);
    return items.join('\n');
  }

  public modifyPassword(index: number, domain: string, username: string, password: string) {
    const items = this._plaintext.split('\n');
    items[index] = `${domain}|${username}|${password}`;
    return items.join('\n');
  }
}
