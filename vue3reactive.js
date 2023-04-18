
//这里是订阅者预存的事件
class Dep{
    constructor(){
        this.subscribers = new Set()
    }

    notify(){
        this.subscribers.forEach(item =>{
            item()
        })
    }

    depend(){
        if(activeEffect){
            this.subscribers.add(activeEffect)
        }
    }
}



let activeEffect = null;
//执行dep当中的一个方法不需要依赖effect，就可以添加到订阅者的set集合当中
function watchEffect(effect){
    activeEffect = effect;
    effect()
    activeEffect = null;
}



//Weakmap{{key（对象）:value}}key是一个对象并且为弱引用
const targetMap = new WeakMap();
function getDep(target , key){
    let depMap = targetMap.get(target);
    if(!depMap){
        depMap = new Map()
        targetMap.set(target,depMap)
    }
    let dep = depMap.get(key);
    if(!dep){
        dep = new Dep()
        depMap.set(key,dep)
    }
    return dep
}

//
function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key);
      dep.depend();
      return target[key];
    },
    set(target, key, newValue) {
      const dep = getDep(target, key);
      target[key] = newValue;
      dep.notify();
    }
  })
}






 //定义原数据以及实验
// const info = reactive({counter:100,name:'su'})

//各种事件的原型
// watchEffect(function (){
//     console.log(info.counter *2,info.name)
// })

// watchEffect(function powerCounte(){
//     console.log(info.counter * info.counter)
// })


// info.counter++;
