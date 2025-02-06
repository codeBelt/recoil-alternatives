# MobX State Management Styles

These are three different styles for defining and managing state in MobX. While there may be other approaches, these three are provided to help you choose the one that best fits your project’s complexity and needs.

When to use each style:

- **Observable Boxes**: This is best for cases where you need individual reactive values (like numbers or strings), but you don't need to bundle them into an object.
- **Plain Observable Object**: Use this when you have simple state without needing to define methods or complex logic within the store.
- **Class-based Store with makeAutoObservable**: This is ideal for more complex applications where you need to manage state, methods, computed values, and reactions in a more structured way, especially with async logic.
Each style has its place depending on the complexity of your application and the level of structure you prefer.

## 1. Observable Boxes ([mobx-atomic-test](mobx-atomic-test))

```ts
const count$ = observable.box(0);
const userId$ = observable.box(1);
const user$ = observable.box({ name: "" });

const doubleCount$ = computed(() => count$.get() * 2);

const updateCount = action((value: number) => count$.set(value));
const setUserId = action((id: number) => userId$.set(id));
const loadUser = action(async (id: number) => {
    const response = await (await fetch(`/${id}.json`)).json();

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
```

This style uses `observable.box()` to create reactive primitives. It’s a slightly more verbose approach, but it’s useful when you want MobX’s reactivity system on individual values, like numbers or strings, rather than on a whole object.

## 2. Plain Observable Object ([mobx-observable-test](mobx-observable-test))

```ts
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
```

This is the simplest form, using `observable` to make an object reactive. It's great for simple state management where you don't need actions, computed values, or reactions. It's an easy choice when you have a small or relatively static state structure.

## 3. Class-based Store ([mobx-class-test](mobx-class-test))

```ts
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

        runInAction(() => {
            this.user = response;
        })
    }
}
```

This style uses a class to encapsulate your state and behavior. The `makeAutoObservable()` function automatically creates observables for properties, actions for methods, and computed values for getters. It's the most scalable option, especially for larger or more complex state management scenarios.
