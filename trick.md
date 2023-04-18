本次这个mini-vue3在
虚拟node进行对比的时候并没有调用到diff算法
以及diff算法当中的二分思想，仅仅只是能进行对比以及简单的对比思想


vue2depreactive是对vue2的每一个属性劫持进行一个实现

vue3reactive是对vue3用proxy对于整个数据进行劫持

vue3好处在于proxy对于数据的劫持可以添加属性并且添加了更多的API