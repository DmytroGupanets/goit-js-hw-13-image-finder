import '../node_modules/@pnotify/core/dist/BrightTheme.css';
import { alert, notice, info, success, error, defaults } from '../node_modules/@pnotify/core';

export default class Notification {
  constructor() {}

  onError() {
    error({
      title: 'No any matches found!',
      text: 'Check the spelling and try to use generic terms',
      delay: 2000,
      sticker: false,
    });
  }

  onSuccessResult(total) {
    success({
      title: `${total} matches found!`,
      text: 'Scroll down to see more',
      delay: 2000,
      sticker: false,
    });
  }

  onAlert() {
    alert({
      title: 'Search box is empty!',
      delay: 2000,
    });
  }
}
