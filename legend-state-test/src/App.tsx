import { observable } from "@legendapp/state";
import { syncedFetch } from "@legendapp/state/sync-plugins/fetch";
import { use$ } from "@legendapp/state/react";
import { $React } from "@legendapp/state/react-web";

const count$ = observable(0);
const doubleCount$ = observable(() => count$.get() * 2);

const userID$ = observable(1);
const user$ = observable<{ name?: string }>(
  syncedFetch({
    get: () => `/${userID$.get()}.json`,
  })
);

function App() {
  const count = use$(count$);
  const doubleCount = use$(doubleCount$);

  const user = use$(user$);

  return (
    <>
      <h1 className="text-2xl font-bold">Legend State</h1>

      <div className="flex gap-2 items-center mt-4">
        <button
          onClick={() => count$.set(count$.get() + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          count is {count}
        </button>
        <p>double count is {doubleCount}</p>
      </div>
      <div>
        <button
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            count$.set(count$.get() + 1);
          }}
        >
          Externally Increment
        </button>
      </div>

      <div className="flex gap-2 items-center mt-4">
        <$React.select
          $value={userID$}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          <option value={1}>User 1</option>
          <option value={2}>User 2</option>
          <option value={3}>User 3</option>
        </$React.select>
        <p>user is {user?.name}</p>
      </div>
    </>
  );
}

export default App;
