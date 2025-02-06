import {observable, action, reaction, computed, runInAction} from "mobx";
import { observer } from "mobx-react-lite";

const count$ = observable.box(0);
const userId$ = observable.box(1);
const user$ = observable.box({ name: "" });

const doubleCount$ = computed(() => count$.get() * 2);

const updateCount = action((value: number) => count$.set(value));
const setUserId = action((id: number) => userId$.set(id));
const loadUser = action(async (id: number) => {
  const response = await (await fetch(`/${id}.json`)).json();

  // runInAction prevents MobX warning: state changes must be inside an action, needed only after await.
  runInAction(() => user$.set(response));
});

reaction(
  () => userId$.get(),
  async (id) => {
    console.log(`userID set to ${id}`)
    await loadUser(id);
  },
  { fireImmediately: true }
);

const App = observer(() => {
  return (
    <>
      <h1 className="text-2xl font-bold">MobX Atomic (observable + action + computed)</h1>

      <div className="flex gap-2 items-center mt-4">
        <button
          onClick={() => updateCount(count$.get() + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          count is {count$.get()}
        </button>
        <p>double count is {doubleCount$.get()}</p>
      </div>
      <div>
        <button
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            updateCount(count$.get() + 1);
          }}
        >
          Externally Increment
        </button>
      </div>

      <div className="flex gap-2 items-center mt-4">
        <select
          value={userId$.get()}
          onChange={(e) => setUserId(+e.target.value)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          <option value={1}>User 1</option>
          <option value={2}>User 2</option>
          <option value={3}>User 3</option>
        </select>
        <p>user is {user$.get().name}</p>
      </div>
    </>
  );
});

export default App;
