import { Store, Derived, Effect } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";

const count = new Store(0);

const doubledCount = new Derived({
  fn: () => count.state * 2,
  deps: [count],
});
doubledCount.mount();

const userID = new Store(1);
const user = new Store<{
  name?: string;
}>({});

const userEffect = new Effect({
  fn: async () => {
    console.log("userEffect", userID.state);
    const userData = await fetch(`/${userID.state}.json`).then((res) =>
      res.json()
    );
    user.setState(() => userData);
  },
  deps: [userID],
  eager: true,
});
userEffect.mount();

function User() {
  const userValue = useStore(user);

  return <p>user is {userValue?.name}</p>;
}

function App() {
  const countValue = useStore(count);
  const doubleCountValue = useStore(doubledCount);

  const userIDValue = useStore(userID);

  return (
    <>
      <h1 className="text-2xl font-bold">Tanstack Store</h1>

      <div className="flex gap-2 items-center mt-4">
        <button
          onClick={() => count.setState((c) => c + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          count is {countValue}
        </button>
        <p>double count is {doubleCountValue}</p>
      </div>
      <div>
        <button
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            count.setState((c) => c + 1);
          }}
        >
          Externally Increment
        </button>
      </div>

      <div className="flex gap-2 items-center mt-4">
        <select
          value={userIDValue}
          onChange={(e) => userID.setState(() => +e.target.value)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          <option value={1}>User 1</option>
          <option value={2}>User 2</option>
          <option value={3}>User 3</option>
        </select>
        <User />
      </div>
    </>
  );
}

export default App;
