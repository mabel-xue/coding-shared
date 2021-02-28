# rxjs最佳实践

`RxJS`是JavaScript中最流行的`函数响应式编程（FRP）`。每天都有很多人在项目中使用RxJS。大多数开发人员都知道常见的代码精简的最佳实践，但RxJS的最佳实践呢？当涉及到FRP时，你是否知道该做什么和不该做什么？如何在代码中应用它们？

本教程将重点介绍我在日常编写代码时使用的几种最佳实践，并附上实际的例子。内容涵盖以下几点：

1. 避免将所有的逻辑代码写在`subscribe`中
2. 取消订阅
3. 避免重复逻辑
4. 用链式替代嵌套
5. 用`share`处理相同的流
6. 不要暴露`subjects`
7. 使用`弹珠图`测试

话不多说，let’s get it!

## 避免将所有的逻辑代码写在`subscribe`中

想必熟悉Rxjs的开发者马上就能领会题意，不过过于RxJS的初学者来说，这是经常会犯的错误。在你学会如何响应式思考之前，你可能很容易写出下列代码：

```js
pokemon$.subscribe((pokemon: Pokemon) => {
  if (pokemon.type !== "Water") {
    return;
  }
  const pokemonStats = getStats(pokemon);
  logStats(pokemonStats);
  saveToPokedex(pokemonStats);
});
```

`pokemon$ Observable`会产生`Pokemon`对象，我们订阅它是为了访问这个对象，并执行一些操作，比如：如果`Pokemon`类型是`Water`就提前返回，对`getStats()`函数进行调用，记录这个函数返回的统计数据，最后，将数据保存到`Pokedex`中。我们所有的逻辑都在`subscribe`函数里面，这是一种绝对非响应式的做法。

然而，这段代码看起来是不是和我们在传统的命令式编程范式中看到的一模一样？既然RxJS是一个函数响应式编程，我们就必须告别传统的思维方式，开始响应式思维（流！纯函数！）。

那么我们如何让我们的代码变得响应式呢？通过使用RxJS为我们提供的`pipe`操作符:

```js
pokemon$
  .pipe(
    filter(({ type }) => type === "Water"),
    map(pokemon => getStats(pokemon)),
    tap(stats => logStats(stats))
  )
  .subscribe(stats => saveToPokedex(stats));
```

看，我们的代码通过一些简单的改动就从`命令式`变成了`响应式`。它看起来更加简洁了！

Node：有一部分逻辑（`saveToPokedex()`函数）仍然保留在`subscribe`中。是因为把最后一部分逻辑保留在`subscribe`里可以让代码更易阅读。当然，你可以自由选择是否使`subscribe`完全为空。

