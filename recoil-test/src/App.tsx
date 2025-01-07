import { Suspense } from "react";
import {
  atom,
  useRecoilState,
  selector,
  useRecoilValue,
  selectorFamily,
} from "recoil";
import { setRecoil } from "recoil-nexus";

const countState = atom({
  key: "countState",
  default: 0,
});

const doubleCountState = selector({
  key: "doubleCountState",
  get: ({ get }) => {
    const count = get(countState);
    return count * 2;
  },
});

const userIDState = atom({
  key: "userIDState",
  default: 1,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log(`userID set to ${newValue}`);
      });
    },
  ],
});

const userQuery = selectorFamily<{ name: string }, number>({
  key: "userData",
  get: (userID: number) => async () => {
    const response = await fetch(`/${userID}.json`).then((res) => res.json());
    return response;
  },
});

function User() {
  const userID = useRecoilValue(userIDState);
  const userPromise = useRecoilValue(userQuery(userID));

  return <p>user is {userPromise?.name}</p>;
}

function App() {
  const [count, setCount] = useRecoilState(countState);
  const doubleCount = useRecoilValue(doubleCountState);

  const [userID, setUserID] = useRecoilState(userIDState);

  return (
    <>
      <h1 className="text-2xl font-bold">Recoil</h1>

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
            setRecoil(countState, (c) => c + 1);
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
