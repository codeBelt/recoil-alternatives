import { Suspense } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomFamily } from "jotai/utils";
import { withAtomEffect } from "jotai-effect";

import { store } from "./store";

const countState = atom(0);
const doubleCountState = atom((get) => get(countState) * 2);

const userIDState = withAtomEffect(atom(1), (get) => {
  const userID = get(userIDState);
  console.log(`userID set to ${userID}`);
});
const userQuery = atomFamily((id: number) =>
  atom(async () => {
    const response = await fetch(`/${id}.json`).then((res) => res.json());
    return response;
  })
);

function User() {
  const userID = useAtomValue(userIDState);
  const userPromise = useAtomValue(userQuery(userID));

  return <p>user is {userPromise?.name}</p>;
}

function App() {
  const [count, setCount] = useAtom(countState);
  const doubleCount = useAtomValue(doubleCountState);

  const [userID, setUserID] = useAtom(userIDState);

  return (
    <>
      <h1 className="text-2xl font-bold">Jotai</h1>

      <div className="flex gap-2 items-center mt-4">
        <button
          onClick={() => setCount((count) => count + 1)}
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
            store.set(countState, (c) => c + 1);
          }}
        >
          Externally Increment
        </button>
      </div>

      <div className="flex gap-2 items-center mt-4">
        <select
          value={userID}
          onChange={(e) => setUserID(Number(e.target.value))}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          <option value={1}>User 1</option>
          <option value={2}>User 2</option>
          <option value={3}>User 3</option>
        </select>
        <Suspense fallback={<p>Loading...</p>}>
          <User />
        </Suspense>
      </div>
    </>
  );
}

export default App;
