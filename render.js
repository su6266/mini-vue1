const h = (tag,props,children) => {
    return{
        tag,
        props,
        children
    }
}

//挂载虚拟node
const mount = (vnode,container) =>{
    //创造一个真实dom并且把虚拟节点挂载上去
    const el = vnode.el = document.createElement(vnode.tag)
    //处理虚拟节点当中的属性
    if(vnode.props){
        for(const key in vnode.props){
            const value = vnode.props[key]
            if(key.startsWith('on')){
                el.addEventListener(key.slice(2).toLowerCase(),value)
            }else{
                el.setAttribute(key,value)
            }
            
        }
    }
    if(vnode.children){
        if(typeof(vnode.children) === "string"){
            el.textContent  = vnode.children
        }else{
            vnode.children.forEach(element => {
                mount(element,el)
            });
        }
    }

    container.appendChild(el)
}

const patch = (n1,n2) => {
    if(n1.tag !== n2.tag){
        const n1Parent = n1.el.parentElement
        n1Parent.removeChild(n1.el)
        mount(n2,n1Parent)
    }else{
        const el = n2.el = n1.el
        //处理原本的props
        const oldProps = n1.props||{}
        const newProps = n2.props||{}
        //获取所有的newprops添加到el
        for(const key in newProps){
            const oldValue = oldProps[key]
            const newValue = newProps[key]
            if(newValue !== oldValue){
                if(key.startsWith('on')){
                    el.addEventListener(key.slice(2).toLowerCase(),newValue)
                }else{
                    el.setAttribute(key,newValue)
                }
            }
        }
        //删除旧的props
        for (const key in oldProps) {
            if (key.startsWith("on")) { // 对事件监听的判断
              const value = oldProps[key];
              el.removeEventListener(key.slice(2).toLowerCase(), value)
            } 
            if (!(key in newProps)) {
              el.removeAttribute(key);
            }
          }
      
        //处理children
        const oldChildren = n1.children ||{}
        const newChildren = n2.children ||{}
        if(typeof(newChildren) === "string"){
            if(typeof(oldChildren) == "string"){
                if(newChildren !== oldChildren){
                    el.textContent = newChildren
                }
            }else{
                el.innerHTML = newChildren
            }
        }else{
            if(typeof oldChildren === "string"){
                el.innerHTML = ""
                newChildren.forEach(item =>{
                    mount(item,el)
                })
            }else{
                const commonLength = Math.min(oldChildren.length,newChildren.length)
                for(let i = 0 ;i<commonLength;i++){
                    patch(oldChildren[i],newChildren[i])
                }
                //newchildren 长于 oldchildren
                if(newChildren.length > oldChildren.length){
                    newChildren.slice(oldChildren.length).forEach(item =>{
                        mount(item,el)
                    })
                }
                //反之
                if(oldChildren.length > newChildren.length){
                    oldChildren.slice(newChildren.length).forEach(item =>{
                        el.removeChild(item.el)
                    })
                }
            }
        }
    }

}

