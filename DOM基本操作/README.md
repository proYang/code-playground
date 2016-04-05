## 文档结构和遍历
- parentNode    获取该节点的父节点 
- childNodes    获取该节点的子节点数组
- firstChild    获取该节点的第一个子节点
- lastChild    获取该节点的最后一个子节点
- nextSibling    获取该节点的下一个兄弟元素
- previoursSibling    获取该节点的上一个兄弟元素
- nodeType    节点的类型
- nodeVlue    Text节点或Comment节点的文本内容
- nodeName    元素的标签名(如P,SPAN,#text(文本节点),DIV)，以大写形式表示
## javascript操作HTML属性 

- getAttribute(); 
- setAttribute();
- //注意这两个方法是不必理会javascript保留字的，HTML属性是什么就怎么写。
## 创建，插入，删除节点

- document.createTextNode()    创建一个文本节点
- document.createElement()    创建一个元素节点
- appendChild()    //将一个节点插入到调用节点的最后面
- insertBefore()    //接受两个参数，第一个为待插入的节点，第二个指明在哪个节点前面，如果不传入第二个参数，则跟appendChild一样，放在最后。
## 删除和替换节点

- removeChild();    由父元素调用，删除一个子节点。注意是直接父元素调用，删除直接子元素才有效，删除孙子元素就没有效果了。
- replaceChild()    //删除一个子节点，并用一个新节点代替它，第一个参数为新建的节点，第二个节点为被替换的节点
