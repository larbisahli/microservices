import UserHooks, { UserHooks as UserHooksType } from './user.hooks';

class HooksRegistry {
  protected _hooks: { user: UserHooksType } | undefined;

  async init() {
    this._hooks = {
      user: UserHooks,
    };
  }

  get hooks() {
    return this._hooks;
  }
}

export default HooksRegistry;
