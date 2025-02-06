import {observable, action, reaction, computed, runInAction} from "mobx";
import { observer } from "mobx-react-lite";

const store = observable({
  count: 0,
  userId: 1,
  user: { name: "" },
});

const doubleCount$ = computed(() => store.count * 2);

const updateCount = action((value: number) => store.count = value);
const setUserId = action((id: number) => store.userId = id);
const loadUser = action(async (id: number) => {
  const response = await (await fetch(`/${id}.json`)).json();

  // runInAction prevents MobX warning: state changes must be inside an action, needed only after await.
  runInAction(() => store.user = response);
});

reaction(
  () => store.userId,
  async (id) => {
    console.log(`userID set to ${id}`)
    await loadUser(id);
  },
  { fireImmediately: true }
);

const App = observer(() => {
  return (
    <>
      <h1 className="text-2xl font-bold">MobX Observable (observable + action + computed)</h1>

      <div className="flex gap-2 items-center mt-4">
        <button
          onClick={() => updateCount(store.count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          count is {store.count}
        </button>
        <p>double count is {doubleCount$.get()}</p>
      </div>
      <div>
        <button
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            updateCount(store.count + 1);
          }}
        >
          Externally Increment
        </button>
      </div>

      <div className="flex gap-2 items-center mt-4">
        <select
          value={store.userId}
          onChange={(e) => setUserId(+e.target.value)}
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
