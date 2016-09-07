## jQuery延迟对象 Deferred
- - -
### Deferred对象简介  
- jQuery对于回调函数的统一解决方案，最初在jquery1.5中加入  
- deferred对象的优点：解决了如何处理耗时操作的问题，对那些操作提供了更好的控制，以及统一的编程接口。把这一套回调函数接口 从ajax操作扩展到了所有操作
- ajax操作时，deferred对象会根据返回结果，自动改变自身的执行状态；但是，在自定义函数中，这个执行状态必须由程序员手动指定。
- - -
### jQuery中deferred对象的三种状态
- `resolved`已完成状态，当检测到此状态，立即调用done()方法中的回调函数
- `reject`失败状态，当检测到此状态，立即调用fail()方法指定的回调函数
- 未完成状态，继续等待或调用progress()方法中的回调函数

### deferred对象基本API
- `$.when()`,为多个操作指定回调函数且参数只能是deferred对象,只要有一个操作是reject() 则是失败调用 fail()
- `deferred.done()`当操作成功时的回调函数
- `deferred.fail()`当操作失败时的回调函数
- `$.Deferred()`可以接受一个函数名(注意!!!是函数名)作为参数 $.Deferred()所生成的deferred对象将作为这个函数的默认参数
- `deffered.resolve()`将deffered对象的执行状态从"未完成"改为"已完成" 从而触发done()方法
- `deffered.reject()`将deffered对象的执行状态从"未完成"改为"已失败" 从而触发fail()方法
- `deferred.promise()`在原来的deferred对象上返回另一个deferred对象,后者只开放与改变执行状态无关的方法 屏蔽与改变执行状态有关的方法 从而使得执行状态不能被改变
- `deferred.then()` 把done()和fail()合在一起写 即then(successFunc, failureFunc )【只能有两个参数】
- 1deferred.always()`不管调用的是deferred.resolve()还是deferred.reject() 最后总是执行

### deferred常用操作

```javascript
//ajax操作
      $.ajax('jQuery-Deferred实践.html')
              .done(function (res) {
                  console.log(res);
                  alert("succeed");
              })
              .fail(function (res) {
                  console.warn(res);
                  alert('failed');
              });
```

```javascript
//自定义函数
     var wait = function(){
                var tasks = function(){
                    alert("执行完毕！");
                };
                setTimeout(tasks, 5000);
     };
     $.Deferred(wait)
                .done(function(){ alert("哈哈，成功了！"); })
                .fail(function(){ alert("出错啦！"); });
```