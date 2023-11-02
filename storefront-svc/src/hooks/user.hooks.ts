import EventsBus from '@core/EventBus';
import { MailQueue } from '@core/Queue';
import { Service, Container } from 'typedi';

@Service()
export class UserHooks {
  /**
   * @param {EventsBus} eventsBus
   */
  constructor(protected eventsBus: EventsBus) {
    // Listening to events
    this.eventsBus.subscribe('user#register', this.register());
    this.eventsBus.subscribe('user#updatePassword', this.onUpdatePassword());
  }

  register() {
    return async (result: any) => {
      console.log('UserHooks#onSignup.call %o');

      const { storeName } = result;
      MailQueue.add({ storeName }, { removeOnComplete: true });
    };
  }

  onUpdatePassword() {
    return async ({ result }: any) => {
      console.log('UserHooks#onUpdatePassword.call %o');

      // const { user } = result
    };
  }
}

export default Container.get(UserHooks);
