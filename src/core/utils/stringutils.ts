export class StringUtils {
  static generateRandomAlphaNumeric(length = 5) {
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          result += charset.charAt(randomIndex);
      }
      return result;
  }

}
