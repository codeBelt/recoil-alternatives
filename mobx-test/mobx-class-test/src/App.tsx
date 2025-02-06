import { observer } from "mobx-react-lite";
import {makeAutoObservable, reaction, runInAction} from "mobx";
import { useState } from "react";

class Store {
  count = 0;
  userId = 1;
  user = {name: ''};

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});

    reaction(
      () => this.userId,
      async (userId) => {
        console.log(`userID set to ${userId}`)
        await this._loadUser(userId);
      },
      {fireImmediately: true}
    );
  }

  get doubleCount() {
    return this.count * 2;
  }

  updateCount(count: number) {
    this.count = count;
  }

  setUserId(userId: number) {
    this.userId = userId;
  }

  async _loadUser(userId: number) {
    const response = await (await fetch(`/${userId}.json`)).json();

    // runInAction prevents MobX warning: state changes must be inside an action, needed only after await.
    runInAction(() => {
      this.user = response;
    })
  }
}

const App = observer(() => {
  // To create a global state, instantiate the Store outside the component.
  const [store] = useState(() => new Store());

  return (
    <>
      <h1 className="text-2xl font-bold">MobX Class (makeAutoObservable)</h1>

      <div className="flex gap-2 items-center mt-4">
        <button
          onClick={() => store.updateCount(store.count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          count is {store.count}
        </button>
        <p>double count is {store.doubleCount}</p>
      </div>
      <div>
        <button
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            store.updateCount(store.count + 1);
          }}
        >
          Externally Increment
        </button>
      </div>

      <div className="flex gap-2 items-center mt-4">
        <select
          value={store.userId}
          onChange={(e) => store.setUserId(+e.target.value)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          <option value={1}>User 1</option>
          <option value={2}>User 2</option>
          <option value={3}>User 3</option>
        </select>
        <p>user is {store.user.name}</p>
      </div>
    </>
  );
});

export default App;
