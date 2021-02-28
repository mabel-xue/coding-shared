# js 库

## [fullPage.js](https://alvarotrigo.com/fullPage/zh/#page1)

全屏滚动插件

[github](https://github.com/alvarotrigo/fullpage.js)
[angular-fullpage](https://github.com/alvarotrigo/angular-fullpage)

## [anime.js](https://animejs.com/)

超炫动画库

[数字过渡](https://animejs.com/documentation/#JSobject)，

[按钮-submit-√](https://codepen.io/andrewmillen/pen/MoKLob)

## [Moment.js](https://momentjs.com/)

时间处理库:轻松解决各种时间处理难题，处理多种语言

缺点：库插件时间较早，包依赖较大，可替代库：```Day.js``` or ```date-fns```.

```js
// Format Dates
moment().format('MMMM Do YYYY, h:mm:ss a'); // November 13th 2020, 4:35:18 pm
moment().format('dddd');                    // Friday
moment().format("MMM Do YY");               // Nov 13th 20
moment().format('YYYY [escaped] YYYY');     // 2020 escaped 2020
moment().format();                          // 2020-11-13T16:35:18+08:00
// Relative Time
moment("20111031", "YYYYMMDD").fromNow(); // 9 years ago
moment("20120620", "YYYYMMDD").fromNow(); // 8 years ago
moment().startOf('day').fromNow();        // 17 hours ago
moment().endOf('day').fromNow();          // in 7 hours
moment().startOf('hour').fromNow();       // 35 minutes ago
// Calendar Time
moment().subtract(10, 'days').calendar(); // 11/03/2020
moment().subtract(6, 'days').calendar();  // Last Saturday at 4:35 PM
moment().subtract(3, 'days').calendar();  // Last Tuesday at 4:35 PM
moment().subtract(1, 'days').calendar();  // Yesterday at 4:35 PM
moment().calendar();                      // Today at 4:35 PM
moment().add(1, 'days').calendar();       // Tomorrow at 4:35 PM
moment().add(3, 'days').calendar();       // Monday at 4:35 PM
moment().add(10, 'days').calendar();      // 11/23/2020
// Multiple Locale Support
moment.locale();         // en
moment().format('LT');   // 4:35 PM
moment().format('LTS');  // 4:35:18 PM
moment().format('L');    // 11/13/2020
moment().format('l');    // 11/13/2020
moment().format('LL');   // November 13, 2020
moment().format('ll');   // Nov 13, 2020
moment().format('LLL');  // November 13, 2020 4:35 PM
moment().format('lll');  // Nov 13, 2020 4:35 PM
moment().format('LLLL'); // Friday, November 13, 2020 4:35 PM
moment().format('llll');
```

## [Masonry](https://masonry.desandro.com/)

瀑布流自动布局

## [slick](https://kenwheeler.github.io/slick/)

轮播图，可替代过重的swiper

[github](https://github.com/kenwheeler/slick/)