关于`pipe`中的操作符可通过[官网](https://www.learnrxjs.io/learn-rxjs/operators)进行了解。

## 取消订阅

在使用Observables时，内存泄漏是很危险的。因为，一旦我们订阅了一个`Observable`，它就会无限期地输出值，直到满足以下两个条件之一。

1. 我们手动取消了对`Observable`的订阅
2. 它自己完成了

看起来很简单，那让我们来看看如何取消订阅一个`Observable`：

```js
pokemonSubscription = pokemon$.subscribe(pokemon => {
  // Do something with pokemon
});

pokemonSubscription.unsubscribe();
```

在上面的例子中，你可以看到，我们必须将`pokemon$ Observable`的订阅存储在一个变量中，然后手动调用`unsubscribe()`。目前看来并不难。

但如果我们有更多的`Observable`需要订阅，会发生什么呢？

```js
const pokemonSubscription = pokemon$.subscribe(pokemon => {
  // Do something with pokemon
});

const trainerSubscription = trainer$.subscribe(trainer => {
  // Do something with trainer
});

const numberSubscription = number$.subscribe(number => {
  // Do something with number
});

function stop() {
  pokemonSubscription.unsubscribe();
  trainerSubscription.unsubscribe();
  numberSubscription.unsubscribe();  
}
```

正如你所看到的，随着我们在代码中添加更多的Observables，我们需要跟踪越来越多的订阅，我们的代码开始显得有点拥挤。难道就没有更好的方法来告诉我们的Observables取消订阅吗？幸运的是，有，而且非常非常简单。

我们可以使用`Subject`和`takeUntil()`操作符，来控制Observables的完成。怎么做呢？下面是一个例子：

```js
const stop$ = new Subject<void>();

trainer$
  .pipe(takeUntil(stop$)).subscribe(trainer => {
    // Do something with trainer
  });

pokemon$
  .pipe(takeUntil(stop$)).subscribe(pokemon => {
    // Do something with pokemon
  });

number$
  .pipe(takeUntil(stop$)).subscribe(number => {
    // Do something with number
  });

function stop() {
  stop$.next();
  stop$.complete();
}
```

让我们解释下上面发生了什么。我们已经创建了一个`stop$ Subject`，并且已经用`takeUntil`操作符将三个`Observable`管道化。当`stop$ Subject`产生值的时候，这三个`Observable`将会停止输出值。

那么我们如何让`stop$ Observable`输出值呢？就是通过调用`next()`，每当调用`stop()`函数时，`stop$ Observable`就会输出，所有的Observables就会自动完成。

不再需要存储任何订阅和调用`unsubscribe()`了？`takeUntil`万岁!

## 避免重复逻辑

我们都知道重复的代码是个不好的信号，是应该避免的。如果你不知道，你应该去了解下`DRY原则`。那么你可能想知道哪些情况下会导致有重复的RxJS逻辑。让我们来看看下面的例子：

```js
import { interval, Subject } from "rxjs";
import { takeUntil, filter, scan } from "rxjs/operators";

const number$ = interval(1000);
const stop$: Subject<void> = new Subject();

number$
  .pipe(
    takeUntil(stop$),
    filter(number => isMultipleOfTen(number))
  )
  .subscribe(number => getPokemonById(number));

number$
  .pipe(
    takeUntil(stop$),
    scan(number => number + 1, 0)
  )
  .subscribe(score => console.log({ score }));
```

如你所见，我们有一个`number$ Observable`，它每秒钟都输出一次。我们对这个`Observable`订阅两次：一次是为了用`scan()`记录分数，一次是每十秒调用`getPokemonByID()`函数。看似很简单，但...
注意到我们在Observables中重复了`takeUntil()`逻辑吗？只要我们的代码允许，就应该避免这种情况。怎么避免呢？通过将这个逻辑附加到`源Observable`中，就像这样:

```js
import { interval, Subject } from "rxjs";
import { takeUntil, filter, scan } from "rxjs/operators";

const stop$: Subject<void> = new Subject();
const number$ = interval(1000).pipe(takeUntil(stop$));

number$
  .pipe(filter(number => isMultipleOfTen(number)))
  .subscribe(number => getPokemonById(number));

number$
  .pipe(scan(number => number + 1, 0))
  .subscribe(score => console.log({ score }));
```

## 用链式替代嵌套

避免嵌套订阅非常重要。因为嵌套会让代码变得复杂、凌乱、难以测试，并且会导致一些非常讨厌的错误。

"什么是嵌套订阅？"你可能会问。就是我们在一个`Observable`的订阅块中订阅另一个`Observable`。让我们来看看下面的代码：

```js
getTrainer().subscribe(trainer =>
  getStarterPokemon(trainer).subscribe(pokemon =>
    // Do stuff with pokemon
  )
);
```

看起来不是很整齐，对吧？上面的代码很混乱，很复杂，而且，如果我们需要调用更多的返回Observables的函数，我们将不得不继续添加越来越多的订阅。这开始听起来像是订阅地狱。那么，我们该如何避免嵌套订阅呢？
答案是使用更高阶的映射操作符。这些运算符有`switchMap`、`mergeMap`等。

为了修正我们的例子，我们要利用`switchMap`操作符。为什么要这样做呢？因为`switchMap`会从之前的`Observable`中退订，并切换到内部的`Observable`，在我们的例子中，这就是完美的解决方案。但是，请注意，根据自己的需要，你可能需要使用不同的高阶映射操作符。

```js
getTrainer()
  .pipe(
    switchMap(trainer => getStarterPokemon(trainer))
  )
  .subscribe(pokemon => {
    // Do stuff with pokemon 
  });
```

## 用`share`处理相同的流

你的Angular代码是否总会发出重复的HTTP请求？想知道为什么？继续阅读，你会发现这个常见的bug背后的原因。

大多数Observable是cold的。这意味着当我们订阅它们时，它们的生产者才会被创建和激活。对于`cold Observable`来说，每次我们订阅它们时，都会创建一个新的生产者。所以，如果我们订阅一个`cold Observable`五次，就会创建五个生产者。

那么生产者到底是什么呢？即`Observable`的值的来源（例如，一个DOM事件，一个HTTP请求，一个数组等），这对我们响应式程序员来说意味着什么呢？好吧，比如说，如果我们对一个发出HTTP请求的`Observable`订阅了两次，就会有两次HTTP请求。

下面的例子（借用Angular的`HttpClient`）会触发两个不同的HTTP请求，因为`pokemon$`是一个`cold Observable`，我们要订阅它两次：

```js
pokemon$ = http.get(/* make an http request here*/);
/*Every time we subscribe to pokemon$, an http request will be made*/

pokemon$
  .pipe(
    flatMap(pokemon => pokemon),
    filter(({ type }) => type === "Fire")
  )
  .subscribe(pokemon => {
    // Do something with pokemon
  });

pokemon$.pipe(switchMap(pokemon => getStats(pokemon))).subscribe(stats => {
  // Do something with stats
});
```

你可以想象，这种行为只会导致讨厌的bug，那么我们如何避免它呢？难道就没有一种方法可以多次订阅一个Observable，而不会因为它的源一次次被创建而触发重复的逻辑吗？当然有。请允许我介绍一下`share()`操作符。

这个操作符用来允许多次订阅一个Observable，而不重新创建它的源。换句话说，它将一个Observable由cold变hot。让我们看看它是如何使用的：

```js
pokemon$ = http.get(/* make an http request here*/).pipe(share());
/*The pokemon$ Observable is now hot, we won't have multiple http requests*/

pokemon$
  .pipe(
    flatMap(pokemon => pokemon),
    filter(({ type }) => type === "Fire")
  )
  .subscribe(pokemon => {
    // Do something with pokemon
  });

pokemon$.pipe(switchMap(pokemon => getStats(pokemon))).subscribe(stats => {
  // Do something with stats
});
```

如果你尝试过你会发现，我们的问题神奇地解决了。通过添加`share()`操作符，即使我们订阅了两次，也只会发出一个HTTP请求。

需要注意的是。因为`hot Observable`不会复制源，如果我们晚点订阅一个流，我们将无法访问之前发出的值。`shareReplay()`操作符可以作为解决这个问题的方法。

## 不要暴露`subjects`

使用服务来重用`Observable`是一种常见的做法。但是很多开发者常犯的错误就是通过这样的方式将这些`Subject`直接暴露给外部。

```js
class DataService {
  pokemonLevel$ = new BehaviorSubject<number>(1);
  stop$: Subject<void> = new Subject();

  number$ = interval(1000).pipe(takeUntil(this.stop$));
}
```

不要这样做。通过暴露`Subject`，我们允许任何人向其推送数据--更不用说这完全打破了`DataService`类的封装。与其暴露`Subject`，不如暴露`Subject`的数据。

"这不是同样的事情吗？"你可能会想知道。答案是否定的。如果我们暴露一个`Subject`，那么就会使它的所有方法都可用，包括`next()`函数，它是用来使`Subject`发出一个新值。另一方面，如果我们只是暴露它的数据，就不会让`Subject`的方法可用，只是让它发出的值可用。

那么，如何才能暴露`Subject`的数据而不暴露它的方法呢？通过使用`asObservable()`操作符--它将`Subject`转换为`Observable`。由于`Observable`没有`next()`函数，所以`Subject`的数据将不会被篡改。

```js
class DataService {
  private pokemonLevel = new BehaviorSubject<number>(1);
  private stop$: Subject<void> = new Subject();

  pokemonLevel$ = this.pokemonLevel.asObservable();

  increaseLevel(level: number) {
    if (!this.isValidLevel(level)) {
      throw new Error("Level is not valid");
    }

    this.pokemonLevel.next(level);
  }

  stop() {
    this.stop$.next();
  }

  private isValidLevel(level: number): boolean {
    return level % 2 === 0;
  }
}
```

在上面的代码中，我们有四个不同的事情发生。

- `pokemonLevel`和`stop$ Subject`现在都是私有的，因此不能从`DataService`类外部访问。
- 有了一个`pokemonLevel$ Observable`，它是通过调用pokemonLevel Subject上的`asObservable()`操作符创建的。这样，我们就可以从类外访问`pokemonLevel`数据，同时保证`Subject`不受操纵。
- 你可能已经注意到，对于`stop$ Subject`，我们并没有创建一个`Observable`。这是因为我们不需要从类外访问`stop$`的数据。
- 现在有两个公共方法，分别命名为`increaseLevel()`和`stop()`。后者很简单，很容易理解。它允许我们使私有的`stop$`主体从类外发出--从而完成所有有管道`takeUntil(stop$)`的`Observable`。
- `increaseLevel()`作为一个过滤器，只允许我们向`pokemonLevel() Subject`传递某些值。

这样一来，任何数据都无法进入我们的Subject中，Subject在类中得到了很好的保护。

注意：Observable有`complete()`和`error()`方法，这些方法还是可以用来搞乱Subject的。封装是关键。

## 使用`弹珠图（marble）`测试

我们应该知道，编写测试和编写代码本身一样重要。然而，如果想到要编写RxJS测试，你就会觉得有点望而生畏...不要害怕。从RxJS 6+开始，`RxJS marble-testing utils`将使测试工作变得非常简单。不熟悉弹珠图的可以看[这里](https://rxmarbles.com/)。

即使你是RxJS的初学者，你也应该或多或少地理解这些图。它们相当直观，而且让你很容易理解一些比较复杂的RxJS操作符的工作原理。RxJS测试工具允许我们使用这些弹珠图来编写简单、直观、可视化的测试。你所要做的就是从`rxjs/testing`模块中导入`TestScheduler`，然后开始编写测试!

让我们通过测试`number$ Observable`来看看是如何做到的：

```js
import { TestScheduler } from "rxjs/testing";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

describe("Awesome testing with Marble Diagrams", () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  const isMultipleOfTen = (number: number) => number % 10 === 0;

  it("should filter numbers that aren't multiples of ten", () => {
    scheduler.run(({ cold, expectObservable }) => {
      const values = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10
      };
      const number$ = cold("-a-b-c-d-e-f-g-h-i-j|", values);
      const expectedMarbleDiagram = "-------------------a|";
      const expectedValues = { a: 10 };
      const result = number$.pipe(filter(number => isMultipleOfTen(number)));
      expectObservable(result).toBe(expectedMarbleDiagram, expectedValues);
    });
  });
});
```

由于深入研究弹珠图测试并不是本教程的目标，所以我只简单介绍一下上述代码中出现的关键概念，以便我们对发生的事情有一个基本的了解：

- `TestScheduler`：用于虚拟时间。它接收一个回调，将被helper调用（在示例中，helper指`cold()`和`expectObservable()`）。
- `Run()`：用于虚拟时间。当回调返回时，自动调用`flush()`。
- `-`：每个`-`代表1毫秒的虚拟时间。
- `Cold()`: 创建一个`cold Observable`，其订阅在测试开始时开始。
- `|`: 表示一个Observable的完成。
- 因此，`expectedMarbleDiagram`期望在20ms时发出`a`。
- `expectedValues`变量包含了`Observable`发出的每个项目的预期值。在我们的例子中，`a`是唯一会被发射的值，它等于`10`。
- `ExpectObservable()`：安排一个断言，当`testScheduler`刷新时，这个断言将被执行。在我们的例子中，我们的断言期望`number$ Observable`像`expectedMarbleDiagram`一样，其值包含在`expectedValues`变量中。

你可以在RxJS的[官方文档](https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing)中找到更多关于helpers的信息。

使用`RxJS marble-testing utils`的优势:

- 避免了大量的模板代码。(Jasmine Marbles的用户可能体会到这一点。)
- 使用起来非常简单直观。
- 它很有趣! 即使你并不热衷于写测试，但我可以保证你会喜欢弹珠测试。

再次抛出一个例子，这次的特色是`pokemon$ Observable`测试：

```js
import { TestScheduler } from "rxjs/testing";
import { filter, map } from "rxjs/operators";

describe("Awesome testing with Marble Diagrams", () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  it("should filter non-Water type pokemon and add attack property", () => {
    scheduler.run(({ cold, expectObservable }) => {
      const values = {
        a: { name: "Bulbasur", type: "Grass" },
        b: { name: "Charmander", type: "Fire" },
        c: { name: "Squirtle", type: "Water" }
      };

      const marbleDiagram = "-a-b-c|";
      const pokemon$ = cold(marbleDiagram, values);

      const expectedMarbleDiagram = "-----c|";
      const expectedValues = {
        c: { name: "Squirtle", type: "Water", attack: 30 }
      };
      const result = pokemon$.pipe(
        filter(({ type }) => type === "Water"),
        map(pokemon => ({ ...pokemon, attack: 30 }))
      );

      expectObservable(result).toBe(expectedMarbleDiagram, expectedValues);
    });
  });
});
```

[原文-RxJS Best Practices](https://medium.com/better-programming/rxjs-best-practices-7f559d811514)