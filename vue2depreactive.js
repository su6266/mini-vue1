//vue2的事件劫持
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


//为了实现不同属性的劫持，我们打算使用图进行属性以及事件的劫持
//Weakmap{{key（对象）:value}}key是一个对象并且为弱引用
const targetMap = new WeakMap();
function getDep(target , key){
    let depMap = targetMap.get(target);
    if(!depMap){
        depMap = new Map()
        targetMap.set(depMap,target)
    }
    let dep = depMap.get(key);
    if(!dep){
        dep = new Dep()
        depMap.set(key,dep)
    }
    return dep
}

//对于属性的劫持
function reactive(raw){
    Object.keys(raw).forEach(key=>
        {
            const dep = new Dep()
            let value = raw[key]
            Object.defineProperty(raw,key,{
                get(){
                    dep.depend()
                    return value
                },
                set(newValue){
                    if(value!=newValue){
                        value = newValue
                        dep.notify()
                    }
                }
            })
        })
        return raw;
}






 //定义原数据以及实验
const info = reactive({counter:100,name:'su'})

//各种事件的原型
watchEffect(function (){
    console.log(info.counter *2,info.name)
})

watchEffect(function powerCounte(){
    console.log(info.counter * info.counter)
})


info.counter++;